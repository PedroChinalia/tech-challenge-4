const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth")(prisma));
app.use("/users", usersRoute(prisma));
app.use("/posts", postsRoute(prisma));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
