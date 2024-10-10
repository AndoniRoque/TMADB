const express = require("express");
const app = express();

app.get("/messages", (req, res) => {
  res.send("This route will not be reached because the previous route's path matches first.");
});

app.get("*", (req, res) => {
  res.send("* is a great way to catch all otherwise unmatched paths, e.g. for custom 404 error handling.");
});

const PORT = 3333;

app.listen(PORT, () => console.log(`my first express app, listening on port ${PORT}`))