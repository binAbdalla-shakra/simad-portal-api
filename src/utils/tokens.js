const jwt = require('jsonwebtoken');
const config = require('../Admin/config');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.accessExpiration });
};

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiration });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};