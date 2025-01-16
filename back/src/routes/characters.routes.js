import { Router } from "express";
import { prisma } from "../db.js";
import {
  ensureAdmin,
  ensureAuthenticated,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/characters", ensureAuthenticated, async (req, res) => {
  const { name, description } = req.query;

  try {
    const characters = await prisma.character.findMany({
      where: {
        ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
        ...(description ? { description: description } : {}),
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!characters || characters.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(characters);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error getting characters", details: err.message });
  }
});

router.post(
  "/characters",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const { name, description, episode } = req.body;
    try {
      if (!name)
        res.status(400).json({ message: "Character name is missing." });
      if (!description)
        res.status(400).json({ message: "Character description is missing" });

      const existingCharacter = await prisma.character.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
        },
      });

      if (existingCharacter)
        return res.status(409).json({
          message:
            "A character with this name already exists, please upload a new one.",
        });

      const newCharacter = await prisma.character.create({
        data: {
          name,
          description,
        },
      });

      if (!episode) {
        res.status(200).json(newCharacter);
      } else {
        const association = await addCharacterToEpisode(
          parseInt(episode),
          newCharacter.id
        );
        res.status(200).json(newCharacter);
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error getting characters", details: err.message });
    }
  }
);

router.get("/characters/:id", ensureAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const character = await prisma.character.findFirst({
      where: {
        id: id,
      },
    });

    !character
      ? res.status(400).json({ error: "Character not found." })
      : res.status(200).json(character);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error getting character", details: err.message });
  }
});

router.get(
  "/characters/:id/episodes",
  ensureAuthenticated,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const episodesForCharacters = await prisma.character.findUnique({
        where: {
          id: id,
        },
        include: {
          episodes: {
            include: {
              episode: true,
            },
          },
        },
      });

      if (!episodesForCharacters) {
        return res.status(400).json({ error: "Character not found." });
      }

      const episodes = episodesForCharacters.episodes.map(
        (episode) => episode.episode
      );

      res.status(200).json({
        character: {
          id: episodesForCharacters.id,
          name: episodesForCharacters.name,
        },
        episodes: episodes,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Error getting character episodes",
        details: err.message,
      });
    }
  }
);

router.put(
  "/characters/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const updateCharacter = await prisma.character.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(updateCharacter);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error updating character", details: err.message });
    }
  }
);

router.delete(
  "/characters/:id",
  ensureAuthenticated,
  ensureAdmin,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.send(400).json({ error: "Invalid ID format." });
    }

    try {
      const deleteCharacter = await prisma.character.delete({
        where: {
          id: id,
        },
      });
      res
        .status(200)
        .json({ message: "The character was deleted successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error deleting character", details: err.message });
    }
  }
);

async function addCharacterToEpisode(episodeId, characterId) {
  try {
    const episodeCharacter = await prisma.episodesOnCharacters.create({
      data: {
        episodeId: episodeId,
        characterId: characterId,
      },
      include: {
        episode: true,
        character: true,
      },
    });
    return episodeCharacter;
  } catch (error) {
    console.error("Error adding character to episode:", error);
    throw error;
  }
}

export default router;
