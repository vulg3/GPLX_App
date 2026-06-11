import * as Haptics from "expo-haptics";

/**
 * Thin wrappers around expo-haptics. Every call is fire-and-forget and
 * swallows errors so haptics never break interaction (e.g. on devices /
 * simulators without a Taptic engine).
 */
export const haptics = {
  light: () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  medium: () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  selection: () => Haptics.selectionAsync().catch(() => {}),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    ),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(
      () => {}
    ),
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
      () => {}
    ),
};

export type HapticType = keyof typeof haptics;
