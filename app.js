const express = require("express");
const app = express();

/**
 * GET /odin/messages will have this log
 * { username: 'odin' }
 *
 * GET /theodinproject79687378/messages would instead log
 * { username: 'theodinproject79687378' }
 */
app.get("/:username/messages", (req, res) => {
  console.log(req.params);
  res.send(`hola, ${req.params.username}`);
});

/**
 * GET /odin/messages/79687378 will have this log
 * { username: "odin", messageId: "79687378" }
 */
app.get("/:username/messages/:messageId", (req, res) => {
  console.log(req.params);
  res.send(`${req.params.username} : ${req.params.messageId}`);
});

const PORT = 3333;

app.listen(PORT, () => console.log(`my first express app, listening on port ${PORT}`))