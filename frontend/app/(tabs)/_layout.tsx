import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, useRouter, usePathname } from "expo-router";
import React from "react";
import { Icon } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

  const [isTeacher, setIsTeacher] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (!token || !userData) {
          router.replace("/login");
          return;
        }

        const user = JSON.parse(userData);
        setIsTeacher(user.isTeacher);

        if (!user.isTeacher && pathname.includes("manageUsers")) {
          router.replace("/");
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  if (loading) return null;

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
          tabBarIcon: ({ color }) => <Icon size={28} source="forum-plus" color={color} />,
          href: isTeacher ? "/addPost" : null,
          tabBarItemStyle: isTeacher ? null : { display: "none" }
        }}
      />

      <Tabs.Screen
        name="manageUsers"
        options={{
          title: "Gerenciar Usuários",
          tabBarIcon: ({ color }) => <Icon size={28} source="account-cog" color={color} />,
          href: isTeacher ? "/manageUsers" : null,
          tabBarItemStyle: isTeacher ? null : { display: "none" }
        }}
      />
    </Tabs>
  );
}
