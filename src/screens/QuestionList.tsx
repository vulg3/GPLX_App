import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { AnimatedCard, PressableScale } from "../components";
import { Question } from "../types/Question";
import { getCategoryDisplayName } from "../utils/examGenerator";

const { width } = Dimensions.get("window");

export default function QuestionList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { questions, category } = route.params as {
    questions: Question[];
    category: string;
  };

  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, number>>(
    new Map()
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    const newSelected = new Map(selectedAnswers);
    newSelected.set(questionId, answerIndex);
    setSelectedAnswers(newSelected);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
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

  const renderAnswer = (answer: any, index: number, questionId: string) => {
    const selectedAnswer = selectedAnswers.get(questionId);
    const isSelected = selectedAnswer === index;
    const isCorrect = answer.correct;
    const showResult = selectedAnswer !== undefined;

    return (
      <PressableScale
        key={index}
        onPress={() => handleAnswerSelect(questionId, index)}
        style={[
          styles.answerItem,
          isSelected && styles.answerSelected,
          showResult && isCorrect && styles.answerCorrect,
          showResult && isSelected && !isCorrect && styles.answerIncorrect,
        ]}
      >
        <View style={styles.answerLeft}>
          <View
            style={[
              styles.answerIndicator,
              isSelected && styles.answerIndicatorSelected,
              showResult && isCorrect && styles.answerIndicatorCorrect,
              showResult &&
                isSelected &&
                !isCorrect &&
                styles.answerIndicatorIncorrect,
            ]}
          >
            {isSelected && !showResult && (
              <Text style={styles.selectedMark}>●</Text>
            )}
            {showResult && isCorrect && <Text style={styles.checkMark}>✓</Text>}
            {showResult && isSelected && !isCorrect && (
              <Text style={styles.crossMark}>✗</Text>
            )}
          </View>
          <Text
            style={[
              styles.answerText,
              isSelected && styles.answerTextSelected,
              showResult && isCorrect && styles.answerTextCorrect,
              showResult &&
                isSelected &&
                !isCorrect &&
                styles.answerTextIncorrect,
            ]}
          >
            {answer.text}
          </Text>
        </View>
      </PressableScale>
    );
  };

  const renderCurrentQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const questionId = question._id.$oid;
    const isDiemLiet = question.category.includes("diem-liet");

    return (
      <AnimatedCard
        key={questionId}
        delay={0}
        style={[
          styles.questionCard,
          ...(isDiemLiet ? [styles.questionCardCritical] : []),
        ]}
      >
        <View style={styles.questionHeader}>
          <View style={styles.questionNumberContainer}>
            <LinearGradient
              colors={
                isDiemLiet ? ["#FF3B30", "#dc2626"] : ["#007AFF", "#5856D6"]
              }
              style={styles.questionNumberBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.questionNumber}>{question.number}</Text>
            </LinearGradient>
            {isDiemLiet && (
              <Animated.View
                entering={FadeIn.springify()}
                style={styles.criticalBadge}
              >
                <Text style={styles.criticalBadgeText}>⚠️ Điểm liệt</Text>
              </Animated.View>
            )}
          </View>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        {question.hinhanhq && (
          <Image
            source={{
              uri: `https://taplai.com/${question.hinhanhq}`,
            }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}

        <View style={styles.answersContainer}>
          <Text style={styles.answersTitle}>Chọn đáp án:</Text>
          {question.answers.map((answer, idx) => (
            <Animated.View
              key={idx}
              entering={FadeInDown.delay(idx * 80).springify()}
            >
              {renderAnswer(answer, idx, questionId)}
            </Animated.View>
          ))}

          {question.explanation && (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.explanationContainer}
            >
              <Text style={styles.explanationTitle}>💡 Giải thích:</Text>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </Animated.View>
          )}
        </View>
      </AnimatedCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Quay lại</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {getCategoryDisplayName(category)}
          </Text>
          <Text style={styles.headerSubtitle}>
            Câu {currentQuestionIndex + 1}/{questions.length}
          </Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentQuestion()}
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
              currentQuestionIndex === questions.length - 1 &&
                styles.navButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <LinearGradient
              colors={
                currentQuestionIndex === questions.length - 1
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
                  currentQuestionIndex === questions.length - 1 &&
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
          {questions.map((q, index) => {
            const isAnswered = selectedAnswers.get(q._id.$oid) !== undefined;
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
    </SafeAreaView>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    padding: 16,
    marginBottom: 12,
  },
  questionCardCritical: {
    borderWidth: 2,
    borderColor: "#FF3B30",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  questionNumberBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  criticalBadge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
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
    marginBottom: 8,
  },
  questionImage: {
    width: width - 64,
    height: (width - 64) * 0.6,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#f0f0f0",
  },
  answersContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  answersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  answerItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  answerSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  answerCorrect: {
    backgroundColor: "#d4edda",
    borderColor: "#34C759",
    borderWidth: 2,
  },
  answerIncorrect: {
    backgroundColor: "#f8d7da",
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  answerLeft: {
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
  answerIndicatorSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  answerIndicatorCorrect: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  answerIndicatorIncorrect: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  selectedMark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  crossMark: {
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
  answerTextSelected: {
    fontWeight: "600",
    color: "#007AFF",
  },
  answerTextCorrect: {
    fontWeight: "600",
    color: "#155724",
  },
  answerTextIncorrect: {
    fontWeight: "600",
    color: "#721c24",
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
});
