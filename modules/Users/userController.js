const User = require("./userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const util = require("util");
const Visit = require("../Visits/visitModel");

const asynSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

const secretKey = "lala";
const signUp = async (req, res, next) => {
	const { fullname, mobile, birthdate, gender, email, password, admin } =
		req.body;

	try {
		const user = new User({
			fullname,
			mobile,
			birthdate,
			gender,
			email,
			password,
			admin,
		});
		// adding the img if uploaded
		if (req.file) {
			user.image = req.file.path;
		}
		const createdUser = await user.save();
		res.send(createdUser);
	} catch (error) {
		error.statusCode = 500;
		next(error);
	}
};

const getUsers = async (req, res, next) => {
	try {
		const users = await User.find();
		res.send(users);
	} catch (error) {
		next(error);
	}
};

const userById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { fullname, mobile, birthdate, gender, email } = await User.findById(
			id
		);
		// const user = await User.findById(id);
		res.send({ fullname, mobile, birthdate, gender, email });
	} catch (error) {
		error.statusCode = 404;
		next(error);
	}
};

const deleteById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const user = await User.findByIdAndDelete(id);
		res.send(user);
	} catch (error) {
		next(error);
	}
};

const editById = async (req, res) => {
	const { fullname, mobile, birthdate, gender, email, password, admin } =
		req.body;
	const { id } = req.params;
	try {
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ fullname, mobile, birthdate, gender, email, password, admin },
			{ new: true }
		);

		res.send(updatedUser);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) throw new Error("invalid email or password");
		const { password: originalHashedPassword } = user;
		const result = await bcrypt.compare(password, originalHashedPassword);
		if (!result) throw new Error("invalid email or password");
		const token = await asynSign(
			{ id: user._id.toString() },
			process.env.SECRET_KEY
		);
		res.send({ token });
	} catch (error) {
		next(error);
	}
};

const userHome = async (req, res, next) => {
	const { authorization } = req.headers;
	try {
		const payload = await asyncVerify(authorization, process.env.SECRET_KEY);
		res.send(payload.id);
	} catch (error) {
		error.message = "unauthorized";
		error.statusCode = 403;
		next(error);
	}
};

const getVisits = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const visit = await Visit.find({ userId }).populate("docId", [
			"fullnfullnameame",
			"mobile",
			"speciality",
			"gender",
			"email",
		]);

		res.send(visit);
	} catch (error) {
		next(error);
	}
};

const cancelVisit = async (req, res, next) => {
	const { visitId } = req.params;
	try {
		const deletedVisit = await Visit.findByIdAndDelete(visitId);
		res.send(deletedVisit);
	} catch (error) {
		next(error);
	}
};
module.exports = {
	signUp,
	getUsers,
	userById,
	deleteById,
	editById,
	login,
	userHome,
	getVisits,
	cancelVisit,
};
