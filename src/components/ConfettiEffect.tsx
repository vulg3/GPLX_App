import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const CONFETTI_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
const CONFETTI_COUNT = 50;

interface ConfettiPieceProps {
  delay: number;
  color: string;
  startX: number;
}

const ConfettiPiece = ({ delay, color, startX }: ConfettiPieceProps) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const randomDuration = 2000 + Math.random() * 1000;
    const randomX = (Math.random() - 0.5) * 200;

    translateY.value = withDelay(
      delay,
      withTiming(height + 50, { duration: randomDuration })
    );
    translateX.value = withDelay(
      delay,
      withTiming(randomX, { duration: randomDuration })
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 1000 }), -1)
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(randomDuration - 500, withTiming(0, { duration: 500 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: color,
          left: startX,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function ConfettiEffect() {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
        <ConfettiPiece
          key={index}
          delay={index * 50}
          color={CONFETTI_COLORS[index % CONFETTI_COLORS.length]}
          startX={Math.random() * width}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});





