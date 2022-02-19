const Joi = require("joi");

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
			speciality: Joi.string()
				.empty("")
				.valid("dermatology", "dentistry", "chest", "allergy"),
		});

		Joi.attempt(req.body, schema);
		// console.log(result);
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	validateEditReq,
};
