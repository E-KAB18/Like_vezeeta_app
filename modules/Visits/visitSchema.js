const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitSchema = new Schema({
	approved: {
		type: Boolean,
		default: false,
	},
	appointment: Date,

	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},

	docId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Doctor",
	},
});

module.exports = {
	visitSchema,
};
