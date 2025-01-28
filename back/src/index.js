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
  "tmadb.vercel.app",
  "https://tmadb-andonis-projects.vercel.app",
  "https://tmadb.onrender.com",
];
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: function (origin, callback) {
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
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true en producción
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/api", usersRoutes);
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "No autenticado" });
};
app.use("/api", usersRoutes);
app.use("/api", isAuthenticated, episodesRoutes);
app.use("/api", isAuthenticated, charactersRoutes);
app.use("/api", usersEpisode);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Algo salió mal!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Error interno del servidor",
  });
});

app.listen(PORT, () => {
  console.log("Server on port ", `${PORT}`);
});
