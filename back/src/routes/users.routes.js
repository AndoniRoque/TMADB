import { Router } from "express";
import passport from "../config/passport.config.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
};

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

router.get("/login", (req, res) => {
  res.send("users");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({
        message: "An error occurred during login.",
        error: err.message,
      });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid username or password." });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res
          .status(500)
          .json({ message: "Login failed", error: loginErr.message });
      }

      // Establecer la cookie de sesión explícitamente
      res.cookie("connect.sid", req.sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        domain: ".onrender.com",
      });

      console.log("Hola", req.sessionID);

      return res.status(200).json({
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
          mail: user.mail,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

router.get("/logout", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      req.logout((err) => {
        if (err) return reject(err);
        else resolve();
      });
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      message: "An error occurred during logout.",
      error: err.message,
    });
  }
});

router.get("/status", (req, res) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  console.log("Is Authenticated:", req.isAuthenticated());

  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        mail: req.user.mail,
        role: req.user.role,
      },
      sessionID: req.sessionID,
    });
  }
  res.status(401).json({
    authenticated: false,
    sessionID: req.sessionID,
  });
});

router.post("/register", async (req, res) => {
  const { username, mail, password } = req.body;
  console.log(username, mail, password);
  try {
    if (!username || !mail || !password) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const findUser = await prisma.user.findFirst({
      where: {
        username: { equals: username },
      },
    });

    if (findUser)
      return res
        .status(409)
        .json({ message: "A user with that username already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        mail,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error ocurred, the user couldn't be created",
      error: err.message,
    });
  }
});

export default router;
