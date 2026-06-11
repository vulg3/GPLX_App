import { ExamResult, TopicStats, TopicCategory, AnalyticsData } from "../types/Question";

const TOPIC_MAPPING: Record<string, TopicCategory> = {
  "khai-niem": "concepts_rules",
  "quy-tac": "concepts_rules",
  "nghiep-vu": "transport_ops",
  "van-hoa": "driver_ethics",
  "dao-duc": "driver_ethics",
  "ky-thuat": "driving_tech_construct",
  "cau-tao": "driving_tech_construct",
  "bien-bao": "road_signs",
  "sa-hinh": "traffic_situations",
  "tinh-huong": "traffic_situations",
};

const TOPIC_DISPLAY_NAMES: Record<TopicCategory, string> = {
  concepts_rules: "Khái niệm & Quy tắc",
  transport_ops: "Nghiệp vụ vận tải",
  driver_ethics: "Đạo đức người lái xe",
  driving_tech_construct: "Kỹ thuật & Cấu tạo",
  road_signs: "Biển báo đường bộ",
  traffic_situations: "Giải thế Sa hình",
};

/**
 * Calculates analytics based on exam history
 */
export const processAnalytics = (results: ExamResult[]): AnalyticsData => {
  // 1. Calculate Expected Pass Rate (Last 10 tests)
  const last10 = results.slice(0, 10);
  const passedCount = last10.filter((r) => r.passed).length;
  const expectedPassRate = last10.length > 0 ? (passedCount / last10.length) * 100 : 0;

  // 2. Calculate Topic Breakdown (Across all history)
  const stats: Record<TopicCategory, { correct: number; total: number }> = {
    concepts_rules: { correct: 0, total: 0 },
    transport_ops: { correct: 0, total: 0 },
    driver_ethics: { correct: 0, total: 0 },
    driving_tech_construct: { correct: 0, total: 0 },
    road_signs: { correct: 0, total: 0 },
    traffic_situations: { correct: 0, total: 0 },
  };

  results.forEach((result) => {
    result.questions.forEach((q) => {
      const category = q.category.toLowerCase();
      let topic: TopicCategory | null = null;

      // Find the mapped topic
      for (const [key, t] of Object.entries(TOPIC_MAPPING)) {
        if (category.includes(key)) {
          topic = t;
          break;
        }
      }

      if (topic) {
        stats[topic].total++;
        // Find user answer for this question
        const userAnswer = result.answers.find((a) => a.questionId === q._id.$oid);
        if (userAnswer && userAnswer.isCorrect) {
          stats[topic].correct++;
        }
      }
    });
  });

  const topicStats: TopicStats[] = Object.keys(stats).map((key) => {
    const topic = key as TopicCategory;
    const { correct, total } = stats[topic];
    return {
      topic,
      displayName: TOPIC_DISPLAY_NAMES[topic],
      correct,
      total,
      percentage: total > 0 ? (correct / total) * 100 : 0,
    };
  });

  // 3. Exam History for Trend Chart
  const examHistory = results.slice(0, 20).map((r) => ({
    date: r.date,
    score: r.score,
    passed: r.passed,
  })).reverse(); // Oldest to newest for chart

  return {
    expectedPassRate,
    topicStats,
    examHistory,
  };
};
