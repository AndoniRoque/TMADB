import { Router } from "express";
import passport from "../config/passport.config.js";

const router = Router();

router.get('/login', (req, res) => {
  res.send("users");
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "An error ocurred during login.", error: err });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: "Login failed", error: loginErr });
      }
      return res.status(200).json({ message: "Login successful.", user });
    });
  })(req, res, next);
});


router.get("/logout", async (req, res, next) => {
  try {
    await req.logout();
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "An error ocurred during logout", error: err })
  }
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  }
  res.status(401).json({ authenticated: false })
})

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

export default router;