const express = require("express");
const app = express();
const path = require("node:path");
//const booksRouter = require("routes/booksRouter");
const authorsRouter = require("./routes/authorsRoutes");
// const indexRouter = require("routes/indexRouter");

// app.js
const links = [
  { href: "/", text: "Home" },
  { href: "about", text: "About" },
];

app.set("views", path.join(__dirname, "views"));
console.log(__dirname);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { links: links }); // Pass links to index view
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/authors", authorsRouter);
//app.use("/books", booksRouter);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`My first express app - listerninig on port ${PORT}`);
})

app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});