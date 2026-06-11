import AsyncStorage from "@react-native-async-storage/async-storage";
import { LicenseType, Question } from "../types/Question";

const WRONG_KEY = "WRONG_QUESTIONS";

export interface WrongEntry {
  question: Question;
  wrongCount: number;
  lastWrongDate: string; // ISO
}

type WrongStore = Record<string, Record<string, WrongEntry>>; // license -> questionId -> entry

const read = async (): Promise<WrongStore> => {
  try {
    const raw = await AsyncStorage.getItem(WRONG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const write = async (store: WrongStore): Promise<void> => {
  try {
    await AsyncStorage.setItem(WRONG_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving wrong questions:", error);
  }
};

/**
 * Add (or bump the count of) questions the user answered incorrectly, so they
 * can be reviewed later in the "Câu hay sai" screen.
 */
export const addWrongQuestions = async (
  licenseType: LicenseType,
  questions: Question[]
): Promise<void> => {
  if (questions.length === 0) return;
  const store = await read();
  const bucket = store[licenseType] ?? {};
  const now = new Date().toISOString();

  for (const q of questions) {
    const id = q._id.$oid;
    const existing = bucket[id];
    bucket[id] = {
      question: q,
      wrongCount: (existing?.wrongCount ?? 0) + 1,
      lastWrongDate: now,
    };
  }

  store[licenseType] = bucket;
  await write(store);
};

export const getWrongQuestions = async (
  licenseType: LicenseType
): Promise<WrongEntry[]> => {
  const store = await read();
  const bucket = store[licenseType] ?? {};
  // Most-recently-missed first.
  return Object.values(bucket).sort(
    (a, b) => +new Date(b.lastWrongDate) - +new Date(a.lastWrongDate)
  );
};

export const getWrongCount = async (
  licenseType: LicenseType
): Promise<number> => {
  const store = await read();
  return Object.keys(store[licenseType] ?? {}).length;
};

export const removeWrongQuestion = async (
  licenseType: LicenseType,
  questionId: string
): Promise<void> => {
  const store = await read();
  const bucket = store[licenseType];
  if (bucket && bucket[questionId]) {
    delete bucket[questionId];
    store[licenseType] = bucket;
    await write(store);
  }
};

export const clearWrongQuestions = async (
  licenseType: LicenseType
): Promise<void> => {
  const store = await read();
  delete store[licenseType];
  await write(store);
};
