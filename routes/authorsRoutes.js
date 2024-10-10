const {Router} = require("express");

const authorsRouter = Router();

authorsRouter.get("/", (req, res) => res.send("All authors"));
authorsRouter.get("/:authorId", (req,res) => {
  const { authorId } = req.params;
  res.send({
    "Author ID": `${authorId}}`,
    "Book": "cadaver exquisito",
    "Author": "Agustina Algo"
  });
});

module.exports = authorsRouter;