import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AnimatedCard, PressableScale } from "../components";
import { useTheme } from "../contexts/ThemeContext";
import { Question } from "../types/Question";
import { responsive, rv } from "../utils/responsive";
import { getStatistics, saveSelectedLicense } from "../utils/storage";

// Import JSON data
import carQuestions from "../../assets/data/shlx.car_questions.json";

export default function CarTab() {
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    passedExams: 0,
    averageScore: 0,
    bestScore: 0,
    passRate: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Set license type to B
    await saveSelectedLicense("B");

    // Load questions
    setQuestions(carQuestions as Question[]);

    // Load statistics
    const statistics = await getStatistics("B");
    setStats(statistics);
  };

  const handleStudy = () => {
    if (questions.length === 0) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu câu hỏi");
      return;
    }
    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("Study", {
      licenseType: "B",
      questions,
    });
  };

  const handleExam = () => {
    if (questions.length === 0) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu câu hỏi");
      return;
    }

    if (questions.length < 25) {
      Alert.alert("Lỗi", "Không đủ câu hỏi để tạo đề thi (cần ít nhất 25 câu)");
      return;
    }

    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("Exam", {
      licenseType: "B",
      questions,
    });
  };

  const handleHistory = () => {
    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("ExamHistory", {
      licenseType: "B",
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.header}>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Ô tô 🚗</Text>
                <Text style={styles.licenseText}>
                  Bằng lái: <Text style={styles.licenseBold}>B / B1</Text>
                </Text>
              </View>
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
          <AnimatedCard
            delay={100}
            style={[styles.statsContainer, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              📊 Thống kê của bạn
            </Text>
            <View style={styles.statsGrid}>
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: isDarkMode ? "#1e3a5f" : "#e3f2fd" },
                  ]}
                >
                  <Text style={styles.statIcon}>📝</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {stats.totalExams}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Lần thi
                </Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(300).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: isDarkMode ? "#1e4620" : "#e8f5e9" },
                  ]}
                >
                  <Text style={styles.statIcon}>✅</Text>
                </View>
                <Text style={[styles.statValue, { color: "#34C759" }]}>
                  {stats.passedExams}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Đạt
                </Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(400).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: isDarkMode ? "#4a3320" : "#fff3e0" },
                  ]}
                >
                  <Text style={styles.statIcon}>📈</Text>
                </View>
                <Text style={[styles.statValue, { color: "#FF9500" }]}>
                  {stats.averageScore}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Điểm TB
                </Text>
              </Animated.View>
              <Animated.View
                entering={FadeInUp.delay(500).springify()}
                style={styles.statCard}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: isDarkMode ? "#1e3a5f" : "#e3f2fd" },
                  ]}
                >
                  <Text style={styles.statIcon}>🏆</Text>
                </View>
                <Text style={[styles.statValue, { color: "#007AFF" }]}>
                  {stats.bestScore}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Cao nhất
                </Text>
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
        <View
          style={[
            styles.tipsContainer,
            { backgroundColor: isDarkMode ? "#3a3020" : "#fff3cd" },
          ]}
        >
          <Text
            style={[
              styles.tipsTitle,
              { color: isDarkMode ? "#ffd54f" : "#856404" },
            ]}
          >
            💡 Mẹo ôn thi
          </Text>
          <View style={styles.tipItem}>
            <Text
              style={[
                styles.tipBullet,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.tipText,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
              Học kỹ các câu điểm liệt - sai 1 câu là trượt
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text
              style={[
                styles.tipBullet,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.tipText,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
              Cần đúng ≥ 21/25 câu (84%) để đạt yêu cầu
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text
              style={[
                styles.tipBullet,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                styles.tipText,
                { color: isDarkMode ? "#ffd54f" : "#856404" },
              ]}
            >
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: responsive.padding.lg,
    paddingTop: responsive.padding.sm,
    paddingBottom: responsive.padding.xl,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  greeting: {
    fontSize: responsive.fontSize["3xl"],
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  licenseText: {
    fontSize: responsive.fontSize.base,
    color: "#fff",
    opacity: 0.9,
  },
  licenseBold: {
    fontWeight: "bold",
  },
  questionCount: {
    fontSize: responsive.fontSize.lg,
    color: "#fff",
    opacity: 0.9,
  },
  questionCountBold: {
    fontWeight: "bold",
  },
  statsContainer: {
    margin: responsive.spacing.base,
    padding: responsive.padding.lg,
  },
  statsTitle: {
    fontSize: responsive.fontSize.xl,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: responsive.spacing.base,
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
    padding: responsive.padding.base,
    gap: responsive.spacing.sm,
  },
  actionCardInner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  actionGradient: {
    padding: responsive.padding.base,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: responsive.radius.base,
  },
  studyCard: {},
  examCard: {},
  historyCard: {},
  actionIcon: {
    width: rv(56, 64),
    height: rv(56, 64),
    borderRadius: rv(28, 32),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: responsive.spacing.base,
  },
  actionIconText: {
    fontSize: rv(28, 32),
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: responsive.fontSize.xl,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: responsive.fontSize.sm,
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
    margin: responsive.spacing.base,
    padding: responsive.padding.base,
    borderRadius: responsive.radius.base,
    marginBottom: responsive.padding.xl,
  },
  tipsTitle: {
    fontSize: responsive.fontSize.base,
    fontWeight: "bold",
    marginBottom: responsive.spacing.sm,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
