import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  const { name, email, password, isTeacher } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, isTeacher }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userId: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { userId: parseInt(id) },
      data: dataToUpdate
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await prisma.user.delete({ where: { userId: parseInt(id) } });
    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};
