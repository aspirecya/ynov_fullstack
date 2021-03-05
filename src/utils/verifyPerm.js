const jwtConfig = require('../configs/jwt.config');
const jwt = require('jsonwebtoken');


function verifyAuth(req, res, next) {
    let token = req.headers['x-access-token'];

    if(!token) {
        return res.status(400).send({
            auth: false,
            message: "The request has not been applied because the authentication token is missing."
        })
    }

    jwt.verify(token, jwtConfig.secret, function(err, decoded) {
        if(err || !decoded.admin) {
            console.log("[AUTH] " + err);
            return res.status(401).send({
                auth: false,
                message: "The request has not been applied because it lacks valid permissions for the target resource."
            })
        }
        next();
    });
}

module.exports = verifyAuth;