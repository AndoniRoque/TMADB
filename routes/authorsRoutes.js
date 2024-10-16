const { Router } = require("express");
const authorsRouter = Router();
const { getAuthorById } = require("../controllers/authorController");

authorsRouter


function myMiddleware(req, res, next) {
  req.customProperty = "Hello from myMiddleware";
  next();
}

authorsRouter.use(myMiddleware);
authorsRouter.get("/", (req, res) => res.send("All authors"));
authorsRouter.get("/:authorId", getAuthorById);

module.exports = authorsRouter;