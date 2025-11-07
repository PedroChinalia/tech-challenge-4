import Post, { PostProps } from "@/components/post";
import { ThemedView } from "@/components/themed-view";
import { useRouter } from "expo-router";
import * as React from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Searchbar, Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [posts, setPosts] = React.useState<PostProps[]>([
    {
      postId: 1,
      title: "Título da postagem",
      author: "Professor Fiap",
      content: "Este texto serve para simular uma prévia de postagens no feed principal.",
      creationDate: new Date("04/11/2025")
    },
    {
      postId: 2,
      title: "Outra postagem interessante",
      author: "Prof. Ana",
      content: "Mais um exemplo de post para testar o layout responsivo.",
      creationDate: new Date("05/11/2025")
    }
  ]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.safeArea}>
      {/* Cabeçalho fixo */}
      <Appbar.Header mode="small" style={styles.appBar}>
        <Appbar.Content title="Blog Escolar" titleStyle={styles.appBarTitle} />
        <Appbar.Action icon="logout" onPress={() => router.replace("/login")} />
      </Appbar.Header>

      {/* Conteúdo principal */}
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text variant="titleLarge" style={styles.headerText}>
            Lista de postagens
          </Text>

          {/* Barra de busca */}
          <Searchbar
            placeholder="Procurar postagem por título"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />

          {/* Postagens */}
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => <Post {...item} />}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma postagem encontrada.</Text>}
            contentContainerStyle={{ paddingBottom: height * 0.05 }}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#a8cafe"
  },
  appBar: {
    backgroundColor: "#5c8df6",
    elevation: 4
  },
  appBarTitle: {
    fontWeight: "bold"
  },
  container: {
    flex: 1,
    backgroundColor: "#a8cafe"
  },
  scrollContainer: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05
  },
  headerText: {
    marginBottom: height * 0.02,
    textAlign: "center",
    fontWeight: "bold"
  },
  searchBar: {
    marginBottom: height * 0.02,
    borderRadius: 12
  },
  searchInput: {
    fontSize: width * 0.04
  },
  postsArea: {
    gap: height * 0.015
  },
  emptyText: {
    textAlign: "center",
    marginTop: height * 0.05,
    color: "#555"
  }
});
