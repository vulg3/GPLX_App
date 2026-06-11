import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  setTheme: (theme: Theme) => Promise<void>;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    textSecondary: string;
    border: string;
    primary: string;
    secondary: string;
    disabled: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    // Soft tinted backgrounds for badges / icon chips / callouts.
    successBg: string;
    warningBg: string;
    infoBg: string;
    errorBg: string;
    // Tint for the elevated app bar / status bar area.
    overlay: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("auto");
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {}
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      throw error;
    }
  };

  const isDarkMode =
    theme === "dark" || (theme === "auto" && systemColorScheme === "dark");

  const colors = isDarkMode
    ? {
        background: "#1a1a1a",
        card: "#2a2a2a",
        text: "#ffffff",
        subText: "#aaaaaa",
        textSecondary: "#aaaaaa",
        border: "#3a3a3a",
        primary: "#667eea",
        secondary: "#2a2a2a",
        disabled: "#555555",
        error: "#f87171",
        success: "#34C759",
        warning: "#FF9F0A",
        info: "#0A84FF",
        successBg: "#173a23",
        warningBg: "#3a3020",
        infoBg: "#16294a",
        errorBg: "#3a1d1d",
        overlay: "#000000",
      }
    : {
        background: "#f8f9fa",
        card: "#ffffff",
        text: "#1a1a1a",
        subText: "#666666",
        textSecondary: "#666666",
        border: "#e0e0e0",
        primary: "#667eea",
        secondary: "#ffffff",
        disabled: "#999999",
        error: "#ef4444",
        success: "#34C759",
        warning: "#FF9500",
        info: "#007AFF",
        successBg: "#e8f5e9",
        warningBg: "#fff3e0",
        infoBg: "#e3f2fd",
        errorBg: "#fdecea",
        overlay: "#000000",
      };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
