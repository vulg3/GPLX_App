import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedProgressBarProps {
  progress: number; // 0-100
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export default function AnimatedProgressBar({
  progress,
  color = "#34C759",
  showLabel = true,
  height = 8,
}: AnimatedProgressBarProps) {
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(progress, {
      damping: 15,
      stiffness: 80,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            animatedStyle,
            { backgroundColor: color, height },
          ]}
        />
      </View>
      {showLabel && <Text style={styles.label}>{Math.round(progress)}%</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  track: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    minWidth: 45,
    textAlign: "right",
  },
});




