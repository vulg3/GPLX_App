import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  AnimatedCard,
  PressableScale,
  TouchableScreenWrapper,
} from "../components";
import { ExamResult } from "../types/Question";

const { width } = Dimensions.get("window");

export default function ReviewAnswers() {
  const route = useRoute();
  const navigation = useNavigation();
  const { examResult } = route.params as { examResult: ExamResult };

  const getUserAnswer = (questionId: string) => {
    return examResult.answers.find((a) => a.questionId === questionId);
  };

  return (
    <TouchableScreenWrapper>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#fff", "#f8f9fa"]} style={styles.header}>
          <PressableScale
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹ Quay lại</Text>
          </PressableScale>
          <Text style={styles.headerTitle}>Xem đáp án chi tiết</Text>
          <View style={{ width: 80 }} />
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <AnimatedCard delay={100} style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📊 Tổng quan</Text>
            <View style={styles.summaryRow}>
              <Animated.View
                entering={FadeInDown.delay(200).springify()}
                style={styles.summaryItem}
              >
                <LinearGradient
                  colors={["#34C759", "#28a745"]}
                  style={styles.summaryIconBg}
                >
                  <Text style={styles.summaryIcon}>✓</Text>
                </LinearGradient>
                <Text style={[styles.summaryValue, { color: "#34C759" }]}>
                  {examResult.answers.filter((a) => a.isCorrect).length}
                </Text>
                <Text style={styles.summaryLabel}>Đúng</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(300).springify()}
                style={styles.summaryItem}
              >
                <LinearGradient
                  colors={["#FF3B30", "#dc2626"]}
                  style={styles.summaryIconBg}
                >
                  <Text style={styles.summaryIcon}>✗</Text>
                </LinearGradient>
                <Text style={[styles.summaryValue, { color: "#FF3B30" }]}>
                  {examResult.answers.filter((a) => !a.isCorrect).length}
                </Text>
                <Text style={styles.summaryLabel}>Sai</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInDown.delay(400).springify()}
                style={styles.summaryItem}
              >
                <LinearGradient
                  colors={["#007AFF", "#5856D6"]}
                  style={styles.summaryIconBg}
                >
                  <Text style={styles.summaryIcon}>📊</Text>
                </LinearGradient>
                <Text style={styles.summaryValue}>{examResult.score}</Text>
                <Text style={styles.summaryLabel}>Điểm</Text>
              </Animated.View>
            </View>
          </AnimatedCard>

          {examResult.questions.map((question, index) => {
            const userAnswer = getUserAnswer(question._id.$oid);
            const isCorrect = userAnswer?.isCorrect || false;
            const userSelectedIndex = userAnswer?.selectedAnswerIndex;
            const correctAnswerIndex = question.answers.findIndex(
              (a) => a.correct
            );
            const isDiemLiet = question.category.includes("diem-liet");

            return (
              <AnimatedCard
                key={question._id.$oid}
                delay={200 + index * 50}
                style={[
                  styles.questionCard,
                  isCorrect
                    ? styles.questionCardCorrect
                    : styles.questionCardWrong,
                ]}
              >
                {/* Question Header */}
                <View style={styles.questionHeader}>
                  <View style={styles.questionLeft}>
                    <View
                      style={[
                        styles.questionStatus,
                        isCorrect
                          ? styles.questionStatusCorrect
                          : styles.questionStatusWrong,
                      ]}
                    >
                      <Text style={styles.questionStatusText}>
                        {isCorrect ? "✓" : "✗"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.questionNumber}>Câu {index + 1}</Text>
                      {isDiemLiet && (
                        <View style={styles.criticalBadge}>
                          <Text style={styles.criticalBadgeText}>
                            Điểm liệt
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Question Text */}
                <Text style={styles.questionText}>{question.question}</Text>

                {/* Question Image */}
                {question.hinhanhq && (
                  <Image
                    source={{
                      uri: `https://600cauhoigplx.com${question.hinhanhq}`,
                    }}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                )}

                {/* Answers */}
                <View style={styles.answersContainer}>
                  {question.answers.map((answer, answerIndex) => {
                    const isUserSelected = userSelectedIndex === answerIndex;
                    const isCorrectAnswer = answerIndex === correctAnswerIndex;

                    return (
                      <View
                        key={answerIndex}
                        style={[
                          styles.answerItem,
                          isCorrectAnswer && styles.answerItemCorrect,
                          isUserSelected &&
                            !isCorrectAnswer &&
                            styles.answerItemWrong,
                        ]}
                      >
                        <View style={styles.answerLeft}>
                          <View
                            style={[
                              styles.answerIndicator,
                              isCorrectAnswer && styles.answerIndicatorCorrect,
                              isUserSelected &&
                                !isCorrectAnswer &&
                                styles.answerIndicatorWrong,
                            ]}
                          >
                            {isCorrectAnswer && (
                              <Text style={styles.answerCheckmark}>✓</Text>
                            )}
                            {isUserSelected && !isCorrectAnswer && (
                              <Text style={styles.answerCross}>✗</Text>
                            )}
                          </View>
                          <Text
                            style={[
                              styles.answerText,
                              isCorrectAnswer && styles.answerTextCorrect,
                              isUserSelected &&
                                !isCorrectAnswer &&
                                styles.answerTextWrong,
                            ]}
                          >
                            {answer.text}
                          </Text>
                        </View>
                        {isUserSelected && (
                          <View style={styles.answerBadge}>
                            <Text style={styles.answerBadgeText}>Bạn chọn</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Explanation */}
                {question.explanation && (
                  <View style={styles.explanationContainer}>
                    <Text style={styles.explanationTitle}>💡 Giải thích:</Text>
                    <Text style={styles.explanationText}>
                      {question.explanation}
                    </Text>
                  </View>
                )}
              </AnimatedCard>
            );
          })}

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>
    </TouchableScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  questionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionCardCorrect: {
    borderLeftColor: "#34C759",
  },
  questionCardWrong: {
    borderLeftColor: "#FF3B30",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  questionStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  questionStatusCorrect: {
    backgroundColor: "#34C759",
  },
  questionStatusWrong: {
    backgroundColor: "#FF3B30",
  },
  questionStatusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  criticalBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  criticalBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 24,
    marginBottom: 12,
  },
  questionImage: {
    width: width - 64,
    height: (width - 64) * 0.6,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  answersContainer: {
    gap: 10,
  },
  answerItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerItemCorrect: {
    backgroundColor: "#d4edda",
    borderColor: "#34C759",
  },
  answerItemWrong: {
    backgroundColor: "#f8d7da",
    borderColor: "#FF3B30",
  },
  answerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  answerIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  answerIndicatorCorrect: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  answerIndicatorWrong: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  answerCheckmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  answerCross: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  answerTextCorrect: {
    fontWeight: "600",
    color: "#155724",
  },
  answerTextWrong: {
    color: "#721c24",
  },
  answerBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  answerBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  explanationContainer: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
});
