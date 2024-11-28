import { Router } from "express";
import passport from "../config/passport.config.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.get("/login", (req, res) => {
  res.send("users");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "An error ocurred during login.", error: err });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ message: "Login failed", error: loginErr });
      }
      return res.status(200).json({ message: "Login successful.", user });
    });
  })(req, res, next);
});

router.get("/logout", async (req, res) => {
  try {
    // Usa el método logout correctamente con await
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res
      .status(500)
      .json({ message: "An error occurred during logout.", error: err });
  }
});

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ authenticated: true, user: req.user });
  }
  res.status(401).json({ authenticated: false });
});

router.post("/register", async (req, res) => {
  const { username, mail, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await prisma.user.findFirst({
      where: {
        username: { equals: username },
      },
    });

    if (findUser)
      return res
        .status(409)
        .json({ message: "A user with that username already exists." });

    const newUser = await prisma.user.create({
      data: {
        username,
        mail,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error ocurred, the user couldn't be created" });
  }
});

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

export default router;
