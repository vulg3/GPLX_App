import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from '@/src/redux/store';
import { ThemeProvider } from "@rneui/themed";
import { useAppSelector } from "@/src/hooks/useRedux";
import { Appearance } from "react-native";
import { Mode } from "@/src/core/const/mode";
import { getTheme } from "@/src/core/theme";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
}

const RootNavigation = () => {
  const mode = useAppSelector((state) => state.root.app.mode)
  const isLoading = useAppSelector((state) => state.root.app.isLoading)
  const systemMode = Appearance.getColorScheme()

  return (
    <ThemeProvider theme={getTheme({ mode: mode === Mode.system ? systemMode : mode })}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Chọn loại bằng lái' }} />
      </Stack>
    </ThemeProvider>
  )
}
