const mongoose = require("mongoose");
const { doctorSchema } = require("./doctorSchema");

const Doctor = mongoose.model("Doctor", doctorSchema, "doctors");

module.exports = Doctor;
