import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

interface GradientBackgroundProps {
  children: React.ReactNode;
  colors?: string[];
}

export default function GradientBackground({
  children,
  colors = ["#667eea", "#764ba2"],
}: GradientBackgroundProps) {
  return (
    <LinearGradient colors={colors} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});



