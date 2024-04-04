const mongoose = require('mongoose');
const Joi = require("joi");

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    assignee: String,
    assigner: String,
    details: String,
    priority: String
})

module.exports = mongoose.model("Task",taskSchema)