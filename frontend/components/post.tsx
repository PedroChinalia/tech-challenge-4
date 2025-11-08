import * as React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export type PostProps = {
  postId: number;
  title: string;
  author: string;
  content: string;
  creationDate: Date;
  isTeacher?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function Post(props: PostProps) {
  const [dialogState, setDialogState] = React.useState(false);

  const showDialog = () => setDialogState(true);
  const hideDialog = () => setDialogState(false);

  const confirmDelete = () => {
    hideDialog();
    props.onDelete?.();
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Text variant="titleMedium" style={styles.title}>
        {props.title}
      </Text>
      <Text variant="labelSmall" style={styles.author}>
        {props.author}
      </Text>

      {/* Conteúdo */}
      <Text variant="bodyMedium" style={styles.content}>
        {props.content}
      </Text>

      {/* Rodapé */}
      <View style={styles.footerRow}>
        <Text variant="labelSmall" style={styles.date}>
          {new Date(props.creationDate).toDateString()}
        </Text>

        <View style={styles.iconRow}>
          <IconButton icon="eye" size={20} onPress={props.onView} />
          {props.isTeacher && (
            <>
              <IconButton icon="pencil" size={20} onPress={props.onEdit} />
              <IconButton icon="delete" size={20} onPress={showDialog} />
            </>
          )}
        </View>
      </View>

      {/* Diálogo de confirmação */}
      <Portal>
        <Dialog visible={dialogState} onDismiss={hideDialog}>
          <Dialog.Title>Aviso</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Deseja mesmo excluir esta publicação? Esta ação não poderá ser desfeita!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={confirmDelete}>Excluir</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: width * 0.04,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: height * 0.01
  },
  title: {
    fontWeight: "bold",
    marginBottom: height * 0.008
  },
  author: {
    color: "#666",
    marginBottom: height * 0.008
  },
  content: {
    marginBottom: height * 0.012
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  date: {
    color: "#888",
    fontSize: width * 0.035
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center"
  }
});
