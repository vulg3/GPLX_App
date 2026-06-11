import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { gradients } from "../theme/tokens";
import { getStreak, StreakView } from "../utils/streak";
import { responsive } from "../utils/responsive";
import AnimatedCard from "./AnimatedCard";
import AnimatedProgressBar from "./AnimatedProgressBar";

interface StreakCardProps {
  delay?: number;
}

/**
 * Compact streak + daily-goal card shown on the license tabs. Reloads each time
 * the tab regains focus so the figures stay current after studying.
 */
const StreakCard: React.FC<StreakCardProps> = ({ delay = 100 }) => {
  const { colors } = useTheme();
  const [streak, setStreak] = useState<StreakView | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getStreak().then((s) => active && setStreak(s));
      return () => {
        active = false;
      };
    }, [])
  );

  if (!streak) return null;

  const todayCount = streak.studiedToday ? streak.todayCount : 0;

  return (
    <AnimatedCard delay={delay} style={styles.wrapper}>
      <LinearGradient
        colors={gradients.streak}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.streakSide}
      >
        <Text style={styles.flame}>🔥</Text>
        <Text style={styles.streakNumber}>{streak.displayStreak}</Text>
        <Text style={styles.streakLabel}>ngày liên tiếp</Text>
      </LinearGradient>

      <View style={[styles.goalSide, { backgroundColor: colors.card }]}>
        <View style={styles.goalHeader}>
          <Ionicons name="flag" size={16} color={colors.primary} />
          <Text style={[styles.goalTitle, { color: colors.text }]}>
            Mục tiêu hôm nay
          </Text>
        </View>
        <Text style={[styles.goalCount, { color: colors.text }]}>
          {todayCount}
          <Text style={[styles.goalTarget, { color: colors.subText }]}>
            {" "}
            / {streak.dailyGoal} câu
          </Text>
        </Text>
        <AnimatedProgressBar
          progress={streak.goalProgress * 100}
          color={colors.success}
          showLabel={false}
          height={8}
        />
        <Text style={[styles.goalHint, { color: colors.subText }]}>
          {streak.goalProgress >= 1
            ? "🎉 Đã đạt mục tiêu hôm nay!"
            : streak.longestStreak > 0
              ? `Kỷ lục: ${streak.longestStreak} ngày`
              : "Học mỗi ngày để giữ chuỗi!"}
        </Text>
      </View>
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginHorizontal: responsive.spacing.base,
    marginTop: responsive.spacing.base,
    borderRadius: responsive.radius.lg,
    overflow: "hidden",
  },
  streakSide: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsive.padding.base,
  },
  flame: {
    fontSize: 28,
  },
  streakNumber: {
    fontSize: responsive.fontSize["3xl"],
    fontWeight: "bold",
    color: "#fff",
    marginTop: 2,
  },
  streakLabel: {
    fontSize: responsive.fontSize.xs,
    color: "#fff",
    opacity: 0.95,
  },
  goalSide: {
    flex: 1,
    padding: responsive.padding.base,
    justifyContent: "center",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  goalTitle: {
    fontSize: responsive.fontSize.sm,
    fontWeight: "600",
  },
  goalCount: {
    fontSize: responsive.fontSize["2xl"],
    fontWeight: "bold",
    marginBottom: 8,
  },
  goalTarget: {
    fontSize: responsive.fontSize.base,
    fontWeight: "400",
  },
  goalHint: {
    fontSize: responsive.fontSize.xs,
    marginTop: 8,
  },
});

export default StreakCard;
