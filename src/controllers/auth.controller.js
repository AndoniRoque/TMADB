import passport from 'passport';
import LocalStrategy from 'passport-local';
import { prisma } from "../db.js";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const rows = await prisma.user.findUnique({
        where: {
          username: username,
        },
      })
      
      const user = rows;

      if(!user) {
        console.log("entré a !user, no debería.")
        return done(null, false, {message: "User not found."});
      }

      //const match = await bcrypt.compare(password, user.password);

      // if(!match) {
      //   done(null, false, {message: "Incorrect passowrd"});
      // } 

      if(user.password !== password) {
        console.log("unmatching passwords");
        return done(null, false, {message: "Incorrect password."});
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await prisma.user.findUnique({
      where: {
        id: id,
      }
    })
    const user = rows;

    done(null, user);
  } catch (error) {
    done(error);
  }
})

export const ensureAuthenticated = (req, res, next) => {
  return req.isAuthenticated() ? next() : res.status(401).json({message: "You need to log in to access this resource."});
};

export default passport;