// app/(tabs)/_layout.jsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: {
        backgroundColor: COLORS.cardBackground,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 5,
        paddingBottom: insets.bottom,
        height: 60 + insets.bottom,
      },
    }}>
      <Tabs.Screen 
        name="index"        // app/(tabs)/index.jsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="create"       // app/(tabs)/create.jsx
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="add-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="profile"      // app/(tabs)/profile.jsx
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
