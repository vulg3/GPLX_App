import React from "react";
import { View, ViewStyle } from "react-native";

interface TouchableScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Passthrough wrapper kept for API compatibility with the many screens that
 * import it. Interstitials are no longer triggered by random touch counts —
 * they now fire only at natural break points (see AdMobService usage in
 * Exam submit). This component intentionally adds no behaviour.
 */
export const TouchableScreenWrapper: React.FC<TouchableScreenWrapperProps> = ({
  children,
  style,
}) => {
  return <View style={[{ flex: 1 }, style]}>{children}</View>;
};
