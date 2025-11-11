import { Question } from "../types/Question";

/**
 * Generates a 25-question exam from a pool of questions
 * Ensures a balanced mix of regular and critical (diem-liet) questions
 */
export function generateExam(allQuestions: Question[]): Question[] {
  // Separate critical and regular questions
  const criticalQuestions = allQuestions.filter((q) =>
    q.category.includes("diem-liet")
  );
  const regularQuestions = allQuestions.filter(
    (q) => !q.category.includes("diem-liet")
  );

  // For a standard Vietnamese driving test:
  // - Typically includes 1-2 critical questions (diem-liet)
  // - Rest are regular questions
  const numCritical = Math.min(2, criticalQuestions.length);
  const numRegular = 25 - numCritical;

  // Shuffle and select questions
  const selectedCritical = shuffleArray([...criticalQuestions]).slice(
    0,
    numCritical
  );
  const selectedRegular = shuffleArray([...regularQuestions]).slice(
    0,
    numRegular
  );

  // Combine and shuffle the final exam
  const examQuestions = shuffleArray([...selectedCritical, ...selectedRegular]);

  return examQuestions;
}

/**
 * Calculates the exam score and determines if the user passed
 * @returns Object containing score, totalQuestions, and passed status
 */
export function calculateScore(
  examQuestions: Question[],
  userAnswers: Record<string, number>
): { score: number; totalQuestions: number; passed: boolean } {
  let correctAnswers = 0;
  let criticalCorrect = true;

  examQuestions.forEach((question) => {
    const userAnswerIndex = userAnswers[question._id.$oid];

    // Check if the answer is correct
    if (userAnswerIndex !== undefined) {
      const isCorrect = question.answers[userAnswerIndex]?.correct || false;

      if (isCorrect) {
        correctAnswers++;
      }

      // Check critical questions - must get all correct
      if (question.category.includes("diem-liet") && !isCorrect) {
        criticalCorrect = false;
      }
    } else {
      // Unanswered critical questions also fail the exam
      if (question.category.includes("diem-liet")) {
        criticalCorrect = false;
      }
    }
  });

  const totalQuestions = examQuestions.length;
  const score = correctAnswers;

  // Pass requirements:
  // 1. Must answer correctly at least 21/25 questions (84%)
  // 2. Must answer all critical questions correctly
  const passed = score >= 21 && criticalCorrect;

  return {
    score,
    totalQuestions,
    passed,
  };
}

/**
 * Groups questions by their category
 * @returns Object with category as key and array of questions as value
 */
export function groupQuestionsByCategory(
  questions: Question[]
): Record<string, Question[]> {
  const grouped: Record<string, Question[]> = {};

  questions.forEach((question) => {
    const category = question.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(question);
  });

  return grouped;
}

/**
 * Converts category code to display name
 * @param category - Category code from the question
 * @returns User-friendly category name
 */
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    "diem-liet": "Câu hỏi điểm liệt",
    "khai-niem": "Khái niệm và quy tắc",
    "nghiep-vu": "Nghiệp vụ vận tải",
    "bien-bao": "Biển báo đường bộ",
    "sa-hinh": "Sa hình",
    "tinh-huong": "Tình huống giao thông",
    "van-hoa": "Văn hóa và đạo đức",
    "ky-thuat": "Kỹ thuật lái xe",
    "cau-tao": "Cấu tạo và sửa chữa",
  };

  // Find matching category name
  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.toLowerCase().includes(key)) {
      return value;
    }
  }

  // Return formatted category if no match found
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
