import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function EditUser() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>
          Editar Usuário X
        </Text>

        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          mode="outlined"
          keyboardType="default"
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
          onPress={() => console.log("Usuário editado!")}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Editar
        </Button>
      </View>
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
