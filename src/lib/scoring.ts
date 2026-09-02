import {
  dimensions,
  MODEL_VERSION,
} from "./personas";
import { QUESTION_SET_VERSION } from "./questions";
import { personas } from "./personas";
import type {
  AssessmentResult,
  DimensionId,
  Persona,
  Question,
} from "./types";

export const SKIP_ANSWER = "SKIP";
export const MINIMUM_EFFECTIVE_ANSWERS = 10;
const IDEAL_DIMENSION_ANSWERS = 4;

export interface ScoringBreakdown {
  dimensionScores: Record<DimensionId, number>;
  dimensionCoverage: Record<DimensionId, number>;
  effectiveAnsweredCount: number;
  skippedCount: number;
  resultConfidence: number;
}

function isEffectiveAnswer(answer: string | undefined): answer is string {
  return Boolean(answer && answer !== SKIP_ANSWER);
}

export function calculateDimensionScores(
  questions: Question[],
  answers: Record<string, string>,
): Record<DimensionId, number> {
  return calculateScoring(questions, answers).dimensionScores;
}

export function calculateScoring(
  questions: Question[],
  answers: Record<string, string>,
): ScoringBreakdown {
  const raw = {} as Record<DimensionId, number>;
  const maxPositive = {} as Record<DimensionId, number>;
  const maxNegative = {} as Record<DimensionId, number>;
  const answeredQuestionCount = {} as Record<DimensionId, number>;
  let effectiveAnsweredCount = 0;
  let skippedCount = 0;

  dimensions.forEach((dimension) => {
    raw[dimension.id] = 0;
    maxPositive[dimension.id] = 0;
    maxNegative[dimension.id] = 0;
    answeredQuestionCount[dimension.id] = 0;
  });

  questions.forEach((question) => {
    const optionId = answers[question.id];
    if (optionId === SKIP_ANSWER) {
      skippedCount += 1;
      return;
    }

    const option = question.options.find((item) => item.id === optionId);
    if (!isEffectiveAnswer(optionId) || !option) {
      return;
    }

    effectiveAnsweredCount += 1;

    dimensions.forEach((dimension) => {
      const impacts = question.options.flatMap((item) =>
        item.impacts[dimension.id] !== undefined
          ? [item.impacts[dimension.id] as number]
          : [],
      );
      if (impacts.length === 0) return;

      answeredQuestionCount[dimension.id] += 1;
      maxPositive[dimension.id] += Math.max(0, ...impacts);
      maxNegative[dimension.id] += Math.min(0, ...impacts);

      const impact = option?.impacts[dimension.id];
      if (impact) {
        raw[dimension.id] += impact;
      }
    });
  });

  const dimensionScores = dimensions.reduce((result, dimension) => {
    const scale = Math.max(
      maxPositive[dimension.id],
      Math.abs(maxNegative[dimension.id]),
      1,
    );
    const score = 50 + (raw[dimension.id] / scale) * 50;
    result[dimension.id] = Math.round(Math.min(100, Math.max(0, score)));
    return result;
  }, {} as Record<DimensionId, number>);

  const dimensionCoverage = dimensions.reduce((result, dimension) => {
    result[dimension.id] = Math.min(
      1,
      answeredQuestionCount[dimension.id] / IDEAL_DIMENSION_ANSWERS,
    );
    return result;
  }, {} as Record<DimensionId, number>);

  const resultConfidence = dimensions.reduce(
    (total, dimension) => total + dimension.weight * dimensionCoverage[dimension.id],
    0,
  ) / dimensions.reduce((total, dimension) => total + dimension.weight, 0);

  return {
    dimensionScores,
    dimensionCoverage,
    effectiveAnsweredCount,
    skippedCount,
    resultConfidence,
  };
}

export function matchPersonas(
  dimensionScores: Record<DimensionId, number>,
  dimensionCoverage?: Record<DimensionId, number>,
): Array<{ persona: Persona; matchScore: number }> {
  const fullDenominator = dimensions.reduce(
    (total, dimension) => total + dimension.weight * 100 * 100,
    0,
  );
  const activeWeights = dimensions.map((dimension) => ({
    dimension,
    weight: dimension.weight * (dimensionCoverage?.[dimension.id] ?? 1),
  }));
  const denominator = activeWeights.reduce(
    (total, item) => total + item.weight * 100 * 100,
    0,
  );

  if (denominator === 0) {
    return personas
      .map((persona) => ({ persona, matchScore: 0 }))
      .sort((a, b) => a.persona.id.localeCompare(b.persona.id));
  }

  return personas
    .map((persona) => {
      const squaredDistance = activeWeights.reduce(
        (total, item) =>
          total +
          item.weight *
          (dimensionScores[item.dimension.id] - persona.vector[item.dimension.id]) ** 2,
        0,
      );
      // Attraction calibration was fitted at full coverage. Scale it with the
      // information actually available so skipped dimensions cannot dominate.
      const calibratedBonus = persona.distanceBonus * denominator / fullDenominator;
      const normalizedDistance = Math.sqrt(
        Math.max(0, squaredDistance - calibratedBonus) / denominator,
      );
      return {
        persona,
        matchScore: Math.max(0, Math.min(1, 1 - normalizedDistance)),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function buildResult(
  questions: Question[],
  answers: Record<string, string>,
  nickname: string,
): AssessmentResult {
  const scoring = calculateScoring(questions, answers);
  const matches = matchPersonas(
    scoring.dimensionScores,
    scoring.dimensionCoverage,
  );
  const [primary, secondary] = matches;

  return {
    version: `${MODEL_VERSION}/${QUESTION_SET_VERSION}`,
    nickname: nickname.trim() || "匿名同事",
    dimensionScores: scoring.dimensionScores,
    primaryPersonaId: primary.persona.id,
    secondaryPersonaId: secondary.persona.id,
    matchScores: matches.reduce((result, item) => {
      result[item.persona.id] = Number(item.matchScore.toFixed(4));
      return result;
    }, {} as Record<string, number>),
    answeredCount: Object.keys(answers).length,
    effectiveAnsweredCount: scoring.effectiveAnsweredCount,
    skippedCount: scoring.skippedCount,
    dimensionCoverage: scoring.dimensionCoverage,
    resultConfidence: scoring.resultConfidence,
    createdAt: new Date().toISOString(),
  };
}
