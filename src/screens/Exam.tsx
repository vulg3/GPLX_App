import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import {
  AnimatedProgressBar,
  LoadingSpinner,
  PressableScale,
} from "../components";
import { ExamResult, LicenseType, Question } from "../types/Question";
import { calculateScore, generateExam } from "../utils/examGenerator";
import { saveExamResult } from "../utils/storage";

const { width } = Dimensions.get("window");

export default function Exam() {
  const route = useRoute();
  const navigation = useNavigation();
  const { questions: allQuestions, licenseType } = route.params as {
    questions: Question[];
    licenseType: LicenseType;
  };

  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(19 * 60); // 19 phút
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Tạo đề thi 25 câu
    const exam = generateExam(allQuestions);
    setExamQuestions(exam);

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const currentQuestion = examQuestions[currentQuestionIndex];
    setUserAnswers({
      ...userAnswers,
      [currentQuestion._id.$oid]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitConfirm = () => {
    const unanswered = examQuestions.length - Object.keys(userAnswers).length;
    if (unanswered > 0) {
      Alert.alert(
        "Chưa hoàn thành",
        `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc muốn nộp bài?`,
        [
          { text: "Tiếp tục làm", style: "cancel" },
          {
            text: "Nộp bài",
            onPress: () => handleSubmit(false),
            style: "destructive",
          },
        ]
      );
    } else {
      setShowSubmitModal(true);
    }
  };

  const handleSubmit = async (timeUp: boolean) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const result = calculateScore(examQuestions, userAnswers);

    const examResult: ExamResult = {
      id: Date.now().toString(),
      licenseType,
      date: new Date().toISOString(),
      score: result.score,
      totalQuestions: result.totalQuestions,
      passed: result.passed,
      answers: Object.entries(userAnswers).map(([questionId, answerIndex]) => ({
        questionId,
        selectedAnswerIndex: answerIndex,
        isCorrect:
          examQuestions.find((q) => q._id.$oid === questionId)?.answers[
            answerIndex
          ]?.correct || false,
      })),
      questions: examQuestions,
    };

    await saveExamResult(examResult);

    if (timeUp) {
      Alert.alert("Hết giờ", "Thời gian làm bài đã hết!", [
        {
          text: "Xem kết quả",
          onPress: () => {
            // @ts-ignore - Navigation types not properly configured
            navigation.navigate("ExamResult", { examResult });
          },
        },
      ]);
    } else {
      // @ts-ignore - Navigation types not properly configured
      navigation.navigate("ExamResult", { examResult });
    }
  };

  if (examQuestions.length === 0) {
    return (
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.loadingContainer}
          >
            <LoadingSpinner />
            <Animated.Text
              entering={FadeInUp.delay(300)}
              style={styles.loadingText}
            >
              Đang tạo đề thi...
            </Animated.Text>
            <Animated.Text
              entering={FadeInUp.delay(500)}
              style={styles.loadingHint}
            >
              Vui lòng đợi trong giây lát
            </Animated.Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion._id.$oid];
  const isDiemLiet = currentQuestion.category.includes("diem-liet");
  const answeredCount = Object.keys(userAnswers).length;
  const progress = (answeredCount / examQuestions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#fff", "#f8f9fa"]} style={styles.header}>
        <View style={styles.headerTop}>
          <PressableScale
            onPress={() => {
              Alert.alert(
                "Thoát bài thi",
                "Bạn có chắc muốn thoát? Bài thi sẽ không được lưu.",
                [
                  { text: "Tiếp tục làm", style: "cancel" },
                  {
                    text: "Thoát",
                    onPress: () => {
                      if (timerRef.current) clearInterval(timerRef.current);
                      navigation.goBack();
                    },
                    style: "destructive",
                  },
                ]
              );
            }}
            style={styles.exitButtonContainer}
          >
            <Text style={styles.exitButton}>✕</Text>
          </PressableScale>

          <Animated.View style={styles.timerContainer}>
            <LinearGradient
              colors={
                timeRemaining < 60
                  ? ["#FF3B30", "#dc2626"]
                  : ["#007AFF", "#5856D6"]
              }
              style={styles.timerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.timerIcon}>⏱</Text>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </LinearGradient>
          </Animated.View>

          <PressableScale
            onPress={handleSubmitConfirm}
            style={styles.submitButtonContainer}
          >
            <LinearGradient
              colors={["#34C759", "#28a745"]}
              style={styles.submitButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.submitButtonText}>Nộp bài</Text>
            </LinearGradient>
          </PressableScale>
        </View>

        <View style={styles.progressContainer}>
          <AnimatedProgressBar
            progress={progress}
            color="#34C759"
            showLabel={false}
          />
          <Text style={styles.progressText}>
            {answeredCount}/{examQuestions.length}
          </Text>
        </View>
      </LinearGradient>

      {/* Question Content */}
      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Câu {currentQuestionIndex + 1}/{examQuestions.length}
            </Text>
            {isDiemLiet && (
              <View style={styles.criticalBadge}>
                <Text style={styles.criticalBadgeText}>⚠️ Điểm liệt</Text>
              </View>
            )}
          </View>

          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {currentQuestion.hinhanhq && (
            <Image
              source={{
                uri: `https://taplai.com/${currentQuestion.hinhanhq}`,
              }}
              style={styles.questionImage}
              resizeMode="contain"
            />
          )}

          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              return (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(index * 100).springify()}
                >
                  <PressableScale
                    style={[
                      styles.answerButton,
                      isSelected && styles.answerButtonSelected,
                    ]}
                    onPress={() => handleAnswerSelect(index)}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={["#007AFF15", "#007AFF05"]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <View
                      style={[
                        styles.answerIndicator,
                        isSelected && styles.answerIndicatorSelected,
                      ]}
                    >
                      {isSelected && (
                        <Animated.View
                          entering={ZoomIn.springify()}
                          style={styles.answerIndicatorDot}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.answerText,
                        isSelected && styles.answerTextSelected,
                      ]}
                    >
                      {answer.text}
                    </Text>
                  </PressableScale>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.navigationButtons}>
          <PressableScale
            style={[
              styles.navButtonWrapper,
              currentQuestionIndex === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <LinearGradient
              colors={
                currentQuestionIndex === 0
                  ? ["#e0e0e0", "#e0e0e0"]
                  : ["#007AFF", "#5856D6"]
              }
              style={styles.navButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentQuestionIndex === 0 && styles.navButtonTextDisabled,
                ]}
              >
                ‹ Câu trước
              </Text>
            </LinearGradient>
          </PressableScale>

          <PressableScale
            style={[
              styles.navButtonWrapper,
              currentQuestionIndex === examQuestions.length - 1 &&
                styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentQuestionIndex === examQuestions.length - 1}
          >
            <LinearGradient
              colors={
                currentQuestionIndex === examQuestions.length - 1
                  ? ["#e0e0e0", "#e0e0e0"]
                  : ["#007AFF", "#5856D6"]
              }
              style={styles.navButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={[
                  styles.navButtonText,
                  currentQuestionIndex === examQuestions.length - 1 &&
                    styles.navButtonTextDisabled,
                ]}
              >
                Câu sau ›
              </Text>
            </LinearGradient>
          </PressableScale>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.questionDotsContainer}
          contentContainerStyle={styles.questionDotsContent}
        >
          {examQuestions.map((q, index) => {
            const isAnswered = userAnswers[q._id.$oid] !== undefined;
            const isCurrent = index === currentQuestionIndex;

            return (
              <PressableScale
                key={q._id.$oid}
                scale={0.9}
                onPress={() => handleQuestionNavigate(index)}
              >
                <LinearGradient
                  colors={
                    isCurrent
                      ? ["#007AFF", "#5856D6"]
                      : isAnswered
                      ? ["#34C759", "#28a745"]
                      : ["#f0f0f0", "#e0e0e0"]
                  }
                  style={styles.questionDot}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text
                    style={[
                      styles.questionDotText,
                      (isAnswered || isCurrent) && styles.questionDotTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </LinearGradient>
              </PressableScale>
            );
          })}
        </ScrollView>
      </View>

      {/* Submit Confirmation Modal */}
      <Modal
        visible={showSubmitModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubmitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={["#fff", "#f8f9fa"]}
              style={styles.modalGradient}
            >
              <View style={styles.modalIconContainer}>
                <Text style={styles.modalIcon}>📋</Text>
              </View>
              <Text style={styles.modalTitle}>Xác nhận nộp bài</Text>
              <Text style={styles.modalText}>
                Bạn đã trả lời {answeredCount}/{examQuestions.length} câu hỏi.
              </Text>
              <Text style={styles.modalText}>
                Bạn có chắc muốn nộp bài không?
              </Text>
              <View style={styles.modalButtons}>
                <PressableScale
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowSubmitModal(false)}
                >
                  <Text style={styles.modalButtonTextCancel}>Hủy</Text>
                </PressableScale>
                <PressableScale style={styles.modalButton}>
                  <LinearGradient
                    colors={["#007AFF", "#5856D6"]}
                    style={styles.modalButtonConfirm}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <PressableScale
                      onPress={() => {
                        setShowSubmitModal(false);
                        handleSubmit(false);
                      }}
                      style={styles.modalButtonInner}
                    >
                      <Text style={styles.modalButtonTextConfirm}>Nộp bài</Text>
                    </PressableScale>
                  </LinearGradient>
                </PressableScale>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
  },
  loadingHint: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.8,
    marginTop: 8,
    textAlign: "center",
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exitButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  exitButton: {
    fontSize: 20,
    color: "#666",
  },
  timerContainer: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timerGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timerIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  submitButtonContainer: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    minWidth: 50,
    textAlign: "right",
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 16,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  criticalBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  criticalBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 17,
    color: "#1a1a1a",
    lineHeight: 26,
    marginBottom: 16,
    fontWeight: "500",
  },
  questionImage: {
    width: width - 32,
    height: (width - 32) * 0.6,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  answerButtonSelected: {
    borderColor: "#007AFF",
    borderWidth: 3,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  answerIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  answerIndicatorSelected: {
    borderColor: "#007AFF",
  },
  answerIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 24,
  },
  answerTextSelected: {
    fontWeight: "600",
    color: "#007AFF",
  },
  navigation: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: 8,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  navButtonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
  questionDotsContainer: {
    maxHeight: 60,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  questionDotsContent: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
  },
  questionDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  questionDotText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "700",
  },
  questionDotTextActive: {
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    width: width - 64,
    maxWidth: 400,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalGradient: {
    padding: 28,
    borderRadius: 24,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#007AFF20",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 36,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalButtonCancel: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
  },
  modalButtonConfirm: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 16,
  },
  modalButtonInner: {
    width: "100%",
    alignItems: "center",
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
