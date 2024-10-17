const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PORT = process.env.PORT || 3333;

const pool = new Pool({
  host: "localhost",
  user: "mesa20",
  database: "top_users",
  password: "mesa20",
  port: 5432,
})

const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + '/views') ;

app.use(session({secret: "cats", resave: false, saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
  res.render("index", { user: req.user});
})
app.get('/sign-up', (req, res) => res.render("createUser"));
app.post("/sign-up", async (req, res, next) => {
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      req.body.username,
      req.body.password,
    ]);
    res.redirect("/");
  } catch(err) {
    return next(err);
  }
});
app.post("/log-in", passport.authenticate("local", { 
  successRedirect: "/",
  failureRedirect: "/"
}));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if(err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      console.log(rows);
      const user = rows[0];

      if(!user) {
        console.log("Incorrect username");
        return done(null, false, {message: "Incorrect username"});
      }
      if(user.password !== password) {
        console.log("Incorrect password");
        return done(null, false, {message: "Incorrect password"});
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.listen(PORT, () =>  console.log(`Express app listening on port ${PORT}`));
