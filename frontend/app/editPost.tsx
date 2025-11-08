import { ThemedView } from "@/components/themed-view";
import * as React from "react";
import { Dimensions, ScrollView, StyleSheet, View, Platform } from "react-native";
import { Button, Text, TextInput, Snackbar, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const getApiUrl = () => {
  if (Platform.OS === "android") return "http://10.0.2.2:4000";
  return "http://localhost:4000";
};

export default function EditPost() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const API_URL = getApiUrl();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  // Busca os dados do post atual
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

      if (!response.ok) throw new Error("Erro ao carregar postagem.");

      const data = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error(error);
      showSnackbar("Não foi possível carregar a postagem.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPost();
  }, [postId]);

  // Atualiza o post (PUT)
  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      showSnackbar("Preencha todos os campos antes de salvar.");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      if (response.status === 401) {
        await AsyncStorage.multiRemove(["token", "user"]);
        router.replace("/login");
        return;
      }

      if (!response.ok) throw new Error("Erro ao atualizar postagem.");

      showSnackbar("Postagem atualizada com sucesso!");
      setTimeout(() => router.replace("/"), 1200);
    } catch (error) {
      console.error(error);
      showSnackbar("Erro ao atualizar postagem.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text variant="titleLarge" style={styles.title}>
            Editar postagem
          </Text>

          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Conteúdo"
            value={content}
            onChangeText={setContent}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={[styles.input, styles.textArea]}
          />

          <Button
            mode="contained"
            buttonColor="green"
            onPress={handleUpdate}
            loading={saving}
            disabled={saving}
            style={styles.button}
            contentStyle={{ paddingVertical: height * 0.015 }}
          >
            {saving ? "Salvando..." : "Editar"}
          </Button>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8cafe",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center"
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: width * 0.05,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    maxWidth: 600,
    alignSelf: "center",
    width: "100%"
  },
  title: {
    marginBottom: height * 0.03,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333"
  },
  input: {
    marginBottom: height * 0.02
  },
  textArea: {
    height: height * 0.2
  },
  button: {
    marginTop: height * 0.02,
    borderRadius: 8
  }
});
