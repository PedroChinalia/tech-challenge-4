import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
import { Icon } from "react-native-paper";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icon size={28} source="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          title: "Nova Postagem",
          tabBarIcon: ({ color }) => <Icon size={28} source="forum-plus" color={color} />
        }}
      />
      <Tabs.Screen
        name="manageUsers"
        options={{
          title: "Gerenciar Usuários",
          tabBarIcon: ({ color }) => <Icon size={28} source="account-cog" color={color} />
        }}
      />
    </Tabs>
  );
}
