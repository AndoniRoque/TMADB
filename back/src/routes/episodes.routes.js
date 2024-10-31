import {Router} from "express";
import { prisma } from "../db.js";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/episodes', async (req, res) => {
  const {title, number, caseNumber } = req.query;

  try {
    const episodes = await prisma.episode.findMany({
      where: {
        ...(title ? {title: {contains: title, mode: 'insensitive'}}:{}),
        ...(number ? { number: parseInt(number)} : {}),
        ...(caseNumber ? { caseNumber } : {})
      },
      orderBy: {
        number: 'asc'
      }
    });

    if (!episodes || episodes.length === 0) {
      return res.status(200).json({ message: "There are no uploaded episodes yet." });
    }

    res.status(200).json(episodes);
  } catch(err) {
    res.status(500).json({error: 'Error getting episodes', details: err.message})
  }
})
router.post('/episodes', async (req,res) => {
  const {title, number, releaseDate, description, caseNumber } = req.body;

  try {
    if (!title) res.status(400).json({message: "Title is missing"});
    if (!number) res.status(400).json({message: "Episode number is missing"});
    if (!releaseDate) res.status(400).json({message: "Release date is missing."});
    if (!description) res.status(400).json({message: "The episode description is missing."});
    if (!caseNumber) res.status(400).json({message: "Case number is missing."});
    const existingEpisode = await prisma.episode.findFirst({
      where: {
        title: {equals: title, mode: 'insensitive'},
        number: {equals: number},
        releaseDate: {equals: releaseDate},
        description: {equals: description},
        caseNumber: {equals: caseNumber}
      }
    });

    if (existingEpisode) res.status(400).json({message: "An episode with this values already exists, please upload a new one."});
    
    const newEpisode = await prisma.episode.create({
      data: {title, number, releaseDate, description, caseNumber},
    })
    res.status(200).json(newEpisode);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Error getting episodes', details: err.message});
  }
})
router.get('/episodes/:id', async(req,res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const episode = await prisma.episode.findFirst({
      where: {id}
    })

    !episode ? res.status(400).json({error: 'Episode not found.'}) : res.status(200).json(episode);
  } catch (err) {
    res.status(500).json({error: 'Error getting episodes', details: err.message})
  }
})
router.put('/episodes/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const updateEpisode = await prisma.episode.update({
      where: {id},
      data: req.body,
    })
    res.json(updateEpisode);
  } catch (err) {
    console.log(req.body);
    res.status(500).json({ error: "Error updating episode", details: err.message});
  }
})

export default router;