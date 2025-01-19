import passport from "passport";
import LocalStrategy from "passport-local";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const rows = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      const user = rows;

      if (!user) {
        return done(null, false, { message: "User not found." });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect passowrd" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    const user = rows;

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export const ensureAuthenticated = (req, res, next) => {
  return req.isAuthenticated()
    ? next()
    : res
        .status(401)
        .json({ message: "You need to log in to access this resource." });
};

export const ensureAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "ADMIN") {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "You need to be an admin to access this resource." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error checking user role.", error: error.message });
  }
};

export default passport;
