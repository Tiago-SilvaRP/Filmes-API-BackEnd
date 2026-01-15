import express from "express";
import { prisma } from "./lib/prisma/prisma.js";
import { Prisma } from "@prisma/client";

const port = 3000;
const app = express();

app.use(express.json());

app.get("/movies", async (_, res) => {
  const movies = await prisma.movie.findMany({
    where: {
      title: {
        equals: "avatar",
        mode: "insensitive",
      },
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
        title_key: title.toLowerCase().trim(),
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });

    res.status(201).send("Filme adicionado com sucesso!");
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        message: "Já existe um filme cadastrado com esse título",
      });
    }
  }
});

app.use((error, req, res, next) => {
  console.error("Mensagem de erro:", error.stack);
  res.status(500).send("Falha ao cadastrar filme");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
