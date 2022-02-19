const express = require("express");
const userRouter = require("./modules/Users/usersRouter");
const doctorRouter = require("./modules/Doctors/doctorRouter");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use("/users", userRouter);
app.use("/doctors", doctorRouter);
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/vzeeta", (err) => {
	if (err) process.exit(1);
	console.log("connected to database successfully");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

app.use((err, req, res, next) => {
	res.send({
		status: err.statusCode,
		message: err.message,
		errors: err.errors || [],
	});
});
