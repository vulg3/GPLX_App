import { Platform } from "react-native";
import mobileAds, {
  AdEventType,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// Replace these with your actual AdMob unit IDs
const ADMOB_UNIT_IDS = {
  banner: {
    ios: __DEV__ ? TestIds.BANNER : "ca-app-pub-2615112087856757~4950144509",
    android: __DEV__
      ? TestIds.BANNER
      : "ca-app-pub-2615112087856757~4950144509",
  },
  interstitial: {
    ios: __DEV__
      ? TestIds.INTERSTITIAL
      : "ca-app-pub-2615112087856757~4950144509",
    android: __DEV__
      ? TestIds.INTERSTITIAL
      : "ca-app-pub-2615112087856757~4950144509",
  },
};

class AdMobService {
  private interstitialAd: InterstitialAd | null = null;
  private isInterstitialLoaded: boolean = false;

  /**
   * Initialize AdMob SDK
   */
  async initialize() {
    try {
      await mobileAds().initialize();
      console.log("AdMob initialized successfully");

      // Preload interstitial ad
      this.loadInterstitialAd();
    } catch (error) {
      console.error("Error initializing AdMob:", error);
    }
  }

  /**
   * Get Banner Ad Unit ID based on platform
   */
  getBannerAdUnitId(): string {
    return Platform.OS === "ios"
      ? ADMOB_UNIT_IDS.banner.ios
      : ADMOB_UNIT_IDS.banner.android;
  }

  /**
   * Get Banner Ad Size
   */
  getBannerAdSize() {
    return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
  }

  /**
   * Load Interstitial Ad
   */
  private loadInterstitialAd() {
    const adUnitId =
      Platform.OS === "ios"
        ? ADMOB_UNIT_IDS.interstitial.ios
        : ADMOB_UNIT_IDS.interstitial.android;

    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Set up event listeners
    const unsubscribeLoaded = this.interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        this.isInterstitialLoaded = true;
        console.log("Interstitial ad loaded");
      }
    );

    const unsubscribeClosed = this.interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("Interstitial ad closed");
        // Preload next ad
        this.isInterstitialLoaded = false;
        this.loadInterstitialAd();
      }
    );

    const unsubscribeError = this.interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Interstitial ad error:", error);
        this.isInterstitialLoaded = false;
      }
    );

    // Load the ad
    this.interstitialAd.load();
  }

  /**
   * Show Interstitial Ad
   * @param callback Optional callback to execute after ad is shown/closed
   */
  async showInterstitialAd(callback?: () => void): Promise<void> {
    try {
      if (this.interstitialAd && this.isInterstitialLoaded) {
        await this.interstitialAd.show();
        if (callback) callback();
      } else {
        console.log("Interstitial ad not ready yet");
        if (callback) callback();
        // Try to load it again
        this.loadInterstitialAd();
      }
    } catch (error) {
      console.error("Error showing interstitial ad:", error);
      if (callback) callback();
    }
  }

  /**
   * Check if interstitial ad is ready
   */
  isInterstitialReady(): boolean {
    return this.isInterstitialLoaded;
  }
}

export default new AdMobService();
