/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {
  type Response,
  type Request,
  type NextFunction,
} from "express";
import { prisma } from "./lib/prisma/prisma.js";
import { Prisma } from "@prisma/client";
import { z, ZodError } from "zod";

const port = 3000;
const app = express();

app.use(express.json());

app.get("/movies", async (_, res) => {
  const movies = await prisma.movie.findMany({
    select: {
      title: true,
      languages: {
        select: { name: true },
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

    next(error);
  }
});

app.put("/movies/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie)
      return res.status(404).send({ message: "Filme não encontrado" });

    const movieSchema = z.object({
      title: z.string().optional(),
      release_date: z.coerce.date().optional(),
      language_id: z.coerce.number().optional(),
      genre_id: z.coerce.number().optional(),
      oscar_count: z.coerce.number().optional(),
    });

    const parsed = movieSchema.parse(req.body);

    const data: Parameters<typeof prisma.movie.update>[0]["data"] = {
      ...(parsed.title && {
        title: parsed.title,
        title_key: parsed.title.toLowerCase().trim(),
      }),
      ...(parsed.release_date && { release_date: parsed.release_date }),
      ...(parsed.language_id !== undefined && {
        language_id: parsed.language_id,
      }),
      ...(parsed.genre_id !== undefined && { genre_id: parsed.genre_id }),
      ...(parsed.oscar_count !== undefined && {
        oscar_count: parsed.oscar_count,
      }),
    };

    await prisma.movie.update({
      where: { id },
      data,
    });

    res.status(200).send("Atualização feita com sucesso!");
  } catch (error) {
    console.error("Falha ao atualizar filme!");
    next(error);
  }
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Erro de validação!", issues: error.issues });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res
      .status(400)
      .json({ message: "Erro de banco de dados!", code: error.code });
  }
  console.error("Mensagem de erro:", error);
  res.status(500).send("Erro interno do servidor");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
