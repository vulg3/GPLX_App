import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { AdBanner } from "../components/AdBanner";
import { TouchableScreenWrapper } from "../components/TouchableScreenWrapper";
import { useTheme } from "../contexts/ThemeContext";
import CarTab from "../screens/CarTab";
import MotorbikeTab from "../screens/MotorbikeTab";
import Settings from "../screens/Settings";
import AdMobService from "../services/AdMobService";
import { responsive, rv } from "../utils/responsive";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { isDarkMode, colors } = useTheme();

  // Initialize AdMob when component mounts
  useEffect(() => {
    AdMobService.initialize();
  }, []);

  // Custom tab bar with AdBanner above it
  const CustomTabBar = (props: any) => {
    return (
      <View>
        {/* Banner Ad above the bottom tab */}
        <AdBanner />
        {/* Custom tab bar */}
        <View
          style={{
            height: Platform.OS === "ios" ? rv(88, 100) : rv(70, 80),
            paddingBottom: Platform.OS === "ios" ? rv(20, 24) : rv(18, 20),
            paddingTop: rv(8, 12),
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {props.state.routes.map((route: any, index: number) => {
            const { options } = props.descriptors[route.key];
            const label = options.tabBarLabel ?? route.name;
            const isFocused = props.state.index === index;

            const onPress = () => {
              const event = props.navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                props.navigation.navigate(route.name);
              }
            };

            let iconName: keyof typeof Ionicons.glyphMap = "home";
            if (route.name === "MotorbikeTab") {
              iconName = "bicycle";
            } else if (route.name === "CarTab") {
              iconName = isFocused ? "car-sport" : "car-sport-outline";
            } else if (route.name === "Settings") {
              iconName = isFocused ? "settings" : "settings-outline";
            }

            return (
              <View
                key={route.key}
                onTouchEnd={onPress}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={iconName}
                  size={24}
                  color={
                    isFocused ? colors.primary : isDarkMode ? "#8e8e93" : "#999"
                  }
                />
                <Text
                  style={{
                    fontSize: responsive.fontSize.xs,
                    fontWeight: "600",
                    color: isFocused
                      ? colors.primary
                      : isDarkMode
                      ? "#8e8e93"
                      : "#999",
                    marginTop: 4,
                  }}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <TouchableScreenWrapper>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
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
    </TouchableScreenWrapper>
  );
}
