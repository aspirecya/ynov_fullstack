const Joi = require('joi');

exports.validate = function (data) {
    const userSchemaValidation = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        phone: Joi.string().allow('', null),
        address: Joi.string().allow('', null),
    });
    return userSchemaValidation.validate(data);
      
}
