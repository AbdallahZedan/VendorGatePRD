const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const authRoues = require('./routes/auth');
const lookupRoues = require('./routes/lookup');
const vendorRoues = require('./routes/vendor');
const poRoues = require('./routes/po');

const app = express();
// const port = process.env.PORT || 3000;
const port = process.env.PORT;

app.use(express.json({ limit: '5mb' })); //extend file size to be 5mb rather than 100k

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


//error handling middleware
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  // res.status(status).json({ message: message });
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});



app.listen(port, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", port);
});
