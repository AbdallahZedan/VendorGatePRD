const express = require('express');
const { body } = require('express-validator');

const complaintController = require('../controllers/complaint');
const validator = require('../middleware/validator');

const router = express.Router();

//complaint/create
router.post('/create',
    validator.complaint,
    complaintController.postComplaint);

// complaint/regions
router.get('/regions',
    complaintController.getRegions);

module.exports = router;