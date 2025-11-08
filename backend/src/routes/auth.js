const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = function (prisma) {
  const router = express.Router();

  // POST /auth/login
  // body: { email, password }
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "email e password são obrigatórios" });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const payload = {
        userId: user.userId,
        email: user.email,
        isTeacher: user.isTeacher
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
      });

      return res.json({
        token,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
          isTeacher: user.isTeacher
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno" });
    }
  });

  return router;
};
