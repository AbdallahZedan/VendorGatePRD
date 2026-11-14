const crypto = require('crypto');
var convert = require('xml-js');
const { validationResult } = require('express-validator');
// const { fileTypeFromBuffer } = require('file-type');
const fileType = require('file-type');

const Vendor = require('../model/vendor');
const Config = require('../model/config');
const axiosCatch = require('../middleware/axios-catch');

//-----------------------------------------------

function removeNullUndefinedWithReduce(obj) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            acc[key] = typeof value === 'object' ? removeNullUndefinedWithReduce(value) : value;
        }
        return acc;
    }, {});
}

async function checkDocumentType(document) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const extensions = ['jpg', 'jpeg', 'png', 'pdf'];

    const { DocumentName, DocumentBase64 } = document;

    if (!DocumentName || !DocumentBase64) {
        return { valid: false, message: 'Invalid input: DocumentName or DocumentBase64 is missing' };
    }

    // Decode Base64 to a Buffer
    const buffer = Buffer.from(DocumentBase64, 'base64');

    try {
        // Detect MIME type from the Buffer
        const fileInfo = await fileType.fromBuffer(buffer);

        if (!fileInfo) {
            return { valid: false, message: 'Unable to detect file type from Base64' };
        }

        const { mime, ext } = fileInfo;

        // Check if the detected MIME type is allowed
        if (!allowedMimeTypes.includes(mime)) {
            return { valid: false, message: `File type not allowed. Detected type: ${mime}` };
        }

        // Additional validation by file extension
        const documentExtension = DocumentName.split('.').pop().toLowerCase();
        if (!extensions.includes(documentExtension)) {
            return { valid: false, message: `File extension not allowed. Detected extension: ${documentExtension}` };
        }

        return { valid: true, message: 'File type is valid', detectedMimeType: mime, detectedExtension: ext };

    } catch (error) {
        return { valid: false, message: `Error occurred during file type validation: ${error.message}` };
    }
}
//-----------------------------------------------postSignupData
exports.postSignupData = (req, res, next) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let vendorData = { ...req.body };


    vendorData = removeNullUndefinedWithReduce(vendorData);

    // console.log(vendorData);

    if (vendorData.TaxRegNo && vendorData.TaxNum) {
        [vendorData.TaxRegNo, vendorData.TaxNum] = [vendorData.TaxNum, vendorData.TaxRegNo];
    }

    if (vendorData.BankAccount && vendorData.BankAccount.length > 18) {
        vendorData.BankAccount = vendorData.BankAccount.substring(0, 18);
    }

    // console.log(vendorData);

    crypto.randomBytes(32, (randomBytesErr, buffer) => {
        if (randomBytesErr) {
            randomBytesErr.statusCode = 403;
            throw randomBytesErr;
        }
        vendorData.AttaId = buffer.toString('hex');
        // console.log(vendorData.AttaId);

        Vendor.postVendor(vendorData)
            .then(response => {
                // if (response.status === 201) {
                res.status(response.status).json(
                    {
                        message: 'Vendor Data Saved',
                        attaId: vendorData.AttaId,
                        // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                    }
                )
            })
            .catch(err => {
                axiosCatch(err, 'Error Vendor Data SignUp');
                next(err);
            });
    });
}
//-----------------------------------------------postSignupAtta
exports.postSignupAtta = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    // let vendorAtta = { ...req.body };

    let vendorAtta = {
        AttaId: req.body.AttaId,
        DocId: req.body.TaxRegNo,
        // DocumentExpiry: req.body.DocumentExpiry,
        TaxRegNo: req.body.TaxRegNo,
        DocumentType: req.body.DocumentType,
        DocumentName: req.body.DocumentName,
        DocumentBase64: req.body.DocumentBase64
    }

    if (req.body.DocumentExpiry) {
        vendorAtta.DocumentExpiry = req.body.DocumentExpiry;
    }


    // Call the external function to validate the document type
    // const validationResult =  checkDocumentType(vendorAtta);

    // if (!validationResult.valid) {
    //     const error = new Error(validationResult.message);
    //     error.statusCode = 400;
    //     throw error;
    // }
    checkDocumentType(vendorAtta)
        .then(extValidator => { //
            if (!extValidator.valid) {
                const error = new Error(extValidator.message);
                error.statusCode = 400;
                throw error;
            }
            else {
                return Vendor.postVendorAttachment(vendorAtta)
            }
        }) //
        .then(response => {
            res.status(response.status).json(
                {
                    message: 'Vendor Attachment Saved'//,
                    // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                }
            )
        })
        .catch(err => {
            axiosCatch(err, 'Error Vendor Attachment SignUp');
            next(err);
        });
}


