const express = require('express');
const { body } = require('express-validator');

const vendorController = require('../controllers/vendor');
const isAuth = require('../middleware/is-auth');
const validator = require('../middleware/validator');

const router = express.Router();

const createEmailChain = [body('AttaId').notEmpty()]

//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
// POST /vendor/signup_data
router.post('/signup_data',
    validator.vendorDataComm,
    vendorController.postSignupData);
// POST /vendor/signup_att
router.post('/signup_atta',
    validator.vendorAttaComm,
    vendorController.postSignupAtta);
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
// GET /vendor/vendor_data
router.get('/vendor_data', isAuth, vendorController.getVendorData);
// GET /vendor/vendor_atta
router.get('/vendor_atta', isAuth, vendorController.getVendorAttachment);
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
// PUT /vendor/vendor_data
router.put('/vendor_data', 
    isAuth, 
    validator.vendorDataComm,
    vendorController.putVendorData);
// PUT /vendor/vendor_atta
router.put('/vendor_atta', 
    isAuth, 
    validator.vendorAttaComm,
    vendorController.putVendorAttachment);
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*
//*----------------------------------------------------------------------------------*

module.exports = router;