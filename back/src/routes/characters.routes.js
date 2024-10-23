import {Router} from "express";
import { ensureAuthenticated } from "../controllers/auth.controller.js";

const router = Router();

router.get('/characters', ensureAuthenticated, (req, res) => {
  res.send('characters')
})

export default router;