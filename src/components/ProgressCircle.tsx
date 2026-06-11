import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage = 0,
  size = 150,
  strokeWidth = 15,
  duration = 1000,
}) => {
  const { theme, colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const getColor = () => {
    if (percentage >= 80) return "#4ADE80"; // Green
    if (percentage >= 50) return "#FBBF24"; // Yellow
    return "#F87171"; // Red
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={"-90" as any} origin={`${size / 2}, ${size / 2}` as any}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeOpacity={0.2}
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset as any}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.percentageText, { color: colors.text }]}>
          {Math.round(percentage)}%
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Tỉ lệ đỗ
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  label: {
    fontSize: 12,
    marginTop: -4,
  },
});

export default ProgressCircle;
