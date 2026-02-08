import React, { createContext, useContext, useRef } from "react";
import { useAdsVisibility } from "./AdsVisibilityContext";
import AdMobService from "@/services/AdMobService";

interface AdTouchContextType {
  handleTouch: () => void;
  getTouchCount: () => number;
  getTargetCount: () => number;
}

const AdTouchContext = createContext<AdTouchContextType | undefined>(undefined);

export const AdTouchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const touchCountRef = useRef(0);
  const targetTouchCountRef = useRef(
    Math.floor(Math.random() * 51) + 50 // Random between 100-150
  );
  const { adsHidden } = useAdsVisibility();


  const handleTouch = () => {
    if (adsHidden) {
      return;
    }

    touchCountRef.current += 1;
    console.log(
      "Touch count:",
      touchCountRef.current,
      "Target:",
      targetTouchCountRef.current
    );

    if (touchCountRef.current >= targetTouchCountRef.current) {
      console.log("Showing interstitial ad...");
      // Show interstitial ad
      AdMobService.showInterstitialAd(() => {
        // Reset counter and set new random target
        touchCountRef.current = 0;
        targetTouchCountRef.current = Math.floor(Math.random() * 51) + 100;
        console.log("Ad shown. Counter reset. New target:", targetTouchCountRef.current);
      });
    }
  };

  const getTouchCount = () => touchCountRef.current;
  const getTargetCount = () => targetTouchCountRef.current;

  return (
    <AdTouchContext.Provider
      value={{ handleTouch, getTouchCount, getTargetCount }}
    >
      {children}
    </AdTouchContext.Provider>
  );
};

export const useAdTouch = () => {
  const context = useContext(AdTouchContext);
  if (context === undefined) {
    throw new Error("useAdTouch must be used within an AdTouchProvider");
  }
  return context;
};
