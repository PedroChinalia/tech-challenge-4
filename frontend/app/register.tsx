import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { Button, Switch, Text, TextInput, Snackbar } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isTeacher, setIsTeacher] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState("#e53935");

  const onToggleSwitch = () => setIsTeacher(!isTeacher);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setSnackbarMessage("Preencha todos os campos obrigatórios!");
      setSnackbarColor("#e53935");
      setSnackbarVisible(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          isTeacher
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSnackbarMessage(data.error || "Erro ao cadastrar usuário");
        setSnackbarColor("#e53935");
        setSnackbarVisible(true);
        return;
      }

      // sucesso
      setSnackbarMessage("Usuário cadastrado com sucesso!");
      setSnackbarColor("#43a047");
      setSnackbarVisible(true);

      // Redirecionar após pequeno delay
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Erro de conexão com o servidor");
      setSnackbarColor("#e53935");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
              Cadastro
            </Text>

            <TextInput
              label="Nome"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
              keyboardType="default"
            />

            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
            />

            <View style={styles.flexBox}>
              <Text variant="labelMedium">Sou Professor</Text>
              <Switch style={styles.switch} value={isTeacher} onValueChange={onToggleSwitch} />
            </View>

            <View style={styles.buttons}>
              <Button
                mode="outlined"
                textColor="black"
                onPress={() => router.push("/login")}
                style={styles.button}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                mode="contained"
                buttonColor="green"
                onPress={handleRegister}
                style={styles.button}
                loading={loading}
              >
                Cadastrar
              </Button>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[styles.snackbar, { backgroundColor: snackbarColor }]}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: width * 0.08
  },
  container: {
    backgroundColor: "#a8cafe",
    borderRadius: 12,
    padding: width * 0.06,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  title: {
    textAlign: "center",
    marginBottom: height * 0.04,
    fontWeight: "bold"
  },
  input: {
    marginBottom: height * 0.02,
    backgroundColor: "#fff"
  },
  buttons: {
    marginTop: height * 0.02
  },
  button: {
    marginBottom: height * 0.015
  },
  flexBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  switch: {
    marginLeft: 8
  },
  snackbar: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8
  },
  snackbarText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500"
  }
});
