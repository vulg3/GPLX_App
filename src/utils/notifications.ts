import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { getStreak } from "./streak";

const NOTIF_KEY = "NOTIF_SETTINGS";
const ANDROID_CHANNEL_ID = "study-reminders";
const REMINDER_IDENTIFIER = "streak-reminder";

export const REMINDER_HOUR_PRESETS = [8, 12, 20] as const;
export const DEFAULT_REMINDER_HOUR = 20;

export interface NotifSettings {
  enabled: boolean;
  hour: number; // 0-23
}

const DEFAULT_SETTINGS: NotifSettings = {
  enabled: false,
  hour: DEFAULT_REMINDER_HOUR,
};

let handlerConfigured = false;

/** Foreground display behaviour. Call once on app start. */
export const configureNotifications = () => {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const getNotifSettings = async (): Promise<NotifSettings> => {
  try {
    const raw = await AsyncStorage.getItem(NOTIF_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const saveNotifSettings = async (settings: NotifSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving notif settings:", error);
  }
};

export const requestPermission = async (): Promise<boolean> => {
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted && current.canAskAgain) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted;
  }
  return granted;
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "Nhắc nhở học",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
};

const reminderBody = (streak: number): string => {
  if (streak >= 2) {
    return `🔥 Đừng để mất chuỗi ${streak} ngày! Ôn vài câu trước khi ngủ nào.`;
  }
  if (streak === 1) {
    return "🔥 Bạn đã bắt đầu chuỗi học! Ôn tiếp hôm nay để giữ lửa nhé.";
  }
  return "📚 Dành vài phút ôn lý thuyết hôm nay để sớm đậu nào!";
};

/** Cancel any existing reminder and schedule a fresh daily one (if enabled). */
export const scheduleStreakReminder = async (): Promise<void> => {
  const settings = await getNotifSettings();
  await cancelReminders();
  if (!settings.enabled) return;

  await ensureAndroidChannel();
  const { displayStreak } = await getStreak();

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_IDENTIFIER,
    content: {
      title: "Lý thuyết giao thông",
      body: reminderBody(displayStreak),
      ...(Platform.OS === "android" ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: 0,
    },
  });
};

export const cancelReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER);
  } catch {
    // not scheduled yet — ignore
  }
};

/** Enable/disable reminders. Returns the persisted settings. */
export const setRemindersEnabled = async (
  enabled: boolean
): Promise<NotifSettings> => {
  if (enabled) {
    const granted = await requestPermission();
    if (!granted) {
      const settings = { ...(await getNotifSettings()), enabled: false };
      await saveNotifSettings(settings);
      return settings;
    }
  }
  const settings = { ...(await getNotifSettings()), enabled };
  await saveNotifSettings(settings);
  await scheduleStreakReminder();
  return settings;
};

export const setReminderHour = async (hour: number): Promise<NotifSettings> => {
  const settings = { ...(await getNotifSettings()), hour };
  await saveNotifSettings(settings);
  await scheduleStreakReminder();
  return settings;
};

/**
 * Keep the scheduled reminder's copy in sync with the current streak. Safe to
 * call on app launch and after each study session.
 */
export const refreshReminder = async (): Promise<void> => {
  const settings = await getNotifSettings();
  if (!settings.enabled) return;
  await scheduleStreakReminder();
};
