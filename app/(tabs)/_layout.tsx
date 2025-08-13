import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, View, Text } from 'react-native';

import { Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useTheme } from '@rneui/themed';

export default function TabLayout() {
  const { theme: { colors } } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: colors.secondary },
        tabBarStyle: { backgroundColor: colors.secondary },
        tabBarInactiveTintColor: colors.black,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.black }}>Loại bằng lái</Text>
            </View>
          ),

          headerLeft: () => (
            <Image
              style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 15 }}
              source={require('../../assets/images/logo.png')}
            />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable style={{ marginRight: 15 }}>
                <FontAwesome5 name="clipboard-list" size={20} color={colors.black} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
