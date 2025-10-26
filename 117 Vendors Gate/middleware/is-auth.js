const jwt = require('jsonwebtoken');
const Config = require('../model/config');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not Authinticated.');
        error.statusCode = 401; // not authinticated
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        // you can use decode insted of verify but verify will decode and verify
        decodedToken = jwt.verify(token, Config.jwtSecret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authinticated.');
        error.statusCode = 401; // not authinticated
        throw error;
    }
    req.TaxRegNo = decodedToken.TaxRegNo;
    // console.log(decodedToken);
    req.Vendor = decodedToken.Vendor;
    next();
}