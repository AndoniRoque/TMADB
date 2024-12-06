import { PrismaClient } from "@prisma/client";
import { ensureAuthenticated } from "../controllers/auth.controller.js";
import { Router } from "express";

const prisma = new PrismaClient();

const router = Router();

// export default async function handler(req, res) {
router.get("/graph/episodes", ensureAuthenticated, async (req, res) => {
  try {
    const episodes = await prisma.episode.findMany({
      include: {
        characters: {
          include: {
            character: true,
          },
        },
      },
    });

    // Transformar datos para React Flow
    const nodes = episodes.map((episode) => ({
      id: `episode-${episode.id}`,
      type: "default",
      data: { label: `${episode.title}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }));

    const edges = episodes.flatMap((episode) =>
      episode.characters.map((rel) => ({
        id: `edge-${episode.id}-${rel.characterId}`,
        source: `episode-${episode.id}`,
        target: `character-${rel.characterId}`,
      }))
    );

    const characters = await prisma.character.findMany();
    const characterNodes = characters.map((character) => ({
      id: `character-${character.id}`,
      type: "default",
      data: { label: `${character.name}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }));

    res.status(200).json({ nodes: [...nodes, ...characterNodes], edges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching graph data" });
  }
});
export default router;
