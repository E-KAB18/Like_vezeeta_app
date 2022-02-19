const express = require("express");
const userRouter = express.Router();
const {
	signUp,
	getUsers,
	userById,
	deleteById,
	editById,
	login,
	userHome,
	getVisits,
	cancelVisit,
} = require("./userController");

const { validateEditReq, passwordHash, upload } = require("./userMiddlewares");

userRouter.get("/", getUsers);
userRouter.get("/home", userHome);
userRouter.get("/:id", userById);
userRouter.post("/signUp", upload.single("image"), passwordHash, signUp);
// userRouter.post("/signUp", passwordHash, signUp);
userRouter.post("/login", login);
userRouter.patch("/:id", validateEditReq, passwordHash, editById);
userRouter.delete("/:id", deleteById);
userRouter.get("/:userId/visits", getVisits);
userRouter.delete("/:userId/visits/:visitId", cancelVisit);

module.exports = userRouter;
