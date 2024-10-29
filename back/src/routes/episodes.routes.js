import {Router} from "express";
import { prisma } from "../db.js";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/episodes', async (req, res) => {
  const episodes = await prisma.episode.findMany();
  res.status(200).json(episodes);
})
router.post('/episodes', ensureAuthenticated, async (req,res) => {
  const newEpisode = await prisma.episode.create({
    data: req.body,
  })
  res.status(200).json(newEpisode);
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
    res.status(500).json({error: 'Error getting episodes', detailes: err.message})
  }
})
router.put('/episodes/:id', ensureAuthenticated, async (req, res) => {
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