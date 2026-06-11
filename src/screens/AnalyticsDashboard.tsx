import { NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import EmptyState from "../components/EmptyState";
import ProgressCircle from "../components/ProgressCircle";
import RadarChart from "../components/RadarChart";
import { useTheme } from "../contexts/ThemeContext";
import { gradients } from "../theme/tokens";
import {
  AnalyticsData,
  ExamResult,
  LicenseType,
  TopicCategory,
} from "../types/Question";
import { processAnalytics } from "../utils/analytics";
import { responsive } from "../utils/responsive";
import { getExamResults, getSelectedLicense } from "../utils/storage";

const { width } = Dimensions.get("window");

const TOPIC_ICONS: Record<TopicCategory, string> = {
  concepts_rules: "📚",
  transport_ops: "💼",
  driver_ethics: "🤝",
  driving_tech_construct: "🛠️",
  road_signs: "🚧",
  traffic_situations: "🚗",
};

const AnalyticsDashboard: React.FC<{ navigation: NavigationProp<any> }> = ({
  navigation,
}) => {
  const { theme, isDarkMode, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [licenseType, setLicenseType] = useState<LicenseType>("A");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedResults = await getExamResults();
      const selectedLicense = await getSelectedLicense();

      // Filter results for selected license
      const filtered = savedResults.filter(
        (r) => r.licenseType === (selectedLicense || "A"),
      );

      setResults(filtered);
      if (selectedLicense) setLicenseType(selectedLicense);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const analytics: AnalyticsData | null = useMemo(() => {
    if (results.length === 0) return null;
    return processAnalytics(results);
  }, [results]);

  const chartData = useMemo(() => {
    if (!analytics || analytics.examHistory.length === 0) return [];
    return analytics.examHistory.map((h, i) => ({
      value: h.score,
      label: i.toString(),
      dataPointText: h.score.toString(),
    }));
  }, [analytics]);

  const getPassRateMessage = (rate: number) => {
    if (rate >= 90)
      return "Bạn đang cực kỳ tự tin! Sẵn sàng đi thi ngay thôi. 🚀";
    if (rate >= 70) return "Phong độ khá ổn định. Ôn thêm một chút nữa nhé! 💪";
    if (rate >= 50) return "Cần tập trung nhiều hơn vào các câu hay sai. 📚";
    return "Đừng nản chí! Hãy làm thêm nhiều đề thi thử nhé. 🔥";
  };

  const getPassRateTheme = (rate: number) => {
    if (rate >= 70) {
      return {
        bgColor: colors.successBg,
        textColor: colors.success,
      };
    }
    if (rate >= 50) {
      return {
        bgColor: colors.warningBg,
        textColor: colors.warning,
      };
    }
    return {
      bgColor: colors.errorBg,
      textColor: colors.error,
    };
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background || "#fff" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary || "#667eea"} />
      </View>
    );
  }

  const passRateTheme = analytics
    ? getPassRateTheme(analytics.expectedPassRate)
    : null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={[]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode ? colors.background : "#667eea"}
      />
      {/* Header */}
      <LinearGradient
        colors={
          isDarkMode ? [colors.card, colors.background] : gradients.primary
        }
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Phân tích & Thống kê</Text>
          </View>
          <Text style={styles.subtitle}>
            Dựa trên {results.length} bài thi gần nhất (Hạng {licenseType})
          </Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {!analytics ? (
            <EmptyState
              icon="stats-chart-outline"
              title="Chưa có dữ liệu thống kê"
              description="Hãy làm ít nhất một bài thi thử để hệ thống phân tích điểm mạnh, điểm yếu và tỉ lệ đỗ của bạn!"
              ctaLabel="Thi thử ngay"
              onPressCta={() => {
                if (licenseType === "A") {
                  navigation.navigate("MotorbikeTab");
                } else {
                  navigation.navigate("CarTab");
                }
              }}
            />
          ) : (
            <>
              {/* Pass Rate Section */}
              <Animated.View
                entering={FadeInUp.delay(100).springify()}
                style={[styles.card, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Tỉ lệ đỗ dự kiến
                </Text>
                <View style={styles.passRateRow}>
                  <ProgressCircle
                    percentage={analytics.expectedPassRate}
                    size={140}
                  />
                  <View
                    style={[
                      styles.messageBox,
                      { backgroundColor: passRateTheme?.bgColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        { color: passRateTheme?.textColor },
                      ]}
                    >
                      {getPassRateMessage(analytics.expectedPassRate)}
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Radar Chart Section */}
              <Animated.View
                entering={FadeInUp.delay(200).springify()}
                style={[styles.card, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Phân tích điểm mạnh/yếu
                </Text>
                <RadarChart data={analytics.topicStats} size={width - 80} />
              </Animated.View>

              {/* Score History Chart */}
              <Animated.View
                entering={FadeInUp.delay(300).springify()}
                style={[styles.card, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Biểu đồ điểm số (20 bài gần nhất)
                </Text>
                <View style={styles.chartContainer}>
                  {chartData.length > 0 && (
                    <LineChart
                      data={chartData}
                      width={width - 100}
                      height={200}
                      curved
                      color={colors.primary}
                      thickness={3}
                      startFillColor={colors.primary}
                      startOpacity={0.4}
                      endOpacity={0.1}
                      noOfSections={5}
                      maxValue={licenseType === "B" ? 35 : 25}
                      yAxisColor={colors.border}
                      xAxisColor={colors.border}
                      rulesColor={colors.border}
                      yAxisTextStyle={{
                        color: colors.textSecondary,
                        fontSize: 10,
                      }}
                      xAxisLabelTextStyle={{
                        color: colors.textSecondary,
                        fontSize: 10,
                      }}
                      hideDataPoints={false}
                      dataPointsColor={colors.primary}
                    />
                  )}
                </View>
              </Animated.View>

              {/* Detailed Stats List */}
              <Animated.View
                entering={FadeInUp.delay(400).springify()}
                style={[styles.card, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Chi tiết từng chủ đề
                </Text>
                {analytics.topicStats.map((item, index) => (
                  <View key={index} style={styles.statRow}>
                    <View style={styles.statInfo}>
                      <View style={styles.statNameContainer}>
                        <Text style={styles.statIcon}>
                          {TOPIC_ICONS[item.topic] || "📝"}
                        </Text>
                        <Text style={[styles.statName, { color: colors.text }]}>
                          {item.displayName}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.statDetail,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Đúng {item.correct}/{item.total} câu
                      </Text>
                    </View>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: colors.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${item.percentage}%`,
                              backgroundColor:
                                item.percentage >= 80
                                  ? "#4ADE80"
                                  : item.percentage >= 50
                                    ? "#FBBF24"
                                    : "#F87171",
                            },
                          ]}
                        />
                      </View>
                      <Text
                        style={[styles.percentageText, { color: colors.text }]}
                      >
                        {Math.round(item.percentage)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </Animated.View>
            </>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: responsive.padding.lg,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: responsive.padding.lg,
    paddingBottom: responsive.padding.xl,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: responsive.fontSize["2xl"],
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: responsive.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },
  card: {
    borderRadius: responsive.radius.lg,
    padding: responsive.card.padding,
    marginBottom: responsive.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: "700",
    marginBottom: 15,
  },
  passRateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageBox: {
    flex: 1,
    marginLeft: 20,
    padding: 15,
    borderRadius: 15,
  },
  messageText: {
    fontSize: responsive.fontSize.sm,
    fontStyle: "italic",
    lineHeight: 20,
    fontWeight: "500",
  },
  chartContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  statRow: {
    marginBottom: 15,
  },
  statInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  statIcon: {
    fontSize: responsive.fontSize.base,
    marginRight: 8,
  },
  statName: {
    fontSize: responsive.fontSize.base,
    fontWeight: "600",
    flex: 1,
  },
  statDetail: {
    fontSize: responsive.fontSize.sm,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
  },
  percentageText: {
    fontSize: responsive.fontSize.sm,
    fontWeight: "700",
    width: 35,
    textAlign: "right",
  },
});

export default AnalyticsDashboard;
