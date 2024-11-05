import { Router } from "express";
import { prisma } from "../db.js";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/episodes', async (req, res) => {
  const { title, number, caseNumber } = req.query;

  try {
    const episodes = await prisma.episode.findMany({
      where: {
        ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
        ...(number ? { number: parseInt(number) } : {}),
        ...(caseNumber ? { caseNumber } : {})
      },
      orderBy: {
        number: 'asc'
      },
      include: {
        characters: true,
      }
    });

    if (!episodes || episodes.length === 0) {
      return res.status(200).json({ message: "There are no uploaded episodes yet." });
    }

    res.status(200).json(episodes);
  } catch (err) {
    res.status(500).json({ error: 'Error getting episodes', details: err.message })
  }
})
router.post('/episodes', async (req, res) => {
  const { title, number, releaseDate, description, caseNumber, season, heard, characterIds } = req.body;
  console.log(req.body);
  console.log(characterIds);

  try {
    if (!title) return res.status(400).json({ message: "Title is missing" });
    if (!number) return res.status(400).json({ message: "Episode number is missing" });
    if (!releaseDate) return res.status(400).json({ message: "Release date is missing." });
    if (!description) return res.status(400).json({ message: "The episode description is missing." });
    if (!caseNumber) return res.status(400).json({ message: "Case number is missing." });

    const existingEpisode = await prisma.episode.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' },
        number: { equals: number },
        releaseDate: { equals: releaseDate },
        description: { equals: description },
        caseNumber: { equals: caseNumber }
      }
    });

    if (existingEpisode) return res.status(400).json({ message: "An episode with this values already exists, please upload a new one." });

    const newEpisode = await prisma.episode.create({
      data: {
        title,
        number,
        releaseDate,
        description,
        caseNumber,
        season,
        heard,
        characters: {
          connect: characterIds ? characterIds.map(id => ({ id })) : []
        }
      },
      include: { characters: true }
    });
    res.status(200).json(newEpisode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting episodes', details: err.message });
  }
})
router.get('/episodes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const episode = await prisma.episode.findFirst({
      where: { id },
      include: {
        characters: true,
      }
    })

    !episode ? res.status(400).json({ error: 'Episode not found.' }) : res.status(200).json(episode);
  } catch (err) {
    res.status(500).json({ error: 'Error getting episodes', details: err.message })
  }
})
router.put('/episodes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  const {
    title,
    number,
    releaseDate,
    description,
    heard,
    caseNumber,
    season,
    characterIds, // Extrae `characterIds` del cuerpo de la solicitud
  } = req.body;

  try {
    const updateEpisode = await prisma.episode.update({
      where: { id },
      data: {
        title,
        number,
        releaseDate,
        description,
        heard,
        caseNumber,
        season,
        characters: {
          connect: characterIds.map((characterId) => ({ id: characterId })), // Conecta los IDs de personajes
        },
      },
    });

    res.status(200).json(updateEpisode);
  } catch (err) {
    console.log(req.body);
    res.status(500).json({ error: "Error updating episode", details: err.message });
  }
});

router.delete('/episodes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) { return res.send(400).json({ error: "Invalid ID format." }) }

  try {
    const deleteEpisode = await prisma.episode.delete({
      where: {
        id: id
      }
    })
    res.status(200).json({ message: "The episode was deleted successfully" });
  } catch (err) {
    console.log(req.body);
    res.status(500).json({ error: "Error deleting episode", details: err.message });
  }
})

export default router;

// TODO: agregar validaciones para cuando llegan campos que nada que ver. Ejemplo: season: 1 y llega "aoijda"