const { Router } = require("express");
const { getAuthorById } = require("../controllers/authorController");
const authorsRouter = Router();


function myMiddleware(req, res, next) {
  req.customProperty = "Hello from myMiddleware";
  next();
}

authorsRouter.use(myMiddleware);
authorsRouter.get("/", (req, res) => res.send("All authors"));
authorsRouter.get("/:authorId", getAuthorById);

module.exports = authorsRouter;