import { responsive, rv, rs, rb, screen } from "../utils/responsive";

/**
 * Centralized design tokens.
 *
 * Gradients and brand colors were previously hardcoded and duplicated across
 * screens (e.g. ["#667eea", "#764ba2"], ["#34C759", "#28a745"], ...). Import
 * from here instead so a single change updates the whole app.
 *
 * Spacing / typography / radius live in ../utils/responsive (re-exported below).
 */

// Gradient pairs typed as tuples so they satisfy LinearGradient's `colors` prop.
export const gradients = {
  primary: ["#667eea", "#764ba2"],
  success: ["#34C759", "#28a745"],
  warning: ["#FF9500", "#ff6b6b"],
  info: ["#007AFF", "#5856D6"],
  danger: ["#FF3B30", "#dc2626"],
  streak: ["#FF9500", "#FF3B30"],
} as const satisfies Record<string, readonly [string, string]>;

export type GradientKey = keyof typeof gradients;

// Solid brand/semantic colors (theme-independent accents).
export const palette = {
  primary: "#667eea",
  primaryDark: "#764ba2",
  success: "#34C759",
  warning: "#FF9500",
  info: "#007AFF",
  danger: "#FF3B30",
  streak: "#FF9500",
} as const;

export { responsive, rv, rs, rb, screen };
