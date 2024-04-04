const Task = require("../models/tasks");
const Joi = require("joi");

exports.validate_new_task = (res,req,next) => {
    const schema = Joi.object({
        assignee: Joi.string().min(3).required(),
        assigner: Joi.string().min(3).required(),
        details: Joi.string().required(),
        priority: Joi.string().required()
    })
    const result = schema.validate(req.body);

    const errors = [];
    if(result.error){
        result.error.details.forEach(item => {
            errors.push(item.message);
        })

        res.status(400).send(errors);
    }
    else{
        next();
    }
}