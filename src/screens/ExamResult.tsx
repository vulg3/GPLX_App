import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ConfettiEffect,
  PressableScale,
  TouchableScreenWrapper,
} from "../components";
import { ExamResult as ExamResultType } from "../types/Question";

const { width } = Dimensions.get("window");

export default function ExamResult() {
  const route = useRoute();
  const navigation = useNavigation();
  const { examResult } = route.params as { examResult: ExamResultType };
  const [showConfetti, setShowConfetti] = useState(false);

  const correctCount = examResult.answers.filter((a) => a.isCorrect).length;
  const incorrectCount = examResult.totalQuestions - correctCount;
  const hasCriticalError = examResult.questions.some(
    (q, index) =>
      q.category.includes("diem-liet") &&
      !examResult.answers.find((a) => a.questionId === q._id.$oid)?.isCorrect
  );

  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (examResult.passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }

    // Animate score
    scale.value = withDelay(300, withSpring(1, { damping: 10 }));

    // Pulse animation for icon
    if (examResult.passed) {
      rotate.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        3
      );
    }
  }, [examResult.passed]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const handleReview = () => {
    (navigation as any).navigate("ReviewAnswers", { examResult });
  };

  const handleRetake = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const handleHome = () => {
    (navigation as any).navigate("MainTabs");
  };

  return (
    <TouchableScreenWrapper>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        {showConfetti && examResult.passed && <ConfettiEffect />}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Result Card */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            style={styles.resultCard}
          >
            {examResult.passed ? (
              <>
                <Animated.View
                  entering={ZoomIn.delay(200).springify()}
                  style={[styles.passIcon, rotateStyle]}
                >
                  <LinearGradient
                    colors={["#34C759", "#28a745"]}
                    style={styles.iconGradient}
                  >
                    <Text style={styles.passIconText}>🎉</Text>
                  </LinearGradient>
                </Animated.View>
                <Animated.Text
                  entering={FadeInUp.delay(400)}
                  style={styles.resultTitle}
                >
                  Chúc mừng!
                </Animated.Text>
                <Animated.Text
                  entering={FadeInUp.delay(500)}
                  style={styles.resultSubtitle}
                >
                  Bạn đã đạt yêu cầu
                </Animated.Text>
              </>
            ) : (
              <>
                <Animated.View
                  entering={ZoomIn.delay(200).springify()}
                  style={styles.failIcon}
                >
                  <LinearGradient
                    colors={["#FF3B30", "#dc2626"]}
                    style={styles.iconGradient}
                  >
                    <Text style={styles.failIconText}>😔</Text>
                  </LinearGradient>
                </Animated.View>
                <Animated.Text
                  entering={FadeInUp.delay(400)}
                  style={styles.resultTitle}
                >
                  Chưa đạt
                </Animated.Text>
                <Animated.Text
                  entering={FadeInUp.delay(500)}
                  style={styles.resultSubtitle}
                >
                  {hasCriticalError
                    ? "Bạn đã sai câu điểm liệt"
                    : "Cố gắng lần sau nhé!"}
                </Animated.Text>
              </>
            )}

            <Animated.View
              entering={ZoomIn.delay(600).springify()}
              style={[styles.scoreContainer, scaleStyle]}
            >
              <Text
                style={[
                  styles.score,
                  examResult.passed ? styles.scorePass : styles.scoreFail,
                ]}
              >
                {examResult.score}
              </Text>
              <Text style={styles.scoreLabel}>điểm</Text>
            </Animated.View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{correctCount}</Text>
                <Text style={styles.statLabel}>Đúng</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#FF3B30" }]}>
                  {incorrectCount}
                </Text>
                <Text style={styles.statLabel}>Sai</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {examResult.totalQuestions}
                </Text>
                <Text style={styles.statLabel}>Tổng</Text>
              </View>
            </View>

            {hasCriticalError && (
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  Bạn đã sai câu điểm liệt. Để đạt yêu cầu, bạn không được sai
                  bất kỳ câu điểm liệt nào.
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Loại bằng</Text>
              <Text style={styles.infoValue}>
                {examResult.licenseType === "A" ? "A / A1" : "B / B1"}
              </Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Thời gian</Text>
              <Text style={styles.infoValue}>
                {new Date(examResult.date).toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>
              {examResult.passed ? "✅ Điều cần biết" : "💪 Lời khuyên"}
            </Text>
            {examResult.passed ? (
              <>
                <Text style={styles.tipText}>
                  • Bạn đã hoàn thành bài thi với kết quả tốt
                </Text>
                <Text style={styles.tipText}>
                  • Xem lại đáp án để củng cố kiến thức
                </Text>
                <Text style={styles.tipText}>
                  • Tiếp tục ôn tập để chuẩn bị cho kỳ thi chính thức
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.tipText}>
                  {examResult.licenseType === "B"
                    ? "• Cần đúng ít nhất 27/30 câu (90%) để đạt"
                    : "• Cần đúng ít nhất 21/25 câu (84%) để đạt"}
                </Text>
                <Text style={styles.tipText}>
                  • Không được sai bất kỳ câu điểm liệt nào
                </Text>
                <Text style={styles.tipText}>
                  • Xem lại đáp án và giải thích để hiểu rõ hơn
                </Text>
                <Text style={styles.tipText}>
                  • Ôn tập kỹ các phần còn yếu và thử lại
                </Text>
              </>
            )}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInUp.delay(800)}
          style={styles.actionButtons}
        >
          <PressableScale style={styles.actionButtonWrapper}>
            <LinearGradient
              colors={["#007AFF", "#5856D6"]}
              style={[styles.actionButton, styles.reviewButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <PressableScale
                onPress={handleReview}
                style={styles.actionButtonInner}
              >
                <Text style={styles.reviewButtonText}>🔍 Xem đáp án</Text>
              </PressableScale>
            </LinearGradient>
          </PressableScale>

          <View style={styles.secondaryButtons}>
            <PressableScale style={[styles.actionButtonWrapper, { flex: 1 }]}>
              <LinearGradient
                colors={["#34C759", "#28a745"]}
                style={[styles.actionButton, styles.retakeButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <PressableScale
                  onPress={handleRetake}
                  style={styles.actionButtonInner}
                >
                  <Text style={styles.retakeButtonText}>🔄 Thi lại</Text>
                </PressableScale>
              </LinearGradient>
            </PressableScale>

            <PressableScale style={[styles.actionButtonWrapper, { flex: 1 }]}>
              <View style={[styles.actionButton, styles.homeButton]}>
                <PressableScale
                  onPress={handleHome}
                  style={styles.actionButtonInner}
                >
                  <Text style={styles.homeButtonText}>🏠 Trang chủ</Text>
                </PressableScale>
              </View>
            </PressableScale>
          </View>
        </Animated.View>
      </SafeAreaView>
    </TouchableScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  passIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  failIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  passIconText: {
    fontSize: 50,
  },
  failIconText: {
    fontSize: 50,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  score: {
    fontSize: 64,
    fontWeight: "bold",
  },
  scorePass: {
    color: "#34C759",
  },
  scoreFail: {
    color: "#FF3B30",
  },
  scoreLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  statItem: {
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34C759",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "flex-start",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  tipsCard: {
    backgroundColor: "#f0f7ff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#004085",
    lineHeight: 24,
    marginBottom: 4,
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  actionButtonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButton: {
    borderRadius: 16,
  },
  actionButtonInner: {
    paddingVertical: 16,
    alignItems: "center",
  },
  reviewButton: {},
  reviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtons: {
    flexDirection: "row",
    gap: 12,
  },
  retakeButton: {},
  retakeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
  },
  homeButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
  },
});
