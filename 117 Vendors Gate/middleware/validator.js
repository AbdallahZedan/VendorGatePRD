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
//-------------------------------------------- Complaint
const languageArr = ["AR", "EN"];
const genderArr = ["1", "2"];
const regionArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "14"];
exports.complaint = [

    body('Email').notEmpty().isEmail().isLength({ max: 241 }).withMessage("Please enter a valid email address"),
    body('FirstName').notEmpty().not().isNumeric().isLength({ max: 40 }).withMessage("Please enter a valid First Name"),
    body('LastName').notEmpty().not().isNumeric().isLength({ max: 40 }).withMessage("Please enter a valid Last Name"),
    body('Mobile').notEmpty().withMessage('Mobile number is required').matches(/^05\d{8}$/).withMessage("Mobile number must start with 05 and be exactly 10 digits"),
    body('Language').notEmpty().withMessage('Language is required').isLength({ max: 2 }).isIn(languageArr).withMessage('Language must be either AR or EN'),
    body('Gender').notEmpty().isLength({ max: 1 }).isIn(genderArr).withMessage("Please send gender equal 1 for Male or 2 for Female"),
    body('Region').notEmpty().isLength({ max: 2 }).isIn(regionArr).withMessage("Please send region correctly"),
    body('ComplaintText').notEmpty().withMessage("Please send your complaint in ComplaintText element"),
];


exports.bankGuaranteeList = [
    oneOf([
        [
            check('TaxRegNo').notEmpty().withMessage('TaxRegNo is required if Vendor is missing')
        ],
        [
            check('Vendor').notEmpty().withMessage('Vendor is required if TaxRegNo is missing')
        ]
    ], { message: 'Either TaxRegNo or Vendor must be provided in query or body.' })
];          //bank guarantee

exports.bankGuaranteeDetails = [
    check('GuaranteeNo').notEmpty().withMessage('Guarantee No. is mandatory'),
    check('Version').notEmpty().withMessage('Version is mandatory'),
    check('Banks').notEmpty().withMessage('Bank country is mandatory'),
    check('Bankl').notEmpty().withMessage('Bank key is mandatory')
];            //bank guarantee

exports.bankGuaranteeCreate = [
    body('GuaranteeNo').notEmpty().withMessage('Guarantee No. is required'),
    body('Bankl').notEmpty().withMessage('Bank key is required'),
    body('Banks').notEmpty().withMessage('Bank country is required'),
    body('Amount').notEmpty().isDecimal().withMessage('Amount is required and must be a valid number'),
    oneOf([
        [body('TaxRegNo').notEmpty().withMessage('TaxRegNo is required if Vendor is missing')],
        [body('Vendor').notEmpty().withMessage('Vendor is required if TaxRegNo is missing')]
    ], { message: 'Either Tax Regestration No. or Vendor must be provided in the request body.' }),

    body('Serial')
        .optional({ checkFalsy: true })
        .isNumeric().withMessage('Serial must be numeric')
        .isLength({ max: 3 }).withMessage('Serial must not exceed 3 digits'),

    body('Category')
        .notEmpty().withMessage('Category is required')
        .isString().withMessage('Category must be text)')
        .isLength({ max: 4 }).withMessage('Category must not exceed 4 digits'),

    body('ProjectName')
        .notEmpty().withMessage('ProjectName is required')
        .isString().withMessage('ProjectName must be a string')
        .isLength({ max: 60 }).withMessage('ProjectName must not exceed 60 characters'),

    body('Begda')
        .notEmpty().withMessage('Begin date is required and cannot be empty')
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('Begin date must be in DD-MM-YYYY format')
        .custom((value) => {
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw new Error('Begin date is not a valid calendar date');
            }
            return true;
        }),

    body('Endda')
        .notEmpty().withMessage('End date is required and cannot be empty')
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('End date must be in DD-MM-YYYY format')
        .custom((value) => {
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw new Error('End date is not a valid calendar date');
            }
            return true;
        }),

    body('GuaranteeAttachSet')
        .isArray({ min: 1 }).withMessage('GuaranteeAttachSet must be an array and cannot be empty')
        .custom((attachments) => {
            // Find if at least one item satisfies your constraints
            const hasValidAttachment = attachments.some(att =>
                att.DocType === '801' &&
                typeof att.ContentBase64 === 'string' &&
                att.ContentBase64.trim() !== ''
            );

            if (!hasValidAttachment) {
                throw new Error('Please upload Bank Guarantee letter');
            }
            return true;
        })
];            //bank guarantee

exports.bankGuaranteeExtend = [
    body('GuaranteeNo').notEmpty().withMessage('Guarantee No. is required'),
    body('Version').notEmpty().withMessage('Version is required'),
    body('Banks').notEmpty().withMessage('Bank country is required'),
    body('Bankl').notEmpty().withMessage('Bank key is required'),

    body('GuaranteeType')
        .optional({ checkFalsy: true })
        .isString().withMessage('Guarantee type must be a string')
        .equals('EXTD').withMessage('Guarantee type must be "EXTD" '),

    body('Begda')
        .notEmpty().withMessage('Begin date is required and cannot be empty')
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('Begin date must be in DD-MM-YYYY format')
        .custom((value) => {
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw new Error('Begin date is not a valid calendar date');
            }
            return true;
        }),

    body('Endda')
        .notEmpty().withMessage('End date is required and cannot be empty')
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('End date must be in DD-MM-YYYY format')
        .custom((value) => {
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
                throw new Error('End date is not a valid calendar date');
            }
            return true;
        }),
];      //bank guarantee

exports.bankGuaranteeRelease = [
    body('GuaranteeNo').notEmpty().withMessage('Guarantee No. is required'),
    body('Version').notEmpty().withMessage('Version is required'),
    body('Banks').notEmpty().withMessage('Bank country is required'),
    body('Bankl').notEmpty().withMessage('Bank key is required'),
    body('Notes').isString().withMessage('Notes must be a string')
        .isLength({ max: 256 }).withMessage('Notes must not exceed 256 characters'),

    body('GuaranteeAttachSet')
        .isArray({ min: 1 }).withMessage('GuaranteeAttachSet must be an array and cannot be empty')
        .custom((attachments) => {
            // Find if at least one item satisfies your constraints
            const hasValidAttachment = attachments.some(att =>
                att.DocType === '804' &&
                typeof att.ContentBase64 === 'string' &&
                att.ContentBase64.trim() !== ''
            );

            if (!hasValidAttachment) {
                throw new Error('Please upload Bank Guarantee Release letter attachment');
            }
            return true;
        })

];      //bank guarantee    










