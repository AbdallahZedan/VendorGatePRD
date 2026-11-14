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

// Bank Guarantee Lookup
// get bank lookup
exports.getBank = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const banks = req?.query?.Banks || req?.body?.Banks;
    const bankl = req?.query?.Bankl || req?.body?.Bankl;
    const banka = req?.query?.Banka || req?.body?.Banka;
    const acceptLanguage = req.headers['accept-language'] || 'en';
    let safeBanka;
    if (banka && helper.isPureArabic(banka))
        safeBanka = encodeURIComponent(banka) || banka;
    else safeBanka = banka;

    Lookup.getBank(banks, bankl, safeBanka, acceptLanguage)
        .then(response => {
            const responseData = response?.data?.d?.results || response?.data?.d || response?.data;
            if (!responseData) {
                return res.status(response.status).json([]);
            }
            const cleanData = helper.cleanODataPayload(responseData);

            res.status(response.status).json(cleanData);

        })
        .catch(err => {
            axiosCatch(err, 'Error Get Bank');
            next(err);
        });
}

exports.getGuaranteeCategory = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const category = req?.query?.Category || req?.body?.Category;
    const acceptLanguage = req.headers['accept-language'] || 'en';

    Lookup.getGuaranteeCategory(category, acceptLanguage)
        .then(response => {
            const responseData = response?.data?.d?.results || response?.data?.d || response?.data;
            if (!responseData) {
                return res.status(response.status).json([]);
            }
            const cleanData = helper.cleanODataPayload(responseData);

            res.status(response.status).json(cleanData);
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Guarantee Category');
            next(err);
        });

}