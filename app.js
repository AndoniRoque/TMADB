const { Pool } = require('pg');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
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

app.get("/", (req, res) => res.render("index"));
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



app.listen(PORT, () =>  console.log(`Express app listening on port ${PORT}`));