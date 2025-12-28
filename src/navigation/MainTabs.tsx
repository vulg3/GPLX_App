import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Platform, Text, TouchableWithoutFeedback, View } from "react-native";
import { AdBanner } from "../components/AdBanner";
import { useTheme } from "../contexts/ThemeContext";
import CarTab from "../screens/CarTab";
import MotorbikeTab from "../screens/MotorbikeTab";
import Settings from "../screens/Settings";
import AdMobService from "../services/AdMobService";
import { responsive, rv } from "../utils/responsive";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { isDarkMode, colors } = useTheme();
  const touchCountRef = useRef(0);
  const targetTouchCountRef = useRef(
    Math.floor(Math.random() * 51) + 100 // Random between 100-150
  );

  // Initialize AdMob when component mounts
  useEffect(() => {
    AdMobService.initialize();
  }, []);

  const handleTouch = () => {
    touchCountRef.current += 1;

    if (touchCountRef.current >= targetTouchCountRef.current) {
      // Show interstitial ad
      AdMobService.showInterstitialAd(() => {
        // Reset counter and set new random target
        touchCountRef.current = 0;
        targetTouchCountRef.current = Math.floor(Math.random() * 51) + 100;
        console.log(
          `Next ad will show after ${targetTouchCountRef.current} touches`
        );
      });
    }
  };

  // Custom tab bar with AdBanner above it
  const CustomTabBar = (props: any) => {
    return (
      <View>
        {/* Banner Ad above the bottom tab */}
        <AdBanner />
        {/* Custom tab bar */}
        <View
          style={{
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
              <TouchableWithoutFeedback
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <View
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
                      isFocused
                        ? colors.primary
                        : isDarkMode
                        ? "#8e8e93"
                        : "#999"
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
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={{ flex: 1 }}>
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
      </View>
    </TouchableWithoutFeedback>
  );
}
