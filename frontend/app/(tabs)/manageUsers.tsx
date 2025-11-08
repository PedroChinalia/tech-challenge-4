import { useRouter } from "expo-router";
import * as React from "react";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import {
  Button,
  DataTable,
  Dialog,
  IconButton,
  Portal,
  SegmentedButtons,
  Snackbar,
  Text
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";

type User = {
  userId: number;
  name: string;
  email: string;
  isTeacher: boolean;
};

export default function ManageUsers() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [segment, setSegment] = React.useState("teacher");
  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);
  const [dialogState, setDialogState] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => setSnackbarVisible(false);

  const showDialog = (user: User) => {
    setSelectedUser(user);
    setDialogState(true);
  };

  const hideDialog = () => setDialogState(false);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, users.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  // --- Buscar usuários (somente professores autenticados) ---
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const response = await api.get(`/users?isTeacher=${segment === "teacher"}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err.message);
        showSnackbar("Erro ao buscar usuários.");
      }
    };

    fetchUsers();
  }, [segment]);

  // --- Excluir usuário ---
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await api.delete(`/users/${selectedUser.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        setUsers(users.filter((u) => u.userId !== selectedUser.userId));
        showSnackbar("Usuário excluído com sucesso.");
      } else {
        showSnackbar("Erro ao excluir usuário.");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Erro de conexão.");
    } finally {
      hideDialog();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingHorizontal: width * 0.05, paddingVertical: height * 0.02 }
      ]}
    >
      <View
        style={[
          styles.container,
          { padding: width < 400 ? 10 : 20, borderRadius: width < 400 ? 8 : 12 }
        ]}
      >
        <Text variant="titleLarge" style={styles.title}>
          Gerenciar Usuários
        </Text>

        <SegmentedButtons
          value={segment}
          onValueChange={setSegment}
          buttons={[
            { value: "teacher", label: "Professores" },
            { value: "student", label: "Alunos" }
          ]}
          style={styles.segmentedButtons}
        />

        <Button
          mode="contained"
          buttonColor="green"
          style={[styles.addButton, { width: width < 400 ? "100%" : "50%" }]}
          onPress={() => router.push("/register")}
        >
          Adicionar usuário
        </Button>

        <View style={[styles.tableContainer, { width: width < 400 ? "100%" : "90%" }]}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Id</DataTable.Title>
              <DataTable.Title>Nome</DataTable.Title>
              <DataTable.Title>Opções</DataTable.Title>
            </DataTable.Header>

            {users.slice(from, to).map((user) => (
              <DataTable.Row key={user.userId}>
                <DataTable.Cell>{user.userId}</DataTable.Cell>
                <DataTable.Cell>{user.name}</DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.iconRow}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => router.push(`/editUser?id=${user.userId}`)}
                    />
                    <IconButton icon="delete" size={20} onPress={() => showDialog(user)} />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(users.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} de ${users.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={(value) => onItemsPerPageChange(value)}
              showFastPaginationControls
              selectPageDropdownLabel={"Linhas por página"}
            />
          </DataTable>

          <Portal>
            <Dialog visible={dialogState} onDismiss={hideDialog}>
              <Dialog.Title>Aviso</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium">
                  Deseja mesmo excluir este usuário? Esta ação não poderá ser desfeita!
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>Cancelar</Button>
                <Button onPress={handleDelete}>Excluir</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>

          <Snackbar visible={snackbarVisible} onDismiss={hideSnackbar} duration={3000}>
            {snackbarMessage}
          </Snackbar>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#a8cafe",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 600,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold"
  },
  segmentedButtons: {
    marginBottom: 16
  },
  addButton: {
    alignSelf: "center",
    marginBottom: 16
  },
  tableContainer: {
    alignSelf: "center"
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end"
  }
});
