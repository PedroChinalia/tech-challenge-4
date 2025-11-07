import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function SeePost() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.header}>
        Postagem X
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Título: <Text style={styles.value}>Exemplo de título</Text>
        </Text>

        <Text style={styles.label}>
          Autor: <Text style={styles.value}>Prof. Pedro</Text>
        </Text>

        <Text style={styles.label}>
          Conteúdo: <Text style={styles.value}>Exemplo de conteúdo</Text>
        </Text>

        <Text style={styles.label}>
          Data de criação: <Text style={styles.value}>04/11/2025</Text>
        </Text>
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
    elevation: 4
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
  }
});
