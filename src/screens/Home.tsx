import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedCard, PressableScale } from "../components";
import { LicenseType, Question } from "../types/Question";
import { getSelectedLicense, getStatistics } from "../utils/storage";

// Import JSON data
import bikeQuestions from "../../assets/data/shlx.bike_questions.json";
import carQuestions from "../../assets/data/shlx.car_questions.json";

export default function Home() {
  const navigation = useNavigation();
  const route = useRoute();
  const [licenseType, setLicenseType] = useState<LicenseType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    passedExams: 0,
    averageScore: 0,
    bestScore: 0,
    passRate: 0,
  });

  useEffect(() => {
    loadLicenseAndQuestions();
  }, [route.params]);

  const loadLicenseAndQuestions = async () => {
    const params = route.params as any;
    const license = params?.licenseType || (await getSelectedLicense());

    if (!license) {
      navigation.navigate("LicenseSelection" as never);
      return;
    }

    setLicenseType(license);

    // Load questions based on license type
    const questionData = license === "A" ? bikeQuestions : carQuestions;
    setQuestions(questionData as Question[]);

    // Load statistics
    const statistics = await getStatistics(license);
    setStats(statistics);
  };

  const handleStudy = () => {
    if (!licenseType || questions.length === 0) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu câu hỏi");
      return;
    }
    navigation.navigate(
      "Study" as never,
      {
        licenseType,
        questions,
      } as never
    );
  };

  const handleExam = () => {
    if (!licenseType || questions.length === 0) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu câu hỏi");
      return;
    }

    if (questions.length < 25) {
      Alert.alert("Lỗi", "Không đủ câu hỏi để tạo đề thi (cần ít nhất 25 câu)");
      return;
    }

    navigation.navigate(
      "Exam" as never,
      {
        licenseType,
        questions,
      } as never
    );
  };

  const handleHistory = () => {
    navigation.navigate("ExamHistory" as never, { licenseType } as never);
  };

  const handleChangeLicense = () => {
    navigation.navigate("LicenseSelection" as never);
  };

  if (!licenseType) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Xin chào! 👋</Text>
                <Text style={styles.licenseText}>
                  Bằng lái:{" "}
                  <Text style={styles.licenseBold}>
                    {licenseType === "A" ? "A / A1" : "B / B1"}
                  </Text>
                </Text>
              </View>
              <PressableScale
                onPress={handleChangeLicense}
                style={styles.changeLicenseBtn}
              >
                <Text style={styles.changeLicenseText}>Đổi</Text>
              </PressableScale>
            </View>
            <Text style={styles.questionCount}>
              📚 Tổng số:{" "}
              <Text style={styles.questionCountBold}>{questions.length}</Text>{" "}
              câu hỏi
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Statistics */}
        {stats.totalExams > 0 && (
          <AnimatedCard delay={100} style={styles.statsContainer}>
            <Text style={styles.statsTitle}>📊 Thống kê của bạn</Text>
            <View style={styles.statsGrid}>
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#e3f2fd" },
                  ]}
                >
                  <Text style={styles.statIcon}>📝</Text>
                </View>
                <Text style={styles.statValue}>{stats.totalExams}</Text>
                <Text style={styles.statLabel}>Lần thi</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(300).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#e8f5e9" },
                  ]}
                >
                  <Text style={styles.statIcon}>✅</Text>
                </View>
                <Text style={[styles.statValue, { color: "#34C759" }]}>
                  {stats.passedExams}
                </Text>
                <Text style={styles.statLabel}>Đạt</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#fff3e0" },
                  ]}
                >
                  <Text style={styles.statIcon}>📈</Text>
                </View>
                <Text style={[styles.statValue, { color: "#FF9500" }]}>
                  {stats.averageScore}
                </Text>
                <Text style={styles.statLabel}>Điểm TB</Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(500).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: "#e3f2fd" },
                  ]}
                >
                  <Text style={styles.statIcon}>🏆</Text>
                </View>
                <Text style={[styles.statValue, { color: "#007AFF" }]}>
                  {stats.bestScore}
                </Text>
                <Text style={styles.statLabel}>Cao nhất</Text>
              </Animated.View>
            </View>
          </AnimatedCard>
        )}

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <AnimatedCard delay={200}>
            <PressableScale
              style={styles.actionCardInner}
              onPress={handleStudy}
            >
              <LinearGradient
                colors={["#34C759", "#28a745"]}
                style={[styles.actionGradient, styles.studyCard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>📖</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Học câu hỏi</Text>
                  <Text style={styles.actionDescription}>
                    Xem tất cả câu hỏi theo từng danh mục
                  </Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </LinearGradient>
            </PressableScale>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <PressableScale style={styles.actionCardInner} onPress={handleExam}>
              <LinearGradient
                colors={["#FF9500", "#ff6b6b"]}
                style={[styles.actionGradient, styles.examCard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>✍️</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Thi thử 25 câu</Text>
                  <Text style={styles.actionDescription}>
                    Làm bài thi giống như thi thật
                  </Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </LinearGradient>
            </PressableScale>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <PressableScale
              style={styles.actionCardInner}
              onPress={handleHistory}
            >
              <LinearGradient
                colors={["#007AFF", "#5856D6"]}
                style={[styles.actionGradient, styles.historyCard]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>📊</Text>
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Lịch sử thi</Text>
                  <Text style={styles.actionDescription}>
                    Xem lại các bài thi đã làm
                  </Text>
                </View>
                <Text style={styles.actionArrow}>›</Text>
              </LinearGradient>
            </PressableScale>
          </AnimatedCard>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Mẹo ôn thi</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Học kỹ các câu điểm liệt - sai 1 câu là trượt
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Cần đúng ≥ 21/25 câu (84%) để đạt yêu cầu
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>
              Làm quen với biển báo và sa hình giao thông
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  licenseText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  licenseBold: {
    fontWeight: "bold",
  },
  changeLicenseBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeLicenseText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  questionCount: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
  },
  questionCountBold: {
    fontWeight: "bold",
  },
  statsContainer: {
    margin: 16,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    minWidth: 70,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionCardInner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
  },
  studyCard: {},
  examCard: {},
  historyCard: {},
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  actionArrow: {
    fontSize: 32,
    color: "#fff",
    marginLeft: 8,
    opacity: 0.7,
  },
  tipsContainer: {
    backgroundColor: "#fff3cd",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: "#856404",
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
});
