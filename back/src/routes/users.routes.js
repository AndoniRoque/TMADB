import {Router} from "express";
import passport from "../config/passport.config.js";

const router = Router();

router.get('/login', (req, res) => {
  res.send("users");
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({message: "An error ocurred during login."});
    }
    if(!user) {
      return res.status(401).json({message: "Invalid username or password."});
    }
    req.login(user, (loginErr) => {
      if(loginErr) {
        return res.status(500).json({message: "Login failed"});
      }
      return res.status(200).json({message: "Login successful.", user});
    });
  })(req, res, next);
});

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;