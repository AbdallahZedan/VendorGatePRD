const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoues = require('./routes/auth');
const lookupRoues = require('./routes/lookup');
const vendorRoues = require('./routes/vendor');
const poRoues = require('./routes/po');
const complaintRoute = require('./routes/complaint'); // complaint
const bankGuaranteeRoute = require('./routes/bankGuarantee'); // bank guarantee

const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

app.use(express.json({ limit: '10mb' })); //extend file size to be 5mb rather than 100k

app.use(bodyParser.json());


// to avoid CORS Error
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');    //, PATCH, DELETE
  res.setHeader('Access-Control-Allow-Headers', '*'); //'Content-Type, Authorization'
  next();
});


app.use('/auth', authRoues);
app.use('/lookup', lookupRoues);
app.use('/vendor', vendorRoues);
app.use('/po', poRoues);
app.use('/complaint', complaintRoute);    // complaint
app.use('/bankGuarantee', bankGuaranteeRoute) // bank guarantee

//error handling middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    
    // Check if error.data is a string (old style) or validation array from express-validator
    const mainMessage = typeof error.data === 'string' ? error.data : (error.message || 'An error occurred.');
    const inputValidationErrors = Array.isArray(error.data) ? error.data : [];

    res.status(status).json({
        success: false,
        message: mainMessage,                // Returns old string result ("An exception was raised")
        sapErrorDetails: error.odataErrors,   // Returns new array result ([ { message: "يوجد خطأ..." } ])
        validationErrors: inputValidationErrors // Handles express-validator if it fails
    });
});



app.listen(port, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", port);
});
