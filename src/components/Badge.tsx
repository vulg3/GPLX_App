import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TextStyle, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface BadgeProps {
  text: string;
  type?: "success" | "error" | "warning" | "info" | "critical";
  style?: ViewStyle;
  textStyle?: TextStyle;
  animated?: boolean;
}

export default function Badge({
  text,
  type = "info",
  style,
  textStyle,
  animated = false,
}: BadgeProps) {
  const getColors = () => {
    switch (type) {
      case "success":
        return ["#34C759", "#28a745"];
      case "error":
        return ["#FF3B30", "#dc2626"];
      case "warning":
        return ["#FF9500", "#ff6b6b"];
      case "critical":
        return ["#FF3B30", "#dc2626"];
      case "info":
      default:
        return ["#007AFF", "#5856D6"];
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓ ";
      case "error":
        return "✗ ";
      case "warning":
        return "⚠️ ";
      case "critical":
        return "⚠️ ";
      default:
        return "";
    }
  };

  const Component = animated ? Animated.View : LinearGradient;
  const componentProps = animated
    ? {
        entering: FadeIn.springify(),
        style: [styles.badge, style],
      }
    : {
        colors: getColors(),
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
        style: [styles.badge, style],
      };

  return (
    <Component {...componentProps}>
      <Text style={[styles.text, textStyle]}>
        {getIcon()}
        {text}
      </Text>
    </Component>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
