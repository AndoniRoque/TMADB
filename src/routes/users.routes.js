import {Router} from "express";
import passport from "../config/passport.config.js";

const router = Router();

router.get('/login', (req, res) => {
  res.send("users");
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/episodes',
  failureRedirect: '/login',
  failureFlash: false
}));

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;