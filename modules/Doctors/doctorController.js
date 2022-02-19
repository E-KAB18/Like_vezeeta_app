const Doctor = require("./doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../Users/userModel");
const Visit = require("../Visits/visitModel");
const asynSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

const getDoctors = async (req, res, next) => {
	try {
		const { speciality, gender, pageNo, skip, limit } = req.query;

		const page = pageNo || 1;
		const limitValue = limit || 2;
		const skipValue = skip || (page - 1) * limit;

		if (speciality || gender) {
			// const { speciality, gender } = req.query;
			const doctors = await Doctor.find({ $or: [{ speciality }, { gender }] })
				.limit(limitValue)
				.skip(skipValue);
			res.send(doctors);
		} else {
			const doctors = await Doctor.find().limit(limitValue).skip(skipValue);
			res.send(doctors);
		}
	} catch (error) {
		next(error);
	}
};

const signUp = async (req, res, next) => {
	const { fullname, mobile, speciality, gender, email, password } = req.body;
	try {
		const doctor = new Doctor({
			fullname,
			mobile,
			speciality,
			gender,
			email,
			password,
		});
		const createdDoctor = await doctor.save();
		res.send(createdDoctor);
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const doctor = await Doctor.findOne({ email });
		if (!doctor) throw new Error("invalid email or password");
		const { password: originalHashedPassword } = doctor;
		const result = await bcrypt.compare(password, originalHashedPassword);
		if (!result) throw new Error("invalid email or password");
		const token = await asynSign(
			{ id: doctor._id.toString() },
			process.env.SECRET_KEY
		);
		res.send({ token });
	} catch (error) {
		next(error);
	}
};

const doctorById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const { fullname, mobile, speciality, gender, email } =
			await Doctor.findById(id);
		// const user = await User.findById(id);
		res.send({ fullname, mobile, speciality, gender, email });
	} catch (error) {
		error.statusCode = 404;
		next(error);
	}
};

const doctorHome = async (req, res, next) => {
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

const editById = async (req, res) => {
	const { fullname, mobile, speciality, gender, email, password } = req.body;
	const { id } = req.params;
	try {
		const updatedDoctor = await Doctor.findByIdAndUpdate(
			id,
			{ fullname, mobile, speciality, gender, email, password },
			{ new: true }
		);

		res.send(updatedDoctor);
	} catch (error) {
		next(error);
	}
};

const deleteById = async (req, res, next) => {
	const { id } = req.params;
	try {
		const doctor = await Doctor.findByIdAndDelete(id);
		res.send(doctor);
	} catch (error) {
		next(error);
	}
};

const bookVisit = async (req, res, next) => {
	const { id: docId } = req.params;
	const { email, appointment } = req.body;
	try {
		let { _id: userId } = await User.findOne({ email });

		userId = userId.toString();
		const visit = new Visit({
			appointment,
			userId,
			docId,
		});
		const createdVisit = await visit.save();
		res.send(createdVisit);
	} catch (error) {
		next(error);
	}
};

const getVisits = async (req, res, next) => {
	const { id: docId } = req.params;
	try {
		const visit = await Visit.find({ docId }).populate("userId", [
			"fullname",
			"mobile",
			"gender",
			"email",
		]);

		res.send(visit);
	} catch (error) {
		next(error);
	}
};

const getVisit = async (req, res, next) => {
	const { id } = req.params;
	try {
		const visit = await Visit.findById(id).populate("userId", [
			"fullname",
			"mobile",
			"gender",
			"email",
		]);

		res.send(visit);
	} catch (error) {
		next(error);
	}
};

const approveVisit = async (req, res, next) => {
	const { id } = req.params;
	const { approved } = req.body;
	try {
		const updatedVisit = await Visit.findByIdAndUpdate(
			id,
			{ approved },
			{ new: true }
		).populate("userId", ["fullname", "mobile", "gender", "email"]);
		res.send(updatedVisit);
	} catch (error) {
		next(error);
	}
};
module.exports = {
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
};
