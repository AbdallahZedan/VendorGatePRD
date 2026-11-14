const express = require('express');
const { body } = require('express-validator');

const guaranteeController = require('../controllers/bankGuarantee');
const isAuth = require('../middleware/is-auth');
const validator = require('../middleware/validator');

const router = express.Router();

// /bankGuarantee/list
router.get('/list', isAuth, validator.bankGuaranteeList, guaranteeController.getList);

// /bankGuarantee/details
router.get('/details', isAuth, validator.bankGuaranteeDetails, guaranteeController.getDetails);

// /bankGuarantee/create
router.post('/create', isAuth, validator.bankGuaranteeCreate, guaranteeController.createGuarantee);

// /bankGuarantee/extend
router.post('/extend', isAuth, validator.bankGuaranteeExtend, guaranteeController.extendGuarantee);
// /bankGuarantee/release
router.post('/release', isAuth, validator.bankGuaranteeRelease, guaranteeController.releaseGuarantee);

module.exports = router;