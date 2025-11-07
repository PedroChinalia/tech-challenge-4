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
import { Button, Switch, Text, TextInput } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function Register() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isTeacher, setIsTeacher] = React.useState(false);
  const onToggleSwitch = () => setIsTeacher(!isTeacher);

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
              >
                Voltar
              </Button>
              <Button
                mode="contained"
                buttonColor="green"
                onPress={() => console.log("Entrar")}
                style={styles.button}
              >
                Cadastrar
              </Button>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
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
  }
});
