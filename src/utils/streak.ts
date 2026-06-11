import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "STUDY_STREAK";
export const DEFAULT_DAILY_GOAL = 20;

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // local YYYY-MM-DD
  todayCount: number;
  dailyGoal: number;
}

export interface StreakView extends StreakData {
  /** Streak to show: 0 if the chain has already lapsed (no study yesterday/today). */
  displayStreak: number;
  studiedToday: boolean;
  /** todayCount clamped against dailyGoal, 0..1. */
  goalProgress: number;
}

const DEFAULT: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  todayCount: 0,
  dailyGoal: DEFAULT_DAILY_GOAL,
};

// Local date key (not UTC) so "today" matches the user's calendar day.
const dateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayKey = () => dateKey(new Date());
const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
};

const read = async (): Promise<StreakData> => {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
};

const write = async (data: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving streak:", error);
  }
};

const toView = (data: StreakData): StreakView => {
  const today = todayKey();
  const studiedToday = data.lastStudyDate === today;
  const active = studiedToday || data.lastStudyDate === yesterdayKey();
  const goalProgress =
    data.dailyGoal > 0
      ? Math.min(1, (studiedToday ? data.todayCount : 0) / data.dailyGoal)
      : 0;
  return {
    ...data,
    displayStreak: active ? data.currentStreak : 0,
    studiedToday,
    goalProgress,
  };
};

export const getStreak = async (): Promise<StreakView> => toView(await read());

/**
 * Record that the user studied `count` questions now. Advances the streak when
 * the previous activity was yesterday, keeps it for same-day activity, and
 * resets to 1 after a gap. Returns the updated view.
 */
export const recordStudyActivity = async (
  count: number = 1
): Promise<StreakView> => {
  const data = await read();
  const today = todayKey();

  if (data.lastStudyDate === today) {
    data.todayCount += count;
  } else if (data.lastStudyDate === yesterdayKey()) {
    data.currentStreak += 1;
    data.todayCount = count;
    data.lastStudyDate = today;
  } else {
    data.currentStreak = 1;
    data.todayCount = count;
    data.lastStudyDate = today;
  }

  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  await write(data);
  return toView(data);
};

export const setDailyGoal = async (goal: number): Promise<StreakView> => {
  const data = await read();
  data.dailyGoal = Math.max(1, Math.round(goal));
  await write(data);
  return toView(data);
};
