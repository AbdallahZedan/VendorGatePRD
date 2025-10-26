const { body, query, oneOf } = require('express-validator');

//-------------------------------------------- Auth
exports.pswResetReq = [
    body('TaxRegNo').notEmpty().isNumeric().isLength({ max: 20 }),//.isLength({ min: 15, max: 15 })
];

exports.pswReset = [
    body('Token').notEmpty().isLength({ max: 75 }),
    body('Password').notEmpty().isLength({ max: 70 })
];

exports.login = [
    body('TaxRegNo').notEmpty().isNumeric().isLength({ max: 20 }),//.isLength({ min: 15, max: 15 }),
    body('Password').notEmpty().isLength({ max: 70 })
];

exports.otp = [
    body('TaxRegNo').notEmpty().isNumeric().isLength({ max: 20 }),//.isLength({ min: 15, max: 15 }),
    body('Otp').notEmpty().isLength({ max: 4, min: 4 })
];

//-------------------------------------------- Po

exports.ebeln = [
    query('Ebeln').notEmpty().isString().isLength({ min: 10, max: 10 })
];


exports.invoice = [
    body('Ebeln').notEmpty().isString().isLength({ min: 10, max: 10 }),
    body('InvNum').notEmpty().isLength({ max: 16 }),
    body('Amount').notEmpty().isDecimal().isLength({ max: 13 }),
    body('Curr').notEmpty().isLength({ max: 5 })
];


//-------------------------------------------- Lookups

exports.language = [
    query('Language').notEmpty().isLength({ max: 2 })
];

exports.region = [
    query('Language').notEmpty().isLength({ max: 2 }),
    query('Country').notEmpty()
];

//-------------------------------------------- Vendor

exports.vendorAttaComm = [
    body('AttaId').notEmpty().isLength({ max: 75 }),
    body('DocumentType').notEmpty().isNumeric().isLength({ min: 1, max: 3 }),
    body('Ebeln').if((value, { req }) => req.body.DocumentType >= 900).notEmpty().isLength({ max: 10 }),
    body('InvNum').if((value, { req }) => req.body.DocumentType >= 900).notEmpty().isLength({ max: 16 }),
    oneOf([
        body('DocumentExpiry')
            // .matches(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/) //does not handle 31 of februaru
            // .if((value, { req }) => ['011', '002', '004'].includes(req.body.DocumentType) && req.body.InfIsRegistered === true) //Mandatory Documents for Saudi
            // .notEmpty()
            // .if((value, { req }) => [].includes(req.body.DocumentType)) //Mandatory Documents for both Saudi and non Saudi
            // .notEmpty()
            .custom((value, { req }) => {
                if (value) {
                    const year = parseInt(value.substring(0, 4), 10);
                    const month = parseInt(value.substring(4, 6), 10);
                    const day = parseInt(value.substring(6, 8), 10);

                    // Check if the date is valid
                    const date = new Date(year, month - 1, day);
                    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                        throw new Error('Invalid date');
                    }

                    // Check if the date is in the past
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Ignore time for comparison
                    if (date < today) {
                        throw new Error('Date cannot be in the past');
                    }

                    return true;
                }
            }),
        body('DocumentExpiry').isEmpty()
    ]),
    body('TaxRegNo').notEmpty().isNumeric().isLength({ max: 20 }),//.isLength({ min: 15, max: 15 }),
    body('DocumentName').notEmpty().isLength({ max: 100 }),
    body('DocumentBase64').notEmpty() //isBase64
];

exports.vendorDataComm = [
    // .isString()
    // .notEmpty()
    // .isNumeric()

    body('TaxRegNo').notEmpty().isNumeric().isLength({ max: 20 }),//.isLength({ min: 15, max: 15 }).withMessage('Only Decimals allowed'),
    // body('InfSupplierNumber').isLength({ max: 10 }),
    body('InfSupplierName').notEmpty().not().isNumeric(),
    oneOf([
        body('InfShortName').not().isNumeric(),
        body('InfShortName').isEmpty()
    ]),
    // oneOf([body('InfIsRegistered').isEmpty(), body('InfIsRegistered').equals('X')]),
    body('InfIsRegistered').notEmpty().isBoolean(),
    // body('InfTaxRegNoExp').if(body('InfIsRegistered').equals('X')).notEmpty(),
    // body('InfTaxRegNoExp').if(body('InfIsRegistered').equals(true)).notEmpty(),
    body('InfMainContact').notEmpty().isNumeric({ no_symbols: false }), //numbers and sympols
    oneOf([
        body('InfSecondaryContact').isNumeric({ no_symbols: false }).isLength({ max: 30 }),
        body('InfSecondaryContact').isEmpty()
    ]),
    oneOf([body('InfEmail').isEmail().isLength({ max: 241 }),
    body('InfEmail').isEmpty()
    ]),
    oneOf([body('InfWebsite').isLength({ max: 50 }).isURL(),
    body('InfWebsite').isEmpty()
    ]),
    // body('InfActivity').if(body('InfIsRegistered') === true).notEmpty(), // not working
    body('InfActivity').if((value, { req }) => req.body.InfIsRegistered === true).notEmpty().isLength({ max: 20 }),
    body('AddCountry').notEmpty().isLength({ max: 3 }),
    body('AddCity').notEmpty().isLength({ max: 3 }),
    body('AddPostalCode').notEmpty().isLength({ max: 10 }),
    body('AddPostNo').notEmpty().isLength({ max: 10 }),
    body('AddHeadquarters').notEmpty().isLength({ max: 40 }),

    body('ContName').notEmpty().not().isNumeric().isLength({ max: 40 }),
    body('ContMainContact').notEmpty().isNumeric({ no_symbols: false }).isLength({ max: 30 }),
    oneOf([
        body('ContSecondaryContact').isNumeric({ no_symbols: false }).isLength({ max: 30 }),
        body('ContSecondaryContact').isEmpty()
    ]),
    body('ContEmail').notEmpty().isEmail().isLength({ max: 241 }),
    body('ContLang').notEmpty().isLength({ max: 2 }),

    body('TaxNum').if((value, { req }) => req.body.InfIsRegistered === true).notEmpty().isNumeric().isLength({ max: 20 }),
    body('TaxCerType').if((value, { req }) => req.body.InfIsRegistered === true).notEmpty().isLength({ max: 20 }),

    body('BankName').notEmpty().isLength({ max: 100 }),
    // body('BankAccount').notEmpty().isLength({ max: 18 }),
    body('BankCurr').notEmpty().isLength({ max: 5 }),
    body('BankIban').notEmpty().isLength({ max: 34 })
];











