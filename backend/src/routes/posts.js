const express = require("express");
const authMiddleware = require("../middleware/auth");

module.exports = (prisma) => {
  const router = express.Router();

  // GET /posts — lista todas as postagens (público)
  router.get("/", async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        include: { author: { select: { name: true } } },
        orderBy: { creationDate: "desc" }
      });

      const formatted = posts.map((p) => ({
        postId: p.postId,
        title: p.title,
        author: p.author.name,
        content: p.content,
        creationDate: p.creationDate
      }));

      res.json(formatted);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
      res.status(500).json({ error: "Erro ao buscar postagens" });
    }
  });

  // GET /posts/:id — busca uma postagem pelo ID (público)
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const post = await prisma.post.findUnique({
        where: { postId: Number(id) },
        include: { author: { select: { name: true } } }
      });

      if (!post) return res.status(404).json({ error: "Postagem não encontrada" });

      res.json({
        postId: post.postId,
        title: post.title,
        author: post.author.name,
        content: post.content,
        creationDate: post.creationDate
      });
    } catch (error) {
      console.error("Erro ao buscar postagem:", error);
      res.status(500).json({ error: "Erro ao buscar postagem" });
    }
  });

  // A partir daqui, tudo exige autenticação
  router.use(authMiddleware);

  // POST /posts — criar nova postagem (somente professores)
  router.post("/", async (req, res) => {
    const { user } = req;
    const { title, content } = req.body;

    if (!user.isTeacher) {
      return res.status(403).json({ error: "Apenas professores podem criar postagens." });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Título e conteúdo são obrigatórios." });
    }

    try {
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          authorId: user.userId
        },
        include: { author: { select: { name: true } } }
      });

      res.status(201).json({
        postId: newPost.postId,
        title: newPost.title,
        author: newPost.author.name,
        content: newPost.content,
        creationDate: newPost.creationDate
      });
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
      res.status(500).json({ error: "Erro ao criar postagem" });
    }
  });

  // PUT /posts/:id — editar postagem (somente professores)
  router.put("/:id", async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { title, content } = req.body;

    if (!user.isTeacher) {
      return res.status(403).json({ error: "Apenas professores podem editar postagens." });
    }

    try {
      const existingPost = await prisma.post.findUnique({ where: { postId: Number(id) } });
      if (!existingPost) return res.status(404).json({ error: "Postagem não encontrada" });

      const updated = await prisma.post.update({
        where: { postId: Number(id) },
        data: { title, content },
        include: { author: { select: { name: true } } }
      });

      res.json({
        postId: updated.postId,
        title: updated.title,
        author: updated.author.name,
        content: updated.content,
        creationDate: updated.creationDate
      });
    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
      res.status(500).json({ error: "Erro ao atualizar postagem" });
    }
  });

  // DELETE /posts/:id — deletar postagem (somente professores)
  router.delete("/:id", async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    if (!user.isTeacher) {
      return res.status(403).json({ error: "Apenas professores podem excluir postagens." });
    }

    try {
      const existingPost = await prisma.post.findUnique({ where: { postId: Number(id) } });
      if (!existingPost) return res.status(404).json({ error: "Postagem não encontrada" });

      await prisma.post.delete({ where: { postId: Number(id) } });

      res.json({ message: "Postagem excluída com sucesso." });
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      res.status(500).json({ error: "Erro ao excluir postagem" });
    }
  });

  return router;
};
