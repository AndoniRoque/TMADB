import passport from "passport";
import LocalStrategy from "passport-local";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";

// Configuración de la estrategia local
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Usuario no encontrado." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Contraseña incorrecta" });
      }

      return done(null, user);
    } catch (error) {
      console.error("Error en autenticación:", error);
      return done(error);
    }
  })
);

// Serialización - Qué guardamos en la sesión
passport.serializeUser((user, done) => {
  console.log("Serializando usuario:", user);
  done(null, user.id);
});

// Deserialización - Cómo recuperamos el usuario
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializando usuario:", id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        mail: true,
        role: true,
      },
    });
    done(null, user);
  } catch (error) {
    console.error("Error en deserialización:", error);
    done(error);
  }
});

export const ensureAuthenticated = (req, res, next) => {
  console.log("Verificando autenticación:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    message: "Necesitas iniciar sesión para acceder a este recurso.",
    authenticated: false,
  });
};

export const ensureAdmin = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "No autenticadoooooooooooooooooooooooooooooooooooooo" });
  }

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Requiere rol de administrador" });
  }

  next();
};

export default passport;
