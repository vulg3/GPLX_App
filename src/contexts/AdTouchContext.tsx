import React, { createContext, useContext, useRef } from "react";
import AdMobService from "../services/AdMobService";

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
    Math.floor(Math.random() * 51) + 100 // Random between 100-150
  );

  const handleTouch = () => {
    touchCountRef.current += 1;

    if (touchCountRef.current >= targetTouchCountRef.current) {
      // Show interstitial ad
      AdMobService.showInterstitialAd(() => {
        // Reset counter and set new random target
        touchCountRef.current = 0;
        targetTouchCountRef.current = Math.floor(Math.random() * 51) + 100;
        console.log(
          `Next ad will show after ${targetTouchCountRef.current} touches`
        );
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
