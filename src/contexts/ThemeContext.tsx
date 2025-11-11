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
    border: string;
    primary: string;
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
    } catch (error) {
      console.log("Error loading theme:", error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
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
        border: "#3a3a3a",
        primary: "#667eea",
      }
    : {
        background: "#f8f9fa",
        card: "#ffffff",
        text: "#1a1a1a",
        subText: "#666666",
        border: "#e0e0e0",
        primary: "#667eea",
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