//-----------------------------------------------getVendorData
exports.getVendorData = (req, res, next) => {

    // res.status(200).json({ TaxRegNo: req.TaxRegNo });

    Vendor.getVendorData(req.TaxRegNo)
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
            axiosCatch(err, 'Error GET Vendor Data');
            next(err);
        });
}
//-----------------------------------------------getVendorAttachment
exports.getVendorAttachment = (req, res, next) => {

    // res.status(200).json({ TaxRegNo: req.TaxRegNo });
    attaData = {
        TaxRegNo: req.TaxRegNo,
        DocumentType: req.body.DocumentType,
        AttaId: req.body.AttaId
    }

    if (req?.query?.DocumentType) {
        attaData.DocumentType = req.query.DocumentType;
    }

    if (req?.query?.AttaId) {
        attaData.AttaId = req.query.AttaId;
    }

    if (req.body.Ebeln && req.body.InvNum) {
        attaData.DocId = req.body.Ebeln.concat(req.body.InvNum);
    } else if (req.query.Ebeln && req.query.InvNum) {
        attaData.DocId = req.query.Ebeln.concat(req.query.InvNum);
    } else {
        attaData.DocId = req.TaxRegNo;
    }

    // console.log(`attachment data: ${attaData}`);

    Vendor.getVendorAttachment(attaData)
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
            axiosCatch(err, 'Error Vendor Get Attachment');
            next(err);
        });
}
//-----------------------------------------------putVendorData
exports.putVendorData = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let vendorData = { ...req.body };

    vendorData = removeNullUndefinedWithReduce(vendorData);

    crypto.randomBytes(32, (randomBytesErr, buffer) => {
        if (randomBytesErr) {
            randomBytesErr.statusCode = 403;
            throw randomBytesErr;
        }
        vendorData.AttaId = buffer.toString('hex');

        Vendor.putVendor(vendorData)
            .then(response => {
                // if (response.status === 201) {
                res.status(response.status).json(
                    {
                        message: 'Vendor Data Updated',
                        attaId: vendorData.AttaId
                        // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                    }
                )
            })
            .catch(err => {
                axiosCatch(err, 'Error Vendor Data Update');
                next(err);
            });
    });
};


//-----------------------------------------------putVendorAttachment
exports.putVendorAttachment = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    // let vendorAtta = { ...req.body };

    let vendorAtta = {
        AttaId: req.body.AttaId,
        // DocumentExpiry: req.body.DocumentExpiry,
        TaxRegNo: req.body.TaxRegNo,
        DocumentType: req.body.DocumentType,
        DocumentName: req.body.DocumentName,
        DocumentBase64: req.body.DocumentBase64
    }

    if (req.body.DocumentExpiry) {
        vendorAtta.DocumentExpiry = req.body.DocumentExpiry;
    }

    if (req.body.Ebeln && req.body.InvNum) {
        vendorAtta.DocId = req.body.Ebeln.concat(req.body.InvNum);
    } else {
        vendorAtta.DocId = req.TaxRegNo;
    }

    // console.log(vendorAtta.DocId);

    crypto.randomBytes(32, (randomBytesErr, buffer) => {
        if (randomBytesErr) {
            randomBytesErr.statusCode = 403;
            throw randomBytesErr;
        }

        if (!vendorAtta.AttaId) {
            vendorAtta.AttaId = buffer.toString('hex');
        }

        checkDocumentType(vendorAtta)
            .then(extValidator => {
                if (!extValidator.valid) {
                    const error = new Error(extValidator.message);
                    error.statusCode = 400;
                    throw error;
                }
                else {
                    return Vendor.putVendorAttachment(vendorAtta)
                }
            })
            .then(response => {
                res.status(response.status).json(
                    {
                        message: 'Vendor Attachment Saved',
                        // data: JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }))
                    }
                )
            })
            .catch(err => {
                axiosCatch(err, 'Error Vendor Attachment Update');
                next(err);
            });
    });
};