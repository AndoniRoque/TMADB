const express = require("express");
const app = express();
//const booksRouter = require("routes/booksRouter");
const authorsRouter = require("./routes/authorsRoutes");
// const indexRouter = require("routes/indexRouter");

//app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
// app.use("/", indexRouter);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`My first express app - listerninig on port ${PORT}`);
})

app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});