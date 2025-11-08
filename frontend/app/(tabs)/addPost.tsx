import { ThemedView } from "@/components/themed-view";
import * as React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import api from "@/services/api";

const { width, height } = Dimensions.get("window");

export default function AddPost() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState<string>("green");

  const showSnackbar = (msg: string, color = "green") => {
    setSnackbarMessage(msg);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  const handleSavePost = async () => {
    if (!title || !content) {
      showSnackbar("Preencha título e conteúdo antes de salvar.", "red");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showSnackbar("Você precisa estar autenticado.", "red");
        return;
      }

      await api.post(
        "/posts",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSnackbar("Postagem criada com sucesso!");

      setTimeout(() => {
        router.replace("/");
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao criar postagem:", error);
      if (error.response?.status === 403) {
        showSnackbar("Apenas professores podem criar postagens.", "red");
      } else {
        showSnackbar("Erro ao salvar postagem. Tente novamente.", "red");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setTitle("");
      setContent("");
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text variant="titleLarge" style={styles.title}>
            Criar nova postagem
          </Text>

          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            keyboardType="default"
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
            onPress={handleSavePost}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: height * 0.015 }}
          >
            Salvar
          </Button>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: snackbarColor }}
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
