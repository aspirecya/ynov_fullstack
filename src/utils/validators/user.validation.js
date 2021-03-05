const Joi = require('joi');

exports.validate = function (data) {
    const userSchemaValidation = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    });
    return userSchemaValidation.validate(data);
      
}
