import {Router} from "express";
import { prisma } from "../db.js";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/episodes', async (req, res) => {
  const episodes = await prisma.episode.findMany();
  res.json(episodes);
})
router.post('/episodes', ensureAuthenticated, async (req,res) => {
  const newEpisode = await prisma.episode.create({
    data: req.body,
  })
  res.json(newEpisode);
})

export default router;