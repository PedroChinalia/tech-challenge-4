import { ThemedView } from "@/components/themed-view";
import * as React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function EditPost() {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

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
            onPress={() => console.log("Post salvo!")}
            style={styles.button}
            contentStyle={{ paddingVertical: height * 0.015 }}
          >
            Editar
          </Button>
        </View>
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
