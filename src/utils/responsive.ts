import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Device type detection
export const isTablet = screenWidth >= 768;
export const isPhone = screenWidth < 768;
export const isLargePhone = screenWidth >= 414; // iPhone Plus, Pro Max
export const isSmallPhone = screenWidth < 375; // iPhone SE, mini

// Responsive dimensions
export const responsive = {
  // Font sizes
  fontSize: {
    xs: isTablet ? 12 : 10,
    sm: isTablet ? 14 : 12,
    base: isTablet ? 16 : 14,
    lg: isTablet ? 18 : 16,
    xl: isTablet ? 20 : 18,
    "2xl": isTablet ? 24 : 20,
    "3xl": isTablet ? 28 : 24,
    "4xl": isTablet ? 32 : 28,
  },

  // Spacing
  spacing: {
    xs: isTablet ? 4 : 2,
    sm: isTablet ? 8 : 4,
    base: isTablet ? 16 : 12,
    lg: isTablet ? 24 : 16,
    xl: isTablet ? 32 : 20,
    "2xl": isTablet ? 40 : 24,
    "3xl": isTablet ? 48 : 32,
  },

  // Padding
  padding: {
    xs: isTablet ? 8 : 4,
    sm: isTablet ? 12 : 8,
    base: isTablet ? 16 : 12,
    lg: isTablet ? 24 : 16,
    xl: isTablet ? 32 : 20,
    "2xl": isTablet ? 40 : 24,
  },

  // Border radius
  radius: {
    sm: isTablet ? 8 : 6,
    base: isTablet ? 12 : 8,
    lg: isTablet ? 16 : 12,
    xl: isTablet ? 20 : 16,
    "2xl": isTablet ? 24 : 20,
    full: isTablet ? 50 : 40,
  },

  // Icon sizes
  icon: {
    sm: isTablet ? 16 : 14,
    base: isTablet ? 20 : 16,
    lg: isTablet ? 24 : 20,
    xl: isTablet ? 32 : 24,
    "2xl": isTablet ? 40 : 32,
  },

  // Button sizes
  button: {
    sm: {
      height: isTablet ? 36 : 32,
      paddingHorizontal: isTablet ? 16 : 12,
      fontSize: isTablet ? 14 : 12,
    },
    base: {
      height: isTablet ? 44 : 40,
      paddingHorizontal: isTablet ? 20 : 16,
      fontSize: isTablet ? 16 : 14,
    },
    lg: {
      height: isTablet ? 52 : 48,
      paddingHorizontal: isTablet ? 24 : 20,
      fontSize: isTablet ? 18 : 16,
    },
  },

  // Card sizes
  card: {
    padding: isTablet ? 24 : 16,
    margin: isTablet ? 20 : 12,
    borderRadius: isTablet ? 20 : 16,
    shadowRadius: isTablet ? 12 : 8,
  },

  // Header sizes
  header: {
    height: isTablet ? 80 : 60,
    padding: isTablet ? 24 : 16,
    fontSize: isTablet ? 24 : 20,
  },

  // List item sizes
  listItem: {
    padding: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 12,
    borderRadius: isTablet ? 16 : 12,
  },
};

// Screen dimensions
export const screen = {
  width: screenWidth,
  height: screenHeight,
  isTablet,
  isPhone,
  isLargePhone,
  isSmallPhone,
};

// Responsive value helper
export const rv = (phoneValue: number, tabletValue: number) =>
  isTablet ? tabletValue : phoneValue;

// Responsive string helper
export const rs = (phoneValue: string, tabletValue: string) =>
  isTablet ? tabletValue : phoneValue;

// Responsive boolean helper
export const rb = (phoneValue: boolean, tabletValue: boolean) =>
  isTablet ? tabletValue : phoneValue;
