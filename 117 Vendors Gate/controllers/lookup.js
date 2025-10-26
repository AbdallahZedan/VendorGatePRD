// const crypto = require('crypto');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// var convert = require('xml-js');

const Lookup = require('../model/lookup');
const Config = require('../model/config');
// const { config } = require('process');
const axiosCatch = require('../middleware/axios-catch');
const { validationResult } = require('express-validator');

//-----------------------------------------------getCountry
exports.getCountry = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    Lookup.getCountry(req.query.Language)
        .then(response => {
            // if (response?.data?.d?.__metadata) {
            //     delete response.data.d.__metadata;
            // }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Country');
            next(err);
        });

    // console.log('Country');
    // res.status(200).json(
    //     {
    //         ...req.body
    //     }
    // );
}

//-----------------------------------------------getRegion
exports.getRegion = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    Lookup.getRegion(req.query)
        .then(response => {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Region');
            next(err);
        });
}

//-----------------------------------------------getLanguage
exports.getLanguage = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    Lookup.getLanguage(req.query.Language)
        .then(response => {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Languag');
            next(err);
        });
}
//-----------------------------------------------getReqDep
exports.getReqDep = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }


    Lookup.getReqDep(req.query.Language)
        .then(response => {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Languag');
            next(err);
        });
}