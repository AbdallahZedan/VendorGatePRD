const { validationResult } = require('express-validator');
const bankGuaranteeModel = require('../model/bankGuarantee');
const Config = require('../model/config');
const axiosCatch = require('../middleware/axios-catch');
const helper = require('./helper');
var convert = require('xml-js');
const { response } = require('express');

exports.getList = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const acceptLanguage = req.headers['accept-language'] || 'en';
    let taxRegNo = req?.query?.TaxRegNo || req?.body?.TaxRegNo;
    let vendor = req?.query?.Vendor || req?.body?.Vendor;
    bankGuaranteeModel.getList(taxRegNo, vendor, acceptLanguage).then(response => {

        const responseData = response?.data?.d?.results || response?.data?.d || response?.data;
        if (!responseData) {
            return res.status(response.status).json([]);
        }
        const cleanData = helper.cleanODataPayload(responseData);

        res.status(response.status).json(cleanData);

    }).catch(err => {
        axiosCatch(err, 'An error occurred while retrieving the guarantee list.');
        next(err);
    });

}

exports.getDetails = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const acceptLanguage = req.headers['accept-language'] || 'en';

    let guaranteeData = {
        GuaranteeNo: req?.query?.GuaranteeNo || req?.body?.GuaranteeNo,
        Version: req.query.Version || req?.body?.Version,
        Banks: req.query.Banks || req?.body?.Banks,
        Bankl: req.query.Bankl || req?.body?.Bankl
    }

    bankGuaranteeModel.getDetails(guaranteeData, acceptLanguage).then(response => {

        const responseData = response?.data?.d || response?.data;
        if (!responseData) {
            return res.status(response.status).json({ message: "No data returned" });
        }
        const cleanData = helper.cleanODataPayload(responseData);

        res.status(response.status).json({
            ...cleanData
        });
    }).catch(err => {
        axiosCatch(err, `An error occurred while retrieving the guarantee no: ${guaranteeData.GuaranteeNo}`);
        next(err);
    });
}

exports.createGuarantee = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const acceptLanguage = req.headers['accept-language'] || 'en';
    const { Begda, Endda, GuaranteeType, ...otherFields } = req.body;

    const oDataBegda = helper.convertToEdmDateTime(Begda);
    const oDataEndda = helper.convertToEdmDateTime(Endda);
    const guaranteeType = 'CRTD';

    let guaranteeData = { "Begda": oDataBegda, "Endda": oDataEndda, "GuaranteeType": guaranteeType, ...otherFields };

    bankGuaranteeModel.sendGuarantee(guaranteeData, acceptLanguage).then(response => {
        // const jsonResponse = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));
        res.status(response.status).json(
            {
                message: 'Bank Guarantee Creation Request has been saved',
                // ...jsonResponse
            }
        )
    }).catch(err => {
        axiosCatch(err, 'An error occurred while creating bank guarantee request');
        next(err);
    });
}

exports.extendGuarantee = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const acceptLanguage = req.headers['accept-language'] || 'en';
    const { Begda, Endda, GuaranteeType, ...otherFields } = req.body;

    const oDataBegda = helper.convertToEdmDateTime(Begda);
    const oDataEndda = helper.convertToEdmDateTime(Endda);
    const guaranteeType = 'EXTD';

    let guaranteeData = { "Begda": oDataBegda, "Endda": oDataEndda, "GuaranteeType": guaranteeType, ...otherFields };

    bankGuaranteeModel.sendGuarantee(guaranteeData, acceptLanguage).then(response => {
        // const jsonResponse = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));
        res.status(response.status).json(
            {
                message: 'Bank Guarantee Extension Request has been saved',
                // ...jsonResponse
            }
        )
    }).catch(err => {
        axiosCatch(err, 'An error occurred while saving bank guarantee extension request');
        next(err);
    });
}

exports.releaseGuarantee = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const acceptLanguage = req.headers['accept-language'] || 'en';
    const { GuaranteeType, ...otherFields } = req.body;
    const guaranteeType = 'RELS';

    let guaranteeData = { "GuaranteeType": guaranteeType, ...otherFields };

    bankGuaranteeModel.sendGuarantee(guaranteeData, acceptLanguage).then(response => {
        // const jsonResponse = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));
        res.status(response.status).json(
            {
                message: 'Bank Guarantee Release Request has been saved',
                // ...jsonResponse
            }
        )
    }).catch(err => {
        axiosCatch(err, 'An error occurred while saving bank guarantee release request');
        next(err);
    });

}
