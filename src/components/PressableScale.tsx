import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { haptics, HapticType } from "../utils/haptics";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface PressableScaleProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scale?: number;
  /** Trigger haptic feedback on press-in. `true` => light impact. */
  haptic?: boolean | HapticType;
}

export default function PressableScale({
  children,
  scale = 0.95,
  haptic,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = (event: any) => {
    scaleValue.value = withSpring(scale, {
      damping: 15,
      stiffness: 300,
    });
    if (haptic) {
      haptics[haptic === true ? "light" : haptic]();
    }
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    scaleValue.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
    onPressOut?.(event);
  };

  return (
    <AnimatedTouchable
      {...props}
      style={[props.style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {children}
    </AnimatedTouchable>
  );
}





