import AdMobService from "../services/AdMobService";

/**
 * Hook to manage showing interstitial ads
 * Example usage:
 *
 * import { useInterstitialAd } from '../hooks/useInterstitialAd';
 *
 * const { showAd, isReady } = useInterstitialAd();
 *
 * // Show ad when needed (e.g., after completing an exam)
 * await showAd(() => {
 *   // Navigate or do something after ad is closed
 * });
 */

interface UseInterstitialAdReturn {
  showAd: (callback?: () => void) => Promise<void>;
  isReady: boolean;
}

export const useInterstitialAd = (): UseInterstitialAdReturn => {
  const showAd = async (callback?: () => void) => {
    await AdMobService.showInterstitialAd(callback);
  };

  const isReady = AdMobService.isInterstitialReady();

  return {
    showAd,
    isReady,
  };
};
