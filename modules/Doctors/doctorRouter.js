const express = require("express");
const doctorRouter = express.Router();
const {
	getDoctors,
	signUp,
	login,
	doctorById,
	doctorHome,
	editById,
	deleteById,
	bookVisit,
	getVisits,
	getVisit,
	approveVisit,
} = require("./doctorController");

const { passwordHash } = require("../Users/userMiddlewares");
const { validateEditReq } = require("./doctorMiddleware");

doctorRouter.get("/", getDoctors);
doctorRouter.post("/signUp", passwordHash, signUp);
doctorRouter.post("/login", login);
doctorRouter.get("/home", doctorHome);
doctorRouter.get("/:id", doctorById);
doctorRouter.patch("/:id", validateEditReq, passwordHash, editById);
doctorRouter.delete("/:id", deleteById);
doctorRouter.post("/:id/visits", bookVisit);
doctorRouter.get("/:id/visits", getVisits);
doctorRouter.get("/visits/:id", getVisit);
doctorRouter.patch("/visits/:id", approveVisit);

module.exports = doctorRouter;

// {"fullname": "esraa lala",
// "mobile": "01520698597",
// "speciality": "dentistry",
// "gender": "female",
// "email": "lala2@gmail.com",
// "password": "LalA2@12"}
