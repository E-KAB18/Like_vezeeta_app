const mongoose = require("mongoose");
const { Schema } = mongoose;

const doctorSchema = new Schema({
	fullname: {
		type: String,
		required: true,
	},
	mobile: {
		type: String,
		required: true,
		match: [/^01[0-2,5]{1}[0-9]{8}$/, "Please fill a valid mobile number"],
	},
	speciality: {
		type: String,
		enum: ["dermatology", "dentistry", "chest", "allergy"],
	},
	gender: {
		type: String,
		enum: ["male", "female"],
		required: true,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: "Email address is required",
		match: [
			/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
			"Please fill a valid email address",
		],
	},

	password: {
		type: String,
		required: true,
		match: [
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
			"password must be of Minimum eight characters, contain at least 1 lowercase, 1 uppercase, one number and one special characher",
		],
	},
	image: {
		type: String,
	},
});

module.exports = { doctorSchema };
