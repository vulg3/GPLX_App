import React from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import AdMobService from "../services/AdMobService";

interface AdBannerProps {
  size?: BannerAdSize;
}

export const AdBanner: React.FC<AdBannerProps> = ({ size }) => {
  const adUnitId = AdMobService.getBannerAdUnitId();

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size || BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {}}
        onAdFailedToLoad={(error) => {
          console.error("Banner ad failed to load:", error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
