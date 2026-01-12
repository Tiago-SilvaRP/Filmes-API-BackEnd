import express from "express";
const port = 3000;
const app = express();

app.get("/movies", (req, res) => {
  res.send("Listagem de filmes");
});

app.use((error, req, res, next) => {
  console.error(`Erro apresentado: ${new Date()}, ${error.stack}\n\n`);
  res.status(500).send("Algo deu errado");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
