import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdBanner,
  EmptyState,
  PressableScale,
  TouchableScreenWrapper,
} from "../components";
import { useAdsVisibility } from "../contexts/AdsVisibilityContext";
import { useTheme } from "../contexts/ThemeContext";
import { ExamResult, LicenseType } from "../types/Question";
import { isTablet, responsive, rs, rv } from "../utils/responsive";
import { deleteExamResult, getExamResultsByLicense } from "../utils/storage";

// Inject a banner ad after every N history rows so it reads as part of the list
// instead of an interrupting popup.
const AD_INTERVAL = 4;
type HistoryRow =
  | { type: "item"; result: ExamResult }
  | { type: "ad"; key: string };

export default function ExamHistory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();
  const { adsHidden } = useAdsVisibility();
  const { licenseType } = route.params as { licenseType: LicenseType };

  const [results, setResults] = useState<ExamResult[]>([]);

  // Build the list rows with banner ads interleaved (unless ads are hidden).
  const listData: HistoryRow[] = [];
  results.forEach((result, i) => {
    listData.push({ type: "item", result });
    if (!adsHidden && (i + 1) % AD_INTERVAL === 0 && i !== results.length - 1) {
      listData.push({ type: "ad", key: `ad-${i}` });
    }
  });

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    const data = await getExamResultsByLicense(licenseType);
    setResults(data);
  };

  const handleViewResult = (result: ExamResult) => {
    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("ExamResult", { examResult: result });
  };

  const handleDeleteResult = (resultId: string) => {
    Alert.alert("Xóa kết quả", "Bạn có chắc muốn xóa kết quả thi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await deleteExamResult(resultId);
          loadResults();
        },
      },
    ]);
  };

  const renderResultCard = (item: ExamResult, index: number) => {
    const date = new Date(item.date);
    const correctCount = item.answers.filter((a) => a.isCorrect).length;

    return (
      <Animated.View entering={FadeInRight.delay(Math.min(index, 6) * 80).springify()}>
        <PressableScale
          style={styles.resultCardWrapper}
          onPress={() => handleViewResult(item)}
        >
          <LinearGradient
            colors={
              isDarkMode
                ? item.passed
                  ? ["#1e4620", "#1a3a1a"]
                  : ["#4a1a1a", "#3a1515"]
                : item.passed
                ? ["#d4edda", "#e8f5e9"]
                : ["#f8d7da", "#ffe5e5"]
            }
            style={[
              styles.resultCard,
              item.passed ? styles.resultCardPass : styles.resultCardFail,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.resultHeader}>
              <View
                style={[
                  styles.resultStatus,
                  item.passed
                    ? styles.resultStatusPass
                    : styles.resultStatusFail,
                ]}
              >
                <Text style={styles.resultStatusText}>
                  {item.passed ? "✓ Đạt" : "✗ Chưa đạt"}
                </Text>
              </View>
              <PressableScale
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteResult(item.id);
                }}
                style={styles.deleteButton}
              >
                <LinearGradient
                  colors={["#FF3B30", "#dc2626"]}
                  style={styles.deleteButtonGradient}
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </LinearGradient>
              </PressableScale>
            </View>

            <View style={styles.resultStats}>
              <View style={styles.statItem}>
                <View
                  style={[styles.statIconBg, { backgroundColor: "#007AFF20" }]}
                >
                  <Text style={styles.statEmoji}>📊</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {item.score}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Điểm
                </Text>
              </View>
              <View style={styles.statItem}>
                <View
                  style={[styles.statIconBg, { backgroundColor: "#34C75920" }]}
                >
                  <Text style={styles.statEmoji}>✓</Text>
                </View>
                <Text style={[styles.statValue, { color: "#34C759" }]}>
                  {correctCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Đúng
                </Text>
              </View>
              <View style={styles.statItem}>
                <View
                  style={[styles.statIconBg, { backgroundColor: "#FF3B3020" }]}
                >
                  <Text style={styles.statEmoji}>✗</Text>
                </View>
                <Text style={[styles.statValue, { color: "#FF3B30" }]}>
                  {item.totalQuestions - correctCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subText }]}>
                  Sai
                </Text>
              </View>
            </View>

            <View style={styles.resultFooter}>
              <Text style={[styles.resultDate, { color: colors.subText }]}>
                📅 {date.toLocaleDateString("vi-VN")}{" "}
                {date.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.viewDetails}>Xem chi tiết ›</Text>
            </View>
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  };

  const renderRow = ({ item, index }: { item: HistoryRow; index: number }) => {
    if (item.type === "ad") {
      return (
        <View style={[styles.adCard, { backgroundColor: colors.card }]}>
          <AdBanner />
        </View>
      );
    }
    return renderResultCard(item.result, index);
  };

  return (
    <TouchableScreenWrapper>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? colors.card : "#fff"}
        />
        <LinearGradient
          colors={
            isDarkMode ? [colors.card, colors.background] : ["#fff", "#f8f9fa"]
          }
          style={[styles.header, { borderBottomColor: colors.border }]}
        >
          <PressableScale
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹ Quay lại</Text>
          </PressableScale>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[styles.headerTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              Lịch sử thi
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.subText }]}>
              {results.length} bài thi
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </LinearGradient>

        {results.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="document-text-outline"
              title="Chưa có lịch sử thi"
              description="Bắt đầu làm bài thi thử để xem kết quả tại đây."
              ctaLabel="Thi thử ngay"
              onPressCta={() => navigation.goBack()}
            />
          </View>
        ) : (
          <FlatList
            data={listData}
            renderItem={renderRow}
            keyExtractor={(item) =>
              item.type === "ad" ? item.key : item.result.id
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </TouchableScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: responsive.padding.lg,
    paddingBottom: responsive.padding.lg,
    borderBottomWidth: 1,
    minHeight: responsive.header.height,
  },
  backButton: {
    minWidth: rv(80, 100),
    padding: responsive.spacing.sm,
    flexShrink: 0,
  },
  backButtonText: {
    fontSize: responsive.fontSize.lg,
    color: "#007AFF",
    fontWeight: "600",
  },
  headerTitleContainer: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: responsive.spacing.base,
  },
  headerTitle: {
    fontSize: responsive.fontSize["2xl"],
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: responsive.fontSize.sm,
    marginTop: 2,
    textAlign: "center",
  },
  headerSpacer: {
    minWidth: rv(80, 100),
    flexShrink: 0,
  },
  list: {
    padding: responsive.padding.lg,
    paddingBottom: responsive.padding["2xl"],
  },
  resultCardWrapper: {
    marginBottom: responsive.spacing.base,
    borderRadius: responsive.radius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: responsive.card.shadowRadius,
    elevation: 5,
    maxWidth: rv(undefined as any, 600),
    alignSelf: rs("stretch", "center") as any,
  },
  resultCard: {
    padding: responsive.card.padding,
    borderRadius: responsive.radius.lg,
  },
  resultCardPass: {
    borderLeftWidth: 5,
    borderLeftColor: "#34C759",
  },
  resultCardFail: {
    borderLeftWidth: 5,
    borderLeftColor: "#FF3B30",
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isTablet ? 20 : 16,
  },
  resultStatus: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: isTablet ? 24 : 20,
  },
  resultStatusPass: {
    backgroundColor: "#34C759",
  },
  resultStatusFail: {
    backgroundColor: "#FF3B30",
  },
  resultStatusText: {
    fontSize: isTablet ? 16 : 13,
    fontWeight: "bold",
    color: "#fff",
  },
  deleteButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  deleteButtonGradient: {
    padding: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 16,
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 16 : 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconBg: {
    width: isTablet ? 50 : 40,
    height: isTablet ? 50 : 40,
    borderRadius: isTablet ? 25 : 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isTablet ? 12 : 8,
  },
  statEmoji: {
    fontSize: isTablet ? 24 : 20,
  },
  statValue: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    marginTop: 4,
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultDate: {
    fontSize: isTablet ? 16 : 14,
  },
  viewDetails: {
    fontSize: isTablet ? 16 : 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  adCard: {
    marginBottom: responsive.spacing.base,
    borderRadius: responsive.radius.lg,
    paddingVertical: responsive.padding.sm,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: isTablet ? 60 : 40,
  },
  emptyIconContainer: {
    width: isTablet ? 150 : 120,
    height: isTablet ? 150 : 120,
    borderRadius: isTablet ? 75 : 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isTablet ? 32 : 24,
  },
  emptyIcon: {
    fontSize: isTablet ? 80 : 64,
  },
  emptyTitle: {
    fontSize: isTablet ? 28 : 22,
    fontWeight: "bold",
    marginBottom: isTablet ? 16 : 12,
  },
  emptyText: {
    fontSize: isTablet ? 18 : 16,
    textAlign: "center",
    lineHeight: isTablet ? 28 : 24,
    maxWidth: isTablet ? 400 : 300,
  },
});
