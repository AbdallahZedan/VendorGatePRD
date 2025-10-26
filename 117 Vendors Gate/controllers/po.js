const crypto = require('crypto');
var convert = require('xml-js');
const { validationResult } = require('express-validator');

const Po = require('../model/po');
// const Vendor = require('../model/vendor');
const Config = require('../model/config');
const axiosCatch = require('../middleware/axios-catch');


//-----------------------------------------------getPos
exports.getPos = (req, res, next) => {
    Po.getpos(req.Vendor)
        .then(response => {
            if (response?.data?.d?.__metadata) {
                delete response.data.d.__metadata;
            }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get Vendor POs');
            next(err);
        });
}
//-----------------------------------------------getPo
exports.getPo = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let poData = {
        Vendor: req.Vendor,
        Ebeln: req.body.Ebeln
    }

    if (req?.query?.Ebeln) {
        poData.Ebeln = req.query.Ebeln;
    }

    Po.getpo(poData)
        .then(response => {
            if (response?.data?.d?.__metadata) {
                delete response.data.d.__metadata;
            }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get PO Data');
            next(err);
        });
}
//-----------------------------------------------getPoLines
exports.getPoLines = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }    

    let poLinesData = {
        Vendor: req.Vendor,
        Ebeln: req.body.Ebeln
    }

    if (req?.query?.Ebeln) {
        poLinesData.Ebeln = req.query.Ebeln;
    }

    Po.getPoLines(poLinesData)
        .then(response => {
            if (response?.data?.d?.__metadata) {
                delete response.data.d.__metadata;
            }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get PO Data');
            next(err);
        });
}
//-----------------------------------------------getPoSrv
exports.getPoSrv = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let poSrvData = {
        Vendor: req.Vendor,
        Ebeln: req.body.Ebeln,
        Ebelp: req.body.Ebelp
    }

    if (req?.query?.Ebeln) {
        poSrvData.Ebeln = req.query.Ebeln;
    }

    if (req?.query?.Ebelp) {
        poSrvData.Ebelp = req.query.Ebelp;
    }

    Po.getPoSrv(poSrvData)
        .then(response => {
            if (response?.data?.d?.__metadata) {
                delete response.data.d.__metadata;
            }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get PO Data');
            next(err);
        });
}
//-----------------------------------------------getInvoice
exports.getInvoice = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let invoiceData = {
        Vendor: req.Vendor,
        Ebeln: req.body.Ebeln
    }

    if (req?.query?.Ebeln) {
        invoiceData.Ebeln = req.query.Ebeln;
    }

    Po.getInvoice(invoiceData)
        .then(response => {
            if (response?.data?.d?.__metadata) {
                delete response.data.d.__metadata;
            }
            // if (response.status === 201) {
            res.status(response.status).json(
                {
                    ...response.data
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Get PO Data');
            next(err);
        });
}
//-----------------------------------------------postInvoice
exports.postInvoice = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let invoiceData = { ...req.body };

    crypto.randomBytes(32, (randomBytesErr, buffer) => {
        if (randomBytesErr) {
            randomBytesErr.statusCode = 403;
            throw randomBytesErr;
        }

        invoiceData.AttaId = buffer.toString('hex');
        invoiceData.Reference = invoiceData.AttaId.substring(0, 10);
        if (invoiceData.InvNum) {
            invoiceData.InvNum = invoiceData.InvNum; //.toUpperCase();
        }

        Po.postInvoice(invoiceData)
            .then(response => {
                // if (response.status === 201) {
                res.status(response.status).json(
                    {
                        message: 'Invoice Data Saved',
                        attaId: invoiceData.AttaId,
                        reference: invoiceData.Reference
                        // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                    }
                )
            })
            .catch(err => {
                axiosCatch(err, 'Error Invoice Post');
                next(err);
            });
    });
}