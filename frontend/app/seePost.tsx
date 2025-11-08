import * as React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, StyleSheet, View, Platform } from "react-native";
import { ActivityIndicator, Text, Button, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const getApiUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:4000";
  return "http://localhost:4000";
};

export default function SeePost() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const API_URL = getApiUrl();

  const [post, setPost] = React.useState<{
    title: string;
    author: string;
    content: string;
    creationDate: string;
  } | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const fetchPost = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        await AsyncStorage.multiRemove(["token", "user"]);
        router.replace("/login");
        return;
      }

      if (!response.ok) throw new Error("Erro ao buscar a postagem.");

      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error(err);
      showSnackbar("Não foi possível carregar a postagem.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text variant="bodyLarge">Postagem não encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>
        Visualizar postagem
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Título: <Text style={styles.value}>{post.title}</Text>
        </Text>

        <Text style={styles.label}>
          Autor: <Text style={styles.value}>{post.author}</Text>
        </Text>

        <Text style={styles.label}>
          Conteúdo: <Text style={styles.value}>{post.content}</Text>
        </Text>

        <Text style={styles.label}>
          Data de criação:{" "}
          <Text style={styles.value}>
            {new Date(post.creationDate).toLocaleDateString("pt-BR")}
          </Text>
        </Text>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8cafe",
    padding: width * 0.05,
    alignItems: "center"
  },
  header: {
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#333",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: height * 0.03
  },
  label: {
    fontSize: width * 0.04,
    color: "#444",
    marginBottom: height * 0.015,
    fontWeight: "600"
  },
  value: {
    fontWeight: "400",
    color: "#000"
  },
  backButton: {
    backgroundColor: "#5c8df6",
    borderRadius: 8,
    paddingHorizontal: width * 0.1
  }
});
