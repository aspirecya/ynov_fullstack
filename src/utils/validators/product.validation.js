const Joi = require('joi');

exports.validate = function (data) {
    const productSchemaValidation = Joi.object({
        // seller:
        // buyers:
        // title:
        // description:
        // price:
        // color:
        // size:
        // categories:
        // image:
        // isActive:
    });
    return productSchemaValidation.validate(data);

}
