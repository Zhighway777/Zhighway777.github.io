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

export function calculateDimensionScores(
  questions: Question[],
  answers: Record<string, string>,
): Record<DimensionId, number> {
  const raw = {} as Record<DimensionId, number>;
  const maxPositive = {} as Record<DimensionId, number>;
  const maxNegative = {} as Record<DimensionId, number>;

  dimensions.forEach((dimension) => {
    raw[dimension.id] = 0;
    maxPositive[dimension.id] = 0;
    maxNegative[dimension.id] = 0;
  });

  questions.forEach((question) => {
    const optionId = answers[question.id];
    const option = question.options.find((item) => item.id === optionId);

    dimensions.forEach((dimension) => {
      const impacts = question.options.flatMap((item) =>
        item.impacts[dimension.id] !== undefined
          ? [item.impacts[dimension.id] as number]
          : [],
      );
      maxPositive[dimension.id] += Math.max(0, ...impacts);
      maxNegative[dimension.id] += Math.min(0, ...impacts);

      const impact = option?.impacts[dimension.id];
      if (impact) {
        raw[dimension.id] += impact;
      }
    });
  });

  return dimensions.reduce((result, dimension) => {
    const scale = Math.max(
      maxPositive[dimension.id],
      Math.abs(maxNegative[dimension.id]),
      1,
    );
    const score = 50 + (raw[dimension.id] / scale) * 50;
    result[dimension.id] = Math.round(Math.min(100, Math.max(0, score)));
    return result;
  }, {} as Record<DimensionId, number>);
}

export function matchPersonas(
  dimensionScores: Record<DimensionId, number>,
): Array<{ persona: Persona; matchScore: number }> {
  const denominator = dimensions.reduce(
    (total, dimension) => total + dimension.weight * 100 * 100,
    0,
  );

  return personas
    .map((persona) => {
      const squaredDistance = dimensions.reduce(
        (total, dimension) =>
          total +
          dimension.weight *
            (dimensionScores[dimension.id] - persona.vector[dimension.id]) ** 2,
        0,
      );
      const normalizedDistance = Math.sqrt(
        Math.max(0, squaredDistance - persona.distanceBonus) / denominator,
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
  const dimensionScores = calculateDimensionScores(questions, answers);
  const matches = matchPersonas(dimensionScores);
  const [primary, secondary] = matches;

  return {
    version: `${MODEL_VERSION}/${QUESTION_SET_VERSION}`,
    nickname: nickname.trim() || "匿名同事",
    dimensionScores,
    primaryPersonaId: primary.persona.id,
    secondaryPersonaId: secondary.persona.id,
    matchScores: matches.reduce((result, item) => {
      result[item.persona.id] = Number(item.matchScore.toFixed(4));
      return result;
    }, {} as Record<string, number>),
    answeredCount: Object.keys(answers).length,
    createdAt: new Date().toISOString(),
  };
}
