import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mobileAds, {
  AdEventType,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { getAdsHidden } from "../utils/storage";

// Minimum gap between interstitials so they only appear at natural breaks and
// never back-to-back (e.g. retaking an exam quickly).
const LAST_INTERSTITIAL_KEY = "LAST_INTERSTITIAL_AT";
const MIN_INTERSTITIAL_INTERVAL_MS = 3 * 60 * 1000;

// Replace these with your actual AdMob unit IDs
const ADMOB_UNIT_IDS = {
  banner: {
    ios: __DEV__ ? TestIds.BANNER : "ca-app-pub-2615112087856757/2078023797",
    android: __DEV__
      ? TestIds.BANNER
      : "ca-app-pub-2615112087856757/8422485653",
  },
  interstitial: {
    ios: __DEV__
      ? TestIds.INTERSTITIAL
      : "ca-app-pub-2615112087856757/7138778786",
    android: __DEV__
      ? TestIds.INTERSTITIAL
      : "ca-app-pub-2615112087856757/5796322315",
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
      },
    );

    const unsubscribeClosed = this.interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("Interstitial ad closed");
        // Preload next ad
        this.isInterstitialLoaded = false;
        this.loadInterstitialAd();
      },
    );

    const unsubscribeError = this.interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error("Interstitial ad error:", error);
        this.isInterstitialLoaded = false;
      },
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
      // Check if ads are hidden
      const adsHidden = await getAdsHidden();
      if (adsHidden) {
        console.log("Ads are hidden, skipping interstitial ad");
        if (callback) callback();
        return;
      }

      // Frequency cap: skip if we showed one too recently.
      if (await this.isInterstitialOnCooldown()) {
        console.log("Interstitial on cooldown, skipping");
        if (callback) callback();
        return;
      }

      if (this.interstitialAd && this.isInterstitialLoaded) {
        await this.interstitialAd.show();
        await AsyncStorage.setItem(LAST_INTERSTITIAL_KEY, Date.now().toString());
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

  private async isInterstitialOnCooldown(): Promise<boolean> {
    try {
      const last = await AsyncStorage.getItem(LAST_INTERSTITIAL_KEY);
      if (!last) return false;
      return Date.now() - parseInt(last, 10) < MIN_INTERSTITIAL_INTERVAL_MS;
    } catch {
      return false;
    }
  }
}

export default new AdMobService();
