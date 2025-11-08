import * as React from "react";
import { Dimensions, StyleSheet, View, ActivityIndicator } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../services/api"; // ajuste o caminho conforme sua estrutura

const { width, height } = Dimensions.get("window");

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(true);

  // --- Snackbar ---
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState<"green" | "red">("green");

  const showSnackbar = (message: string, color: "green" | "red" = "green") => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };

  // 🔹 Carrega dados do usuário ao montar
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          showSnackbar("Você precisa estar autenticado.", "red");
          router.replace("/login");
          return;
        }

        const response = await api.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;
        setName(user.name || "");
        setEmail(user.email || "");
      } catch (error: any) {
        console.error("Erro ao buscar usuário:", error);
        if (error.response?.status === 403) {
          showSnackbar("Apenas professores podem visualizar usuários.", "red");
        } else if (error.response?.status === 404) {
          showSnackbar("Usuário não encontrado.", "red");
        } else {
          showSnackbar("Erro ao carregar usuário.", "red");
        }
        setTimeout(() => router.back(), 2000);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  // 🔹 Editar usuário
  const handleEditUser = async () => {
    if (!name && !email && !password) {
      showSnackbar("Preencha pelo menos um campo para editar.", "red");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showSnackbar("Você precisa estar autenticado.", "red");
        return;
      }

      await api.put(
        `/users/${id}`,
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showSnackbar("Usuário atualizado com sucesso!", "green");

      // redireciona automaticamente após sucesso
      setTimeout(() => {
        router.push("/manageUsers");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao editar usuário:", error);
      if (error.response?.status === 403) {
        showSnackbar("Apenas professores podem editar usuários.", "red");
      } else if (error.response?.status === 404) {
        showSnackbar("Usuário não encontrado.", "red");
      } else {
        showSnackbar("Erro ao atualizar usuário.", "red");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>
          Editar Usuário {id}
        </Text>

        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Nova Senha (opcional)"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          buttonColor="green"
          onPress={handleEditUser}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          loading={loading}
          disabled={loading}
        >
          Editar
        </Button>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarColor
        }}
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
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: height * 0.03,
    color: "#333"
  },
  input: {
    marginBottom: height * 0.02,
    fontSize: width * 0.04
  },
  button: {
    borderRadius: 6,
    marginTop: height * 0.015
  },
  buttonContent: {
    paddingVertical: height * 0.015
  },
  buttonLabel: {
    fontSize: width * 0.045
  }
});
