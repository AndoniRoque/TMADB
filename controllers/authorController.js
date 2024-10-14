// controllers/authorController.js

const db = require("../db");

async function getAuthorById(req, res) {

  const { authorId } = req.params;
  console.log(req.params);

  const author = await db.getAuthorById(authorId);

  if (!author) {
    res.status(404).send("Author not found");
    return;
  }

  res.send(`Author Name: ${author.name}`);
};

module.exports = { getAuthorById };