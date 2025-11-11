import React from "react";
import { View, ViewStyle } from "react-native";
import { responsive } from "../utils/responsive";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number;
  centerContent?: boolean;
}

export default function ResponsiveContainer({
  children,
  style,
  maxWidth,
  centerContent = true,
}: ResponsiveContainerProps) {
  const containerStyle: ViewStyle = {
    flex: 1,
    ...(responsive.isTablet &&
      centerContent && {
        maxWidth: maxWidth || 800,
        alignSelf: "center",
        width: "100%",
      }),
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
}
