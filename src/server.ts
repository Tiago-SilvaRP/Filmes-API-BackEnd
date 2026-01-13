import express from "express";
import { prisma } from "./lib/prisma/prisma.js";

const port = 3000;
const app = express();

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
  res.json(movies);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
