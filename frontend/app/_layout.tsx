import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, usePathname, Stack } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const neutralTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#000",
      secondary: "transparent",
      surface: "transparent",
      background: "transparent",
      onSurface: "#000"
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const user = await AsyncStorage.getItem("user");

        const isAuthenticated = token && user;
        const isPublicRoute = ["/login"].includes(pathname);
        const isSpecialRoute = ["/register"].includes(pathname);

        if (!isAuthenticated && !isPublicRoute && !isSpecialRoute) {
          router.replace("/login");
          return;
        }

        if (isAuthenticated && isPublicRoute && !isSpecialRoute) {
          router.replace("/");
          return;
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [pathname]);

  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#a8cafe"
        }}
      >
        <ActivityIndicator size="large" color="#5c8df6" />
      </View>
    );
  }

  return (
    <PaperProvider theme={neutralTheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="seePost" options={{ title: "Visualizar postagem" }} />
          <Stack.Screen name="editPost" options={{ title: "Editar postagem" }} />
          <Stack.Screen name="editUser" options={{ title: "Editar usuário" }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
