import express from "express";
import session from "express-session";
import passport from "./config/passport.config.js";
import episodesRoutes from "./routes/episodes.routes.js";
import charactersRoutes from "./routes/characters.routes.js";
import usersRoutes from "./routes/users.routes.js";
import usersEpisode from "./routes/usersEpisodes.routes.js";
import cors from "cors";
const PORT = process.env.PORT || 3333;
const allowedOrigins = [
  "https://tmadb-andonis-projects.vercel.app",
  "https://tmadb.onrender.com",
];

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en producción
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como mobile apps o curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

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
