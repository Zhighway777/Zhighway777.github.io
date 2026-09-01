export type DimensionId =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D5"
  | "D6"
  | "D7"
  | "D8"
  | "D9"
  | "D10";

export interface Dimension {
  id: DimensionId;
  name: string;
  shortName: string;
  leftPole: string;
  rightPole: string;
  description: string;
  weight: number;
}

export interface Persona {
  id: string;
  name: string;
  englishName: string;
  nickname: string;
  imagePath: string;
  slogan: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  collaborationStyle: string;
  recommendedPartnerIds: string[];
  vector: Record<DimensionId, number>;
}

export interface QuestionOption {
  id: string;
  text: string;
  impacts: Partial<Record<DimensionId, number>>;
}

export interface Question {
  id: string;
  scenario: string;
  text: string;
  options: QuestionOption[];
}

export interface AssessmentResult {
  version: string;
  nickname: string;
  dimensionScores: Record<DimensionId, number>;
  primaryPersonaId: string;
  secondaryPersonaId: string;
  matchScores: Record<string, number>;
  answeredCount: number;
  createdAt: string;
}
