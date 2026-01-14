import express from "express";
import { prisma } from "./lib/prisma/prisma.js";

const port = 3000;
const app = express();

app.use(express.json());

app.get("/movies", async (_, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  const languages = await prisma.language.findMany();

  res.json({ movies, languages });
});

app.post("/movies", async (req, res, next) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;
  try {
    await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });

    res.status(201).send("Filme adicionado com sucesso!");
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  console.error("Mensagem de erro:", error.stack);
  res.status(500).send("Falha ao cadastrar filme");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
