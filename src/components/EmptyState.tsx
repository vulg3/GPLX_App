import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "../contexts/ThemeContext";
import { gradients, GradientKey } from "../theme/tokens";
import { responsive } from "../utils/responsive";
import PressableScale from "./PressableScale";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  ctaLabel?: string;
  onPressCta?: () => void;
  gradient?: GradientKey;
}

/**
 * Friendly, theme-aware empty state used across lists (exam history,
 * câu hay sai, ...) so empty screens feel intentional instead of blank.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "document-text-outline",
  title,
  description,
  ctaLabel,
  onPressCta,
  gradient = "primary",
}) => {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify()}
      style={styles.container}
    >
      <View
        style={[styles.iconCircle, { backgroundColor: colors.infoBg }]}
      >
        <Ionicons name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {!!description && (
        <Text style={[styles.description, { color: colors.subText }]}>
          {description}
        </Text>
      )}
      {!!ctaLabel && !!onPressCta && (
        <PressableScale style={styles.ctaWrapper} onPress={onPressCta}>
          <LinearGradient
            colors={gradients[gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </PressableScale>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsive.padding.xl,
    paddingVertical: responsive.padding["2xl"],
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsive.spacing.lg,
  },
  title: {
    fontSize: responsive.fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: responsive.spacing.sm,
  },
  description: {
    fontSize: responsive.fontSize.base,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: responsive.spacing.lg,
  },
  ctaWrapper: {
    borderRadius: responsive.radius.lg,
    overflow: "hidden",
    marginTop: responsive.spacing.sm,
  },
  cta: {
    paddingHorizontal: responsive.padding.xl,
    paddingVertical: responsive.padding.base,
  },
  ctaText: {
    color: "#fff",
    fontSize: responsive.fontSize.base,
    fontWeight: "bold",
  },
});

export default EmptyState;
