import React, { createContext, useContext, useEffect, useState } from "react";
import { getAdsHidden, setAdsHidden } from "../utils/storage";

interface AdsVisibilityContextType {
  adsHidden: boolean;
  setAdsHiddenState: (hidden: boolean) => Promise<void>;
}

const AdsVisibilityContext = createContext<
  AdsVisibilityContextType | undefined
>(undefined);

export const AdsVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adsHidden, setAdsHiddenState] = useState<boolean>(false);

  useEffect(() => {
    // Load ads hidden state on mount
    const loadAdsHiddenState = async () => {
      const hidden = await getAdsHidden();
      console.log("hidden", hidden);
      setAdsHiddenState(hidden);
    };
    loadAdsHiddenState();
  }, []);

  const handleSetAdsHidden = async (hidden: boolean) => {
    await setAdsHidden(hidden);
    setAdsHiddenState(hidden);
  };

  return (
    <AdsVisibilityContext.Provider
      value={{ adsHidden, setAdsHiddenState: handleSetAdsHidden }}
    >
      {children}
    </AdsVisibilityContext.Provider>
  );
};

export const useAdsVisibility = () => {
  const context = useContext(AdsVisibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAdsVisibility must be used within an AdsVisibilityProvider"
    );
  }
  return context;
};
