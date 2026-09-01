import { dimensions, personas } from "./personas";
import { questions } from "./questions";
import { dimensionIds } from "./personas";
import { calculateDimensionScores, matchPersonas } from "./scoring";

const primaryCoveragePatterns: Record<string, string> = {
  P01: "AACACBABCCBABABDBCACCBBDA",
  P02: "BEBADCABCCAABABBCCBCDBBAA",
  P03: "DDBADBABCCBAABBACCCCBAACB",
  P04: "ABDCDACDAAADCBDCBAABBDBDB",
  P05: "DBACDEDCAADBDEDDCDAADACAD",
  P06: "ECBABCCBDCADBACACBBCDDABB",
  P07: "DDBADBABBCBDABBACCDCCBACB",
  P08: "BEDBDCDCCBDCBEDDBDADDABAD",
  P09: "EDBACBCBCABDAABDCACCCBACB",
  P10: "AEBCCBACCCAABAEDBDACDBAAD",
  P11: "EBCBBEBBDCADDACACCBDDBAAB",
  P12: "CADADEACCDDABADDDDADDBBAA",
  P13: "AEDBCEACCDAABDDDBDACCABAA",
  P14: "ABDBBCBCCAADBEECBBADDDDAD",
  P15: "AEDBADDDCBDCBEDDDAABCABAB",
  P16: "CEDCDEDAABADBEDCADADDDCAD",
};

export function validateModel(): string[] {
  const errors: string[] = [];
  const expectedPersonaCount = 16;
  const expectedQuestionCount = 25;

  if (personas.length !== expectedPersonaCount) {
    errors.push(`Expected ${expectedPersonaCount} personas, found ${personas.length}.`);
  }

  if (questions.length !== expectedQuestionCount) {
    errors.push(`Expected ${expectedQuestionCount} questions, found ${questions.length}.`);
  }

  dimensions.forEach((dimension) => {
    const questionCount = questions.filter((question) =>
      question.options.some((option) => option.impacts[dimension.id] !== undefined),
    ).length;

    if (questionCount < 4) {
      errors.push(`${dimension.id} has only ${questionCount} effective questions.`);
    }
  });

  personas.forEach((persona) => {
    if (!persona.imagePath.startsWith("personas/")) {
      errors.push(`${persona.id} has an invalid image path.`);
    }

    persona.recommendedPartnerIds.forEach((partnerId) => {
      if (!personas.some((candidate) => candidate.id === partnerId)) {
        errors.push(`${persona.id} references unknown partner ${partnerId}.`);
      }
    });

    dimensionIds.forEach((dimensionId) => {
      const score = persona.vector[dimensionId];
      if (score === undefined || score < 0 || score > 100) {
        errors.push(`${persona.id} has invalid ${dimensionId} vector score.`);
      }
    });
  });

  questions.forEach((question) => {
    if (question.options.length < 4) {
      errors.push(`${question.id} should have at least four options.`);
    }

    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== question.options.length) {
      errors.push(`${question.id} has duplicate option ids.`);
    }

    question.options.forEach((option) => {
      if (option.text.trim().length < 4) {
        errors.push(`${question.id}/${option.id} has invalid text.`);
      }
    });
  });

  return errors;
}

export function validatePrimaryPersonaCoverage(): string[] {
  const errors: string[] = [];

  personas.forEach((persona) => {
    const pattern = primaryCoveragePatterns[persona.id];
    if (!pattern) {
      errors.push(`Missing primary coverage pattern for ${persona.id}.`);
      return;
    }

    if (pattern.length !== questions.length) {
      errors.push(
        `Primary coverage pattern for ${persona.id} has ${pattern.length} answers; expected ${questions.length}.`,
      );
      return;
    }

    const answers = Object.fromEntries(
      questions.map((question, index) => [question.id, pattern[index]]),
    );
    const scores = calculateDimensionScores(questions, answers);
    const [primary] = matchPersonas(scores);

    if (primary.persona.id !== persona.id) {
      errors.push(
        `Primary coverage pattern for ${persona.id} resolves to ${primary.persona.id}.`,
      );
    }
  });

  return errors;
}
