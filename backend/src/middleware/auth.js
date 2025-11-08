const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // salva os dados do usuário decodificados no req.user
    return next();
  } catch (err) {
    console.error("Erro na verificação do token:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
};
