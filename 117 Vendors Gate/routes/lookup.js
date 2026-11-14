const express = require('express');
const { body } = require('express-validator');

const lookupController = require('../controllers/lookup');
const validator = require('../middleware/validator');

const router = express.Router();

// GET /lookup/country
router.get('/country',
    validator.language,
    lookupController.getCountry);

// GET /lookup/region
router.get('/region',
    validator.region,
    lookupController.getRegion);

// GET /lookup/language
router.get('/language',
    validator.language,
    lookupController.getLanguage);

// GET /lookup/reqdep
router.get('/reqdep',
    validator.language,
    lookupController.getReqDep);

// GET /lookup/bank
router.get('/bank',
    lookupController.getBank);
router.get('/guaranteeCategory',
    lookupController.getGuaranteeCategory);

module.exports = router;