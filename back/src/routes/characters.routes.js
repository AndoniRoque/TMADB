import {Router} from "express";
import { prisma } from "../db.js";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/characters', async (req, res) => {
  const { name, description } = req.query;

  try {
    const characters = await prisma.character.findMany({
      where: {
        ...(name ? {name: {contains: name, mode: 'insensitive'}}:{}),
        ...(description ? { description: description} : {})
      },
      orderBy: {
        id: 'asc'
      }
    });

    if (!characters || characters.length === 0) {
      return res.status(200).json({ message: "There are no uploaded characters yet." });
    }

    res.status(200).json(characters);
  } catch(err) {
    res.status(500).json({error: 'Error getting characters', details: err.message})
  }
})
router.post('/characters', async (req,res) => {
  const { name, description, episode } = req.body;

  try {
    if (!name) res.status(400).json({message: "Character name is missing."});
    if (!description) res.status(400).json({message: "Character description is missing"});
    
    const existingCharacter = await prisma.character.findFirst({
      where: {
        name: {equals: name, mode: 'insensitive'},
        description: {equals: description},
      }
    });

    if (existingCharacter) res.status(400).json({message: "A character with this values already exists, please upload a new one."});
    
    const newCharacter = await prisma.character.create({
      data: {
        name,
        description,
        episode: {
          connect: { id: parseInt(episode.connect.id) } 
        },
      },
    });
    res.status(200).json(newCharacter);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Error getting characters', details: err.message});
  }
})

export default router;