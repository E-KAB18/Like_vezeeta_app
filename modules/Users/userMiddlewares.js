const Joi = require("joi");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const validateEditReq = async (req, res, next) => {
	try {
		const schema = Joi.object({
			fullname: Joi.string().empty(""),
			email: Joi.string().email().empty(""),
			password: Joi.string()
				.pattern(
					new RegExp(
						"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
					)
				)
				.empty(""),
			mobile: Joi.string()
				.pattern(new RegExp("^01[0-2,5]{1}[0-9]{8}$"))
				.empty(""),
			gender: Joi.string().empty("").valid("male", "female"),
			admin: Joi.boolean(),
		});

		Joi.attempt(req.body, schema);
		// console.log(result);
		next();
	} catch (error) {
		next(error);
	}
};

const passwordHash = async (req, res, next) => {
	const saltRounds = 10;
	if (req.body.password) {
		req.body.password = await bcrypt.hash(req.body.password, saltRounds);
	}
	next();
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		let extention = path.extname(file.originalname);
		cb(null, Date.now() + extention);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			// To accept the file pass
			cb(null, true);
		} else {
			console.log("only jpg, png & jpeg file supported! ");
			// To reject this file pass
			cb(null, false);
		}
	},
	// 3 MB files allowed
	limits: {
		fileSize: 1024 * 1024 * 3,
	},
});

module.exports = {
	validateEditReq,
	passwordHash,
	upload,
};
