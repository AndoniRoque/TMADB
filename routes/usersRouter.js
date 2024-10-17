const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.getUsernames);
usersRouter.get("/create", usersController.createUsernameGet);
usersRouter.post("/create", usersController.createUsernamePost);
// usersRouter.get("/:id/update", usersController.usersUpdateGet);
// usersRouter.post("/:id/update", usersController.usersUpdatePost);
// usersRouter.post("/:id/delete", usersController.usersDeletePost);

module.exports = usersRouter;


// router -> define the routes of the web app and what method to use from the controller
// controller -> define the logic on that method, what to do with the info. 
// view -> show the info. 