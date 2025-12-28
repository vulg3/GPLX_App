# Google AdMob Integration Guide

## Setup Completed ✅

### 1. Configuration

- AdMob App IDs configured in `app.json` for both iOS and Android
- Test ads enabled in development mode

### 2. Files Created

- `src/services/AdMobService.ts` - Main AdMob service
- `src/components/AdBanner.tsx` - Banner ad component
- `src/hooks/useInterstitialAd.ts` - Hook for interstitial ads

### 3. Integration Points

- Banner ad integrated above the bottom tab navigation
- AdMob initialized automatically when app starts
- Automatic touch tracking: fullscreen ads show after 100-150 random touches

## Usage Examples

### Banner Ads

Banner ads are already integrated in the bottom tab navigation. The banner will appear automatically above the tab bar.

### Automatic Touch-Based Interstitial Ads

The app automatically tracks user touches and shows fullscreen interstitial ads after a random number of touches (between 100-150). This happens automatically in the MainTabs component. After showing an ad, the counter resets and picks a new random target.

### Manual Interstitial Ads (Fullscreen)

You can also manually show fullscreen ads at strategic points using the `useInterstitialAd` hook:

```tsx
import { useInterstitialAd } from "../hooks/useInterstitialAd";

function ExamResultScreen() {
  const { showAd, isReady } = useInterstitialAd();

  const handleFinishExam = async () => {
    // Show ad after completing exam
    await showAd(() => {
      // Navigate to results or home screen
      navigation.navigate("Results");
    });
  };

  return <Button title="Xem kết quả" onPress={handleFinishExam} />;
}
```

### Common Integration Points for Interstitial Ads

1. After completing a practice exam
2. After finishing a study session
3. Between major screen transitions
4. After viewing exam results

**Note:** Don't show interstitial ads too frequently - it can frustrate users!

## Ad Unit IDs Configuration

Update the Ad Unit IDs in `src/services/AdMobService.ts`:

```typescript
const ADMOB_UNIT_IDS = {
  banner: {
    ios: "ca-app-pub-2615112087856757/YOUR_IOS_BANNER_ID",
    android: "ca-app-pub-2615112087856757/YOUR_ANDROID_BANNER_ID",
  },
  interstitial: {
    ios: "ca-app-pub-2615112087856757/YOUR_IOS_INTERSTITIAL_ID",
    android: "ca-app-pub-2615112087856757/YOUR_ANDROID_INTERSTITIAL_ID",
  },
};
```

### How to Get Ad Unit IDs

1. Go to [AdMob Console](https://apps.admob.com/)
2. Select your app
3. Click "Ad units" → "Add ad unit"
4. Choose "Banner" or "Interstitial"
5. Copy the Ad Unit ID
6. Replace in the code above

## Build Instructions

### iOS

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

### Android

```bash
npx expo run:android
```

## Testing

- In development mode (**DEV** = true), test ads are automatically used
- In production, real ads will be shown using your actual Ad Unit IDs

## Important Notes

1. ⚠️ Update Ad Unit IDs before production release
2. Test ads are shown in development mode
3. Real ads require app review by Google AdMob
4. Interstitial ads are preloaded for better UX
5. Banner ad uses adaptive sizing for better layout
