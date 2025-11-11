import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import MainTabs from "./src/navigation/MainTabs";
import {
  Exam,
  ExamHistory,
  ExamResult,
  Home,
  LicenseSelection,
  QuestionList,
  ReviewAnswers,
  Study,
  WebViewScreen,
} from "./src/screens";
import { getSelectedLicense } from "./src/utils/storage";

const Stack = createStackNavigator();

function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    const license = await getSelectedLicense();
    setInitialRoute(license ? "MainTabs" : "LicenseSelection");
  };

  if (!initialRoute) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen
          name="LicenseSelection"
          component={LicenseSelection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Study"
          component={Study}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestionList"
          component={QuestionList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Exam"
          component={Exam}
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent swipe back during exam
          }}
        />
        <Stack.Screen
          name="ExamResult"
          component={ExamResult}
          options={{
            headerShown: false,
            gestureEnabled: false, // Prevent going back to exam
          }}
        />
        <Stack.Screen
          name="ReviewAnswers"
          component={ReviewAnswers}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExamHistory"
          component={ExamHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebViewScreen"
          component={WebViewScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
