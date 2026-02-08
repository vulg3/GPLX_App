import { LicenseType, Question } from "../types/Question";

/**
 * Generates an exam from a pool of questions based on license type
 * - License A (Motorbike): 25 questions, 19 minutes, pass: 21/25
 * - License B (Car): 30 questions, 20 minutes, pass: 27/30
 * Ensures a balanced mix of regular and critical (diem-liet) questions
 */
export function generateExam(
  allQuestions: Question[],
  licenseType: LicenseType = "A"
): Question[] {
  // Separate critical and regular questions
  const criticalQuestions = allQuestions.filter((q) =>
    q.category.includes("diem-liet")
  );

  // Group questions by category for structured selection
  const categoryGroups: Record<string, Question[]> = {};
  allQuestions.forEach((q) => {
    const category = q.category.toLowerCase();
    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push(q);
  });

  let examQuestions: Question[] = [];

  if (licenseType === "B") {
    // Car License B: 30 questions total
    // Structure: Traffic rules (8), Signs (9), Driving techniques (1),
    // Structure & Repair (1), Culture & Ethics (1), Situation handling (9)
    // 1 critical question (điểm liệt)

    // Select 1 critical question
    const selectedCritical = shuffleArray([...criticalQuestions]).slice(0, 1);

    // Select questions by category (approximate distribution)
    const selectedByCategory: Question[] = [];

    // Helper to select from category
    const selectFromCategory = (keywords: string[], count: number) => {
      const categoryQuestions = allQuestions.filter((q) => {
        const cat = q.category.toLowerCase();
        return (
          keywords.some((kw) => cat.includes(kw)) &&
          !q.category.includes("diem-liet")
        );
      });
      const selected = shuffleArray([...categoryQuestions]).slice(0, count);
      selectedByCategory.push(...selected);
    };

    selectFromCategory(["khai-niem", "quy-tac"], 8); // Traffic rules
    selectFromCategory(["bien-bao"], 9); // Traffic signs
    selectFromCategory(["ky-thuat"], 1); // Driving techniques
    selectFromCategory(["cau-tao"], 1); // Structure & Repair
    selectFromCategory(["van-hoa", "dao-duc"], 1); // Culture & Ethics
    selectFromCategory(["sa-hinh", "tinh-huong"], 9); // Situation handling

    // Combine critical and selected questions
    examQuestions = [...selectedCritical, ...selectedByCategory];

    // If we don't have enough, fill with random regular questions
    if (examQuestions.length < 30) {
      const remaining = allQuestions.filter(
        (q) =>
          !examQuestions.find((eq) => eq._id.$oid === q._id.$oid) &&
          !q.category.includes("diem-liet")
      );
      const additional = shuffleArray([...remaining]).slice(
        0,
        30 - examQuestions.length
      );
      examQuestions.push(...additional);
    }

    // Shuffle and take exactly 30 questions
    examQuestions = shuffleArray(examQuestions).slice(0, 30);
  } else {
    // Motorbike License A: 25 questions (keep original logic)
    // Typically includes 1-2 critical questions (diem-liet)
    const numCritical = Math.min(2, criticalQuestions.length);
    const numRegular = 25 - numCritical;

    const regularQuestions = allQuestions.filter(
      (q) => !q.category.includes("diem-liet")
    );

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
    examQuestions = shuffleArray([...selectedCritical, ...selectedRegular]);
  }

  return examQuestions;
}

/**
 * Calculates the exam score and determines if the user passed
 * Pass requirements:
 * - License A (Motorbike): 21/25 correct (84%) + no critical errors
 * - License B (Car): 27/30 correct (90%) + no critical errors
 * @returns Object containing score, totalQuestions, and passed status
 */
export function calculateScore(
  examQuestions: Question[],
  userAnswers: Record<string, number>,
  licenseType: LicenseType = "A"
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

  // Pass requirements based on license type:
  // License A (Motorbike): 21/25 questions (84%) + no critical errors
  // License B (Car): 27/30 questions (90%) + no critical errors
  const requiredScore = licenseType === "B" ? 27 : 21;
  const passed = score >= requiredScore && criticalCorrect;

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
