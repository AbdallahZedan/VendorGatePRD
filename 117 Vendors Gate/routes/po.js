const express = require('express');
const { body } = require('express-validator');

const poController = require('../controllers/po');
const isAuth = require('../middleware/is-auth');
const validator = require('../middleware/validator');

const router = express.Router();

// GET /po/pos
router.get('/pos', isAuth, poController.getPos);

// GET /po/po
router.get('/po', 
    isAuth, 
    validator.ebeln,
    poController.getPo);

// GET /po/polines
router.get('/polines', 
    isAuth, 
    validator.ebeln,
    poController.getPoLines);

// GET /po/posrv
router.get('/posrv', 
    isAuth, 
    validator.ebeln,
    poController.getPoSrv);



// GET /po/poinvoice
router.get('/invoice', 
    isAuth, 
    validator.ebeln,
    poController.getInvoice);

// POST /po/invoice
router.post('/invoice', 
    isAuth, 
    validator.invoice,
    poController.postInvoice);


module.exports = router;