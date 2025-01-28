import express from "express";
import session from "express-session";
import passport from "./config/passport.config.js";
import episodesRoutes from "./routes/episodes.routes.js";
import charactersRoutes from "./routes/characters.routes.js";
import usersRoutes from "./routes/users.routes.js";
import usersEpisode from "./routes/usersEpisodes.routes.js";
import cors from "cors";
const PORT = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "https://tmadb-andonis-projects.vercel.app/", credentials: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// protected routes
app.use("/auth", usersRoutes);

app.use("/api", usersRoutes);
app.use("/api", episodesRoutes);
app.use("/api", charactersRoutes);
app.use("/api", usersEpisode);

app.listen(PORT, () => {
  console.log("Server on port ", `${PORT}`);
});

// TODO: un endpoint que muestre todos los personajes por cada capitulo?
// TODO: mostrar los episodios en los que aparece cada personaje en la vista del personaje
