const mongoose = require("mongoose");
const { visitSchema } = require("./visitSchema");

const Visit = mongoose.model("Visit", visitSchema, "visits");

module.exports = Visit;
