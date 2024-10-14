// controllers/authorController.js
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const db = require("../db");

const getAuthorById = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  console.log(req.params);

  const author = await db.getAuthorById(authorId);

  if (!author) {
    throw new CustomNotFoundError("Author not found");
  }

  res.send(`Author Name: ${author.name}`);
});

module.exports = { getAuthorById };
