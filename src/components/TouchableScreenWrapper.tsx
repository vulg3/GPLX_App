import React from "react";
import { TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { useAdTouch } from "../contexts/AdTouchContext";

interface TouchableScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * A wrapper component that tracks touches and shows ads after random 100-150 touches
 * Wrap any screen content with this component to enable ad tracking
 */
export const TouchableScreenWrapper: React.FC<TouchableScreenWrapperProps> = ({
  children,
  style,
}) => {
  const { handleTouch } = useAdTouch();

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};
