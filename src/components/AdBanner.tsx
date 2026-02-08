import React from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { useAdsVisibility } from "../contexts/AdsVisibilityContext";
import AdMobService from "../services/AdMobService";

interface AdBannerProps {
  size?: BannerAdSize;
}

export const AdBanner: React.FC<AdBannerProps> = ({ size }) => {
  const { adsHidden } = useAdsVisibility();
  const adUnitId = AdMobService.getBannerAdUnitId();

  // Don't render banner if ads are hidden
  if (adsHidden) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size || BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => { }}
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
