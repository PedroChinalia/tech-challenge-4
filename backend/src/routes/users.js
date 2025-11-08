const express = require("express");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/auth");

module.exports = function (prisma) {
  const router = express.Router();

  // --- POST /users ---
  // Cria um novo usuário (rota pública)
  router.post("/", async (req, res) => {
    try {
      const { name, email, password, isTeacher } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email e password são obrigatórios" });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          isTeacher: Boolean(isTeacher)
        },
        select: {
          userId: true,
          name: true,
          email: true,
          isTeacher: true,
          createdAt: true
        }
      });

      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno" });
    }
  });

  // --- GET /users ---
  // Lista usuários (somente professores autenticados)
  router.get("/", authMiddleware, async (req, res) => {
    try {
      if (!req.user || !req.user.isTeacher) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { isTeacher } = req.query;
      const filter = isTeacher !== undefined ? { where: { isTeacher: isTeacher === "true" } } : {};

      const users = await prisma.user.findMany({
        ...filter,
        select: { userId: true, name: true, email: true, isTeacher: true }
      });

      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });

  // --- GET /users/:id ---
  router.get("/:id", authMiddleware, async (req, res) => {
    try {
      if (!req.user || !req.user.isTeacher) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { userId: Number(id) },
        select: { userId: true, name: true, email: true, isTeacher: true }
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  });

  // --- PUT /users/:id ---
  router.put("/:id", authMiddleware, async (req, res) => {
    try {
      if (!req.user || !req.user.isTeacher) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { id } = req.params;
      const { name, email, password } = req.body;

      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (password) data.password = await bcrypt.hash(password, 10);

      const updated = await prisma.user.update({
        where: { userId: Number(id) },
        data,
        select: { userId: true, name: true, email: true, isTeacher: true }
      });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  });

  // --- DELETE /users/:id ---
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      if (!req.user || !req.user.isTeacher) {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const { id } = req.params;
      await prisma.user.delete({ where: { userId: Number(id) } });

      return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  });

  return router;
};
