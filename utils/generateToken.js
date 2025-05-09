const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ email: user.email, role: user.role }, process.env.jwtsecret, { expiresIn: "7d" });

}
module.exports.generateToken = generateToken;