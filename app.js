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
