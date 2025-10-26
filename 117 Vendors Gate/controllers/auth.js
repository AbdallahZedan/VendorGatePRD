const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var convert = require('xml-js');

const Vendor = require('../model/vendor');
const Config = require('../model/config');
// const { config } = require('process');
const axiosCatch = require('../middleware/axios-catch');
const { validationResult } = require('express-validator');

//-----------------------------------------------postLogin
exports.postLogin = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let vendor;
    const taxRegNo = req.body.TaxRegNo;
    const password = req.body.Password;

    const otp = crypto.randomInt(1000, 9999).toString(); // 4-digit OTP

    Vendor.getPassword(taxRegNo)
        .then(response => {
            // console.log(JSON.stringify(response.data));
            // res.json(response.data);
            vendor = response.data.d.Vendor;
            return bcrypt.compare(password, response.data.d.Password);
        }).then(isEqual => {

            if (!isEqual) {
                const error = new Error('wrong Password');
                error.statusCode = 401; // not authinticated
                throw error;
            }

            return Vendor.postPswOtp({ TaxRegNo: taxRegNo, Otp: otp });

        }).then(otpresponse => {
            // console.log(otpresponse.data);
            let RequestExp = '';
            let data = JSON.parse(convert.xml2json(otpresponse.data, { compact: true, spaces: 4 }));

            if (data.entry.content['m:properties']['d:RequestExp']._text) {
                RequestExp = data.entry.content['m:properties']['d:RequestExp']._text;
            }

            res.status(otpresponse.status).json(
                {
                    message: 'Vendor OTP Sent',
                    RequestExp: RequestExp
                    // data: convert.xml2js(otpresponse.data, { compact: true, spaces: 4 })
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error login');
            next(err);
        });
}

//-----------------------------------------------postSubmitOtp
exports.postSubmitOtp = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    // let vendor;
    const taxRegNo = req.body.TaxRegNo;
    const otp = req.body.Otp;

    Vendor.getPswOtp(taxRegNo)
        .then(response => {

            if (response.data.d.Otp !== otp) {
                const error = new Error('wrong OTP');
                error.statusCode = 401; // not authinticated
                throw error;
            }

            const token = jwt.sign(
                {
                    TaxRegNo: taxRegNo,
                    Vendor: response.data.d.Vendor
                }, Config.jwtSecret, { expiresIn: '1h' });

            res.status(200).json({ token: token });

        }).catch(err => {
            axiosCatch(err, 'Error Submit OTP');
            next(err);
        });
}
//-----------------------------------------------postPswResetReq
exports.postPswResetReq = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let vendorPswReq = {
        TaxRegNo: req.body.TaxRegNo
    };

    crypto.randomBytes(32, (randomBytesErr, buffer) => {
        if (randomBytesErr) {
            randomBytesErr.statusCode = 403;
            throw randomBytesErr;
        }
        vendorPswReq.Token = buffer.toString('hex');

        Vendor.postPswResetReq(vendorPswReq)
            .then(response => {

                let RequestExp = '';
                let data = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));

                if (data.entry.content['m:properties']['d:RequestExp']._text) {
                    RequestExp = data.entry.content['m:properties']['d:RequestExp']._text;
                }

                res.status(response.status).json(
                    {
                        message: 'Vendor Password Reset Request Submitted',
                        RequestExp: RequestExp
                        // data: convert.xml2js(response.data, { compact: true, spaces: 4 })
                    }
                )

            })
            .catch(err => {
                axiosCatch(err, 'Error Vendor Password Reset Request');
                next(err);
            });
    });
}

//-----------------------------------------------postPswReset
exports.postPswReset = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    let vendorPswReset = {
        Token: req.body.Token,
        TaxRegNo: 'XYZ',
        Password: req.body.Password
    };

    bcrypt.hash(vendorPswReset.Password, 12)
        .then(hashedPassword => {
            vendorPswReset.Password = hashedPassword;
            return Vendor.postPswReset(vendorPswReset);
        })
        .then(response => {
            res.status(response.status).json(
                {
                    message: 'Vendor Password Reseted',
                    // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                }
            )

        })
        .catch(err => {
            axiosCatch(err, 'Error Vendor Password Reset');
            next(err);
        });
}