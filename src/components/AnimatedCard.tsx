import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | (ViewStyle | undefined | false | null)[];
}

export default function AnimatedCard({
  children,
  delay = 0,
  style,
}: AnimatedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    }, delay);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
