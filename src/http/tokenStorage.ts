import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Tokens } from "./types";

const KEY = "auth:tks";

let memory: Tokens = { accessToken: null, refreshToken: null };

export async function saveTokens(tks: Tokens) {
  memory = tks;
  await AsyncStorage.setItem(KEY, JSON.stringify(tks));
}

export async function restoreTokens(): Promise<Tokens> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) {
    const parsed = JSON.parse(raw) as Tokens;
    memory = parsed;
  }
  return memory;
}

export async function clearTokens() {
  memory = { accessToken: null, refreshToken: null };
  await AsyncStorage.removeItem(KEY);
}

export function getAccessToken() {
  return memory.accessToken;
}

export function getRefreshToken() {
  return memory.refreshToken;
}
