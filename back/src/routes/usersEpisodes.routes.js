import { Router } from "express";
import passport from "../config/passport.config.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.post("/episodesByUser", async (req, res, next) => {
  console.log(req.body);

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const findUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    console.log(findUser);
    const userId = findUser.id;

    const episodesHeard = await prisma.userEpisodes.findMany({
      where: {
        userId: userId,
        heard: true,
      },
      include: {
        episode: true,
      },
    });

    if (!episodesHeard.length) {
      return res
        .status(404)
        .json({ message: "No episodes heard by this user" });
    }
    res.status(200).json({
      user: findUser.username,
      episodesHeard: episodesHeard.map((episodes) => episodes.episode),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/episodesHeard", async (req, res, next) => {
  console.log(req.body);
  const { userId: username, episodeId } = req.body;

  if (!username || !episodeId) {
    return res.status(400).json({ error: "userId and episodeId are required" });
  }

  try {
    // Buscar al usuario por username
    const findUser = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = findUser.id;
    let userEpisode;

    // Buscar el registro existente en UserEpisodes
    const existingUserEpisode = await prisma.userEpisodes.findUnique({
      where: {
        userId_episodeId: { userId: userId, episodeId: episodeId },
      },
    });

    if (existingUserEpisode) {
      // Si existe, alternar el valor de heard
      userEpisode = await prisma.userEpisodes.update({
        where: {
          userId_episodeId: { userId: userId, episodeId: episodeId },
        },
        data: {
          heard: !existingUserEpisode.heard,
        },
      });
    } else {
      // Si no existe, crear un nuevo registro con heard: true
      userEpisode = await prisma.userEpisodes.create({
        data: {
          userId: userId,
          episodeId: episodeId,
          heard: true,
        },
      });
    }

    res.status(200).json({
      message: "Episode heard status toggled successfully",
      userEpisode,
    });
  } catch (error) {
    console.error("Error toggling episode heard status: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
