# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vietnamese driving-license theory exam app ("Lý thuyết giao thông" / GPLX). React Native + Expo (SDK 53, RN 0.79.5, React 19), TypeScript, written for iOS and Android. The New Architecture is **disabled** (`newArchEnabled: false`). The UI text and question content are in Vietnamese.

## Commands

```bash
npm install              # installs with legacy-peer-deps (.npmrc) — required for the RN dep set
npm start                # expo start (Metro dev server)
npm run ios              # expo run:ios  (prebuild + native build; needs CocoaPods)
npm run android          # expo run:android
npm run run-my-phone     # run:ios on a specific physical device
npm test                 # jest --watchAll (jest-expo preset)
npx jest path/to/file    # run a single test file (jest is installed; use npx)
```

This project uses a **development build / prebuild workflow, not Expo Go** — `react-native-google-mobile-ads` and other native modules require it. After changing `app.json` plugins or native config, run `npx expo prebuild` (or a fresh `run:ios`/`run:android`) to regenerate native projects. EAS build profiles are in `eas.json` (development / preview / production).

`build.log`, `ios/pod.log`, `prebuild_error.log` are local build artifacts, not source.

## Path aliases

`@/*` maps to `src/*`, configured in **both** `tsconfig.json` (for the type checker) and `babel.config.js` via `babel-plugin-module-resolver` (for the bundler). A change to one must be mirrored in the other. Note some files still use relative imports (`../...`); both styles coexist.

## Architecture

**Entry chain:** `index.js` → `App.tsx`. `App.tsx` wires the provider stack and root navigator. Provider nesting order matters: `ThemeProvider` → `AdsVisibilityProvider` → `AdTouchProvider` (AdTouch depends on AdsVisibility). The root **Stack navigator** picks its initial route at runtime from AsyncStorage: if a license is already selected → `MainTabs`, else → `LicenseSelection`.

**Navigation is two-layered:** a root `createStackNavigator` (App.tsx) wraps `MainTabs` (`src/navigation/MainTabs.tsx`), a `createBottomTabNavigator` with tabs Xe máy (`MotorbikeTab`) / Ô tô (`CarTab`) / Thống kê (`AnalyticsDashboard`) / Cài đặt (`Settings`). The tab bar is a **custom `tabBar` component** that renders an `AdBanner` directly above the tabs. Flow screens (Exam, ExamResult, ReviewAnswers, Study, QuestionList, etc.) live in the root stack and are pushed over the tabs. Exam and ExamResult set `gestureEnabled: false` to block swipe-back.

**License types** are `"A"` (motorbike) and `"B"` (car) — see `src/types/Question.ts`. This distinction drives the whole app: separate question pools, separate exam structures, separate stored history.

**Question data is static JSON bundled in the app**, not fetched: `assets/data/shlx.bike_questions.json` and `shlx.car_questions.json`, imported directly by `MotorbikeTab`/`CarTab`. A `Question` carries a `category` string (e.g. contains `"diem-liet"` for critical/fail-on-miss questions) and optional `hinhanhq` image. Category strings are the join key across the app.

**Exam generation** (`src/utils/examGenerator.ts`) builds a randomized exam from a pool by license: License A = 25 questions / 19 min / pass 21, License B = 30 questions / 20 min / pass 27, with a category-balanced distribution and guaranteed critical (`diem-liet`) questions.

**Analytics** (`src/utils/analytics.ts`) derives stats purely from stored exam history. It maps raw Vietnamese category slugs (`khai-niem`, `bien-bao`, `sa-hinh`, …) to six `TopicCategory` buckets via `TOPIC_MAPPING`. When adding question categories, update this mapping or they fall outside the topic breakdown.

**Persistence** is AsyncStorage only (no backend), centralized in `src/utils/storage.ts` under fixed keys (`EXAM_RESULTS`, `STUDY_PROGRESS`, `SELECTED_LICENSE`, `ADS_HIDDEN`). Exam results are capped to the 50 most recent. Go through these helpers rather than calling AsyncStorage directly.

**Theming:** `src/contexts/ThemeContext.tsx` is the live theme source — `useTheme()` returns `{ isDarkMode, colors }` with light/dark/auto modes persisted to AsyncStorage. Consume colors from this context for runtime theming. (`src/core/theme/*` and root `constants/Colors.ts` are an older static palette/RNE theme; prefer the context.)

## Ads (AdMob)

`react-native-google-mobile-ads`, configured via the plugin in `app.json` (app IDs) and `src/services/AdMobService.ts` (unit IDs). Unit IDs auto-switch to Google `TestIds` when `__DEV__`. `AdMobService` is a singleton, initialized once in `MainTabs` mount; it manages the banner and a preloaded interstitial.

**Interstitials are triggered by a hidden touch counter**, not by navigation: `AdTouchContext` counts screen touches and fires an interstitial after a randomized threshold (~100–150). `AdsVisibilityContext` exposes a password-protected `adsHidden` flag (persisted as `ADS_HIDDEN`) that suppresses all ad display and the touch counter — used to disable ads. Screens opt into touch counting via `TouchableScreenWrapper`.

## Native build notes

`plugins/withFmtFix.js` is a custom Expo config plugin that patches the generated Podfile to force the `fmt` pod to C++17, working around a C++20 compile error. It is registered in `app.json` plugins. iOS uses static frameworks (`useFrameworks: "static"`), deployment target 15.1; Android min SDK 24 with Proguard/resource shrinking in release.

## Known cruft

The repo carries Expo-template and superseded files that are **not** the active app: root-level `components/` (e.g. `Themed.tsx`, `EditScreenInfo.tsx`), root `constants/`, and duplicated screens like `Settings_New.tsx`. The live app code is under `src/`. There are also many top-level `*.md` design/status docs (CHANGELOG, FEATURES_SUMMARY, etc.) — historical notes, not authoritative for current behavior.
