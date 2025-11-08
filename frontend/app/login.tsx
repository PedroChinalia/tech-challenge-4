import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showSnackbar("Por favor, preencha e-mail e senha.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      router.replace("/");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 401) {
        showSnackbar("E-mail ou senha inválidos.");
      } else {
        showSnackbar("Erro ao conectar ao servidor. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>
          Login
        </Text>

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          buttonColor="green"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        >
          Entrar
        </Button>

        <Button mode="text" onPress={() => router.push("/register")} disabled={loading}>
          Criar nova conta
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
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
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05
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
    marginBottom: height * 0.03
  },
  input: {
    marginBottom: height * 0.02
  },
  button: {
    marginTop: height * 0.02
  }
});
