import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from '@/src/redux/store';
import { ThemeProvider, useTheme } from "@rneui/themed";
import { useAppSelector } from "@/src/hooks/useRedux";
import { Appearance } from "react-native";
import { Mode } from "@/src/core/const/mode";
import { getTheme } from "@/src/core/theme";
import { PersistGate } from 'redux-persist/integration/react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeWrapper />
      </PersistGate>
    </Provider>
  );
}

const ThemeWrapper = () => {
  const mode = useAppSelector((state) => state.root.app.mode);
  const systemMode = Appearance.getColorScheme();
  const theme = getTheme({ mode: mode === Mode.system ? systemMode : mode });

  return (
    <ThemeProvider theme={theme}>
      <RootNavigation />
    </ThemeProvider>
  );
};

const RootNavigation = () => {
  const { theme: { colors } } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.black,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Chọn loại bằng lái',
        }}
      />
    </Stack>
  );
};

