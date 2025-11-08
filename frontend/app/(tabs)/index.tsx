import Post, { PostProps } from "@/components/post";
import { ThemedView } from "@/components/themed-view";
import { useRouter, useFocusEffect } from "expo-router";
import * as React from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View, Platform } from "react-native";
import { Appbar, Searchbar, Text, Snackbar, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const getApiUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:4000";
  return "http://localhost:4000";
};

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [posts, setPosts] = React.useState<PostProps[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isTeacher, setIsTeacher] = React.useState(false);

  const API_URL = getApiUrl();

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts`);

      if (!response.ok) throw new Error("Erro ao carregar postagens");

      const data = await response.json();

      const formatted = data.map((p: any) => ({
        ...p,
        creationDate: new Date(p.creationDate)
      }));

      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setIsTeacher(user.isTeacher === true);
      }

      setPosts(formatted);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
      showSnackbar("Não foi possível carregar as postagens.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showSnackbar("Você precisa estar logado para excluir postagens.");
        return;
      }

      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.postId !== postId));
        showSnackbar("Postagem excluída com sucesso!");
      } else {
        const err = await res.json();
        showSnackbar(err.error || "Erro ao excluir postagem.");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Erro ao excluir postagem.");
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      showSnackbar("Logout realizado com sucesso!");
      setTimeout(() => router.replace("/login"), 800);
    } catch {
      showSnackbar("Erro ao fazer logout. Tente novamente.");
    }
  };

  const handleView = (postId: number) => {
    router.push(`/seePost?postId=${postId}`);
  };

  const handleEdit = (postId: number) => {
    router.push(`/editPost?postId=${postId}`);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.safeArea}>
      {/* Cabeçalho */}
      <Appbar.Header mode="small" style={styles.appBar}>
        <Appbar.Content title="Blog Escolar" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {/* Conteúdo */}
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text variant="titleLarge" style={styles.headerText}>
            Lista de postagens
          </Text>

          <Searchbar
            placeholder="Procurar postagem por título"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />

          {loading ? (
            <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={filteredPosts}
              keyExtractor={(item) => item.postId.toString()}
              renderItem={({ item }) => (
                <Post
                  {...item}
                  isTeacher={isTeacher}
                  onView={() => handleView(item.postId)}
                  onEdit={() => handleEdit(item.postId)}
                  onDelete={() => handleDelete(item.postId)}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma postagem encontrada.</Text>
              }
              contentContainerStyle={{ paddingBottom: height * 0.05 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </ScrollView>
      </ThemedView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#a8cafe" },
  appBar: { backgroundColor: "#5c8df6", elevation: 4 },
  appBarTitle: { fontWeight: "bold" },
  container: { flex: 1, backgroundColor: "#a8cafe" },
  scrollContainer: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05
  },
  headerText: {
    marginBottom: height * 0.02,
    textAlign: "center",
    fontWeight: "bold"
  },
  searchBar: {
    marginBottom: height * 0.02,
    borderRadius: 12
  },
  searchInput: {
    fontSize: width * 0.04
  },
  emptyText: {
    textAlign: "center",
    marginTop: height * 0.05,
    color: "#555"
  }
});
