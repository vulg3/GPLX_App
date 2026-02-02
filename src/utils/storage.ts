import AsyncStorage from "@react-native-async-storage/async-storage";
import { ExamResult, LicenseType, StudyProgress } from "../types/Question";

const KEYS = {
  EXAM_RESULTS: "EXAM_RESULTS",
  STUDY_PROGRESS: "STUDY_PROGRESS",
  SELECTED_LICENSE: "SELECTED_LICENSE",
  ADS_HIDDEN: "ADS_HIDDEN",
};

// Exam Results
export const saveExamResult = async (result: ExamResult): Promise<void> => {
  try {
    const existingResults = await getExamResults();
    const updatedResults = [result, ...existingResults].slice(0, 50); // Giữ 50 kết quả gần nhất
    await AsyncStorage.setItem(
      KEYS.EXAM_RESULTS,
      JSON.stringify(updatedResults)
    );
  } catch (error) {
    console.error("Error saving exam result:", error);
  }
};

export const getExamResults = async (): Promise<ExamResult[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EXAM_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting exam results:", error);
    return [];
  }
};

export const getExamResultsByLicense = async (
  licenseType: LicenseType
): Promise<ExamResult[]> => {
  const allResults = await getExamResults();
  return allResults.filter((result) => result.licenseType === licenseType);
};

export const deleteExamResult = async (resultId: string): Promise<void> => {
  try {
    const existingResults = await getExamResults();
    const updatedResults = existingResults.filter(
      (result) => result.id !== resultId
    );
    await AsyncStorage.setItem(
      KEYS.EXAM_RESULTS,
      JSON.stringify(updatedResults)
    );
  } catch (error) {
    console.error("Error deleting exam result:", error);
  }
};

// Study Progress
export const saveStudyProgress = async (
  progress: StudyProgress
): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STUDY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving study progress:", error);
  }
};

export const getStudyProgress = async (): Promise<StudyProgress | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.STUDY_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting study progress:", error);
    return null;
  }
};

// Selected License Type
export const saveSelectedLicense = async (
  licenseType: LicenseType
): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SELECTED_LICENSE, licenseType);
  } catch (error) {
    console.error("Error saving selected license:", error);
  }
};

export const getSelectedLicense = async (): Promise<LicenseType | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SELECTED_LICENSE);
    return data as LicenseType | null;
  } catch (error) {
    console.error("Error getting selected license:", error);
    return null;
  }
};

// Ads Hidden State
export const setAdsHidden = async (hidden: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ADS_HIDDEN, JSON.stringify(hidden));
  } catch (error) {
    console.error("Error saving ads hidden state:", error);
  }
};

export const getAdsHidden = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.ADS_HIDDEN);
    return data ? JSON.parse(data) : false;
  } catch (error) {
    console.error("Error getting ads hidden state:", error);
    return false;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.EXAM_RESULTS,
      KEYS.STUDY_PROGRESS,
      KEYS.SELECTED_LICENSE,
    ]);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

// Statistics
export const getStatistics = async (licenseType: LicenseType) => {
  const results = await getExamResultsByLicense(licenseType);

  if (results.length === 0) {
    return {
      totalExams: 0,
      passedExams: 0,
      averageScore: 0,
      bestScore: 0,
      passRate: 0,
    };
  }

  const passedExams = results.filter((r) => r.passed).length;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const bestScore = Math.max(...results.map((r) => r.score));

  return {
    totalExams: results.length,
    passedExams,
    averageScore: Math.round(totalScore / results.length),
    bestScore,
    passRate: Math.round((passedExams / results.length) * 100),
  };
};





