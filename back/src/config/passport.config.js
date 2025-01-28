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
        return done(null, false, { message: "Invalid username or password." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Wrong password." });
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
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    console.error("Error en deserialización:", error);
    done(error);
  }
});

export default passport;
