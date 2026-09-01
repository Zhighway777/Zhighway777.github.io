import type { AssessmentResult } from "./types";

const nicknameKey = "companyPersona:nickname";
const answersKey = "companyPersona:answers";
const currentIndexKey = "companyPersona:currentIndex";
const resultKey = "companyPersona:result";

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const sessionStore = {
  getNickname() {
    return sessionStorage.getItem(nicknameKey) ?? "";
  },
  setNickname(value: string) {
    sessionStorage.setItem(nicknameKey, value);
  },
  getAnswers() {
    return readJson<Record<string, string>>(answersKey, {});
  },
  setAnswers(value: Record<string, string>) {
    sessionStorage.setItem(answersKey, JSON.stringify(value));
  },
  getCurrentIndex() {
    const value = Number(sessionStorage.getItem(currentIndexKey));
    return Number.isFinite(value) && value >= 0 ? value : 0;
  },
  setCurrentIndex(value: number) {
    sessionStorage.setItem(currentIndexKey, String(value));
  },
  getResult() {
    return readJson<AssessmentResult | null>(resultKey, null);
  },
  setResult(value: AssessmentResult) {
    sessionStorage.setItem(resultKey, JSON.stringify(value));
  },
  clearProgress() {
    sessionStorage.removeItem(answersKey);
    sessionStorage.removeItem(currentIndexKey);
  },
  clearAll() {
    this.clearProgress();
    sessionStorage.removeItem(resultKey);
  },
};
