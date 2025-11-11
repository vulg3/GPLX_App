import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import CarTab from "../screens/CarTab";
import MotorbikeTab from "../screens/MotorbikeTab";
import Settings from "../screens/Settings";
import { responsive, rv } from "../utils/responsive";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { isDarkMode, colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "MotorbikeTab") {
            iconName = "bicycle";
          } else if (route.name === "CarTab") {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode ? "#8e8e93" : "#999",
        tabBarStyle: {
          height: Platform.OS === "ios" ? rv(88, 100) : rv(60, 70),
          paddingBottom: Platform.OS === "ios" ? rv(20, 24) : rv(8, 12),
          paddingTop: rv(8, 12),
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: responsive.fontSize.xs,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="MotorbikeTab"
        component={MotorbikeTab}
        options={{
          tabBarLabel: "Xe máy",
        }}
      />
      <Tab.Screen
        name="CarTab"
        component={CarTab}
        options={{
          tabBarLabel: "Ô tô",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Cài đặt",
        }}
      />
    </Tab.Navigator>
  );
}
