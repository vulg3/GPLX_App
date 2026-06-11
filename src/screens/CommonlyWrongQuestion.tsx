import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState, PressableScale } from "../components";
import { useTheme } from "../contexts/ThemeContext";
import { gradients } from "../theme/tokens";
import { LicenseType } from "../types/Question";
import { haptics } from "../utils/haptics";
import { responsive } from "../utils/responsive";
import {
  getWrongQuestions,
  removeWrongQuestion,
  WrongEntry,
} from "../utils/wrongQuestions";

export default function CommonlyWrongQuestion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const { licenseType } = (route.params as { licenseType?: LicenseType }) ?? {};
  const license: LicenseType = licenseType ?? "A";

  const [entries, setEntries] = useState<WrongEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getWrongQuestions(license);
    setEntries(data);
    setLoading(false);
  }, [license]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMastered = async (questionId: string) => {
    haptics.success();
    await removeWrongQuestion(license, questionId);
    setEntries((prev) => prev.filter((e) => e.question._id.$oid !== questionId));
  };

  const renderItem = ({ item, index }: { item: WrongEntry; index: number }) => {
    const { question } = item;
    return (
      <Animated.View
        entering={FadeInUp.delay(Math.min(index, 8) * 50).springify()}
        style={[styles.card, { backgroundColor: colors.card }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.wrongBadge, { backgroundColor: colors.errorBg }]}>
            <Ionicons name="close-circle" size={14} color={colors.error} />
            <Text style={[styles.wrongBadgeText, { color: colors.error }]}>
              Sai {item.wrongCount} lần
            </Text>
          </View>
        </View>

        <Text style={[styles.questionText, { color: colors.text }]}>
          {question.number ? `Câu ${question.number}. ` : ""}
          {question.question}
        </Text>

        {!!question.hinhanhq && (
          <Image
            source={{ uri: `https://taplai.com/${question.hinhanhq}` }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.answers}>
          {question.answers.map((answer, idx) => {
            const isCorrect = answer.correct;
            return (
              <View
                key={idx}
                style={[
                  styles.answer,
                  {
                    backgroundColor: isCorrect
                      ? colors.successBg
                      : colors.background,
                    borderColor: isCorrect ? colors.success : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "ellipse-outline"}
                  size={18}
                  color={isCorrect ? colors.success : colors.subText}
                />
                <Text
                  style={[
                    styles.answerText,
                    {
                      color: isCorrect ? colors.success : colors.text,
                      fontWeight: isCorrect ? "700" : "400",
                    },
                  ]}
                >
                  {answer.text}
                </Text>
              </View>
            );
          })}
        </View>

        {!!question.explanation && (
          <View style={[styles.explain, { backgroundColor: colors.infoBg }]}>
            <Text style={[styles.explainTitle, { color: colors.info }]}>
              💡 Giải thích
            </Text>
            <Text style={[styles.explainText, { color: colors.text }]}>
              {question.explanation}
            </Text>
          </View>
        )}

        <PressableScale
          onPress={() => handleMastered(question._id.$oid)}
          style={styles.masteredWrapper}
        >
          <LinearGradient
            colors={gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.mastered}
          >
            <Ionicons name="checkmark-done" size={18} color="#fff" />
            <Text style={styles.masteredText}>Đã thuộc</Text>
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={[]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={gradients.primary}
        style={[styles.header, { paddingTop: top + responsive.padding.sm }]}
      >
        <PressableScale
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </PressableScale>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Câu hay sai</Text>
          <Text style={styles.headerSubtitle}>
            {license === "A" ? "Bằng A / A1" : "Bằng B / B1"}
            {entries.length > 0 ? ` · ${entries.length} câu` : ""}
          </Text>
        </View>
      </LinearGradient>

      {loading ? null : entries.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="checkmark-circle-outline"
            title="Chưa có câu nào hay sai"
            description="Làm bài thi thử — những câu bạn trả lời sai sẽ tự động xuất hiện ở đây để ôn lại."
            ctaLabel="Về trang chủ"
            gradient="success"
            onPressCta={() => navigation.goBack()}
          />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.question._id.$oid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsive.padding.base,
    paddingBottom: responsive.padding.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: responsive.spacing.xs,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: {
    fontSize: responsive.fontSize["2xl"],
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: responsive.fontSize.sm,
    color: "#fff",
    opacity: 0.9,
    marginTop: 2,
  },
  emptyWrap: { flex: 1, justifyContent: "center" },
  listContent: {
    padding: responsive.padding.base,
    paddingBottom: responsive.padding["2xl"],
  },
  card: {
    borderRadius: responsive.radius.lg,
    padding: responsive.padding.base,
    marginBottom: responsive.spacing.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: responsive.spacing.sm,
  },
  wrongBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: responsive.radius.full,
  },
  wrongBadgeText: {
    fontSize: responsive.fontSize.xs,
    fontWeight: "700",
  },
  questionText: {
    fontSize: responsive.fontSize.lg,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: responsive.spacing.sm,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: responsive.radius.base,
    marginBottom: responsive.spacing.sm,
  },
  answers: { gap: responsive.spacing.sm },
  answer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: responsive.padding.sm,
    borderRadius: responsive.radius.base,
    borderWidth: 1,
  },
  answerText: {
    flex: 1,
    fontSize: responsive.fontSize.base,
    lineHeight: 20,
  },
  explain: {
    marginTop: responsive.spacing.base,
    padding: responsive.padding.base,
    borderRadius: responsive.radius.base,
  },
  explainTitle: {
    fontSize: responsive.fontSize.sm,
    fontWeight: "bold",
    marginBottom: 4,
  },
  explainText: {
    fontSize: responsive.fontSize.base,
    lineHeight: 22,
  },
  masteredWrapper: {
    borderRadius: responsive.radius.base,
    overflow: "hidden",
    marginTop: responsive.spacing.base,
  },
  mastered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: responsive.padding.sm,
  },
  masteredText: {
    color: "#fff",
    fontSize: responsive.fontSize.base,
    fontWeight: "bold",
  },
});
