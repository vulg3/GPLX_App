import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useInterstitialAd } from "../hooks/useInterstitialAd";

/**
 * Example component showing how to use interstitial ads
 * You can copy this pattern to any screen where you want to show ads
 */
export default function ExampleAdScreen({ navigation }: any) {
  const { showAd, isReady } = useInterstitialAd();
  const { colors } = useTheme();

  const handleShowAd = async () => {
    await showAd(() => {
      // You can navigate or perform any action after the ad is closed
      // navigation.navigate('NextScreen');
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Interstitial Ad Example
      </Text>

      <Text style={[styles.description, { color: colors.text }]}>
        This demonstrates how to show fullscreen ads at strategic moments.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            opacity: isReady ? 1 : 0.5,
          },
        ]}
        onPress={handleShowAd}
        disabled={!isReady}
      >
        <Text style={styles.buttonText}>
          {isReady ? "Show Interstitial Ad" : "Loading Ad..."}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.hint, { color: colors.text }]}>
        💡 Best practices:
        {"\n"}• Show ads after completing tasks (exams, lessons)
        {"\n"}• Don't show too frequently (user experience)
        {"\n"}• Always provide value before showing ads
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 22,
    marginTop: 20,
  },
});
