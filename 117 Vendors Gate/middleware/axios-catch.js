
var convert = require('xml-js');


module.exports = (err, msg) => {

    console.log(msg);
    // console.log(err);

    if (err.response && err.response.data && typeof err.response.data === 'string') {
        if (err.response.data.indexOf("<?xml") != -1) {
            err.data = convert.xml2js(err.response.data, { compact: true, spaces: 4 })
            if (err.data.error.message._text) {
                err.data = err.data.error.message._text;
            }
        }
    } else if (err.response && err.response.data) {
        err.data = err.response.data;
        // if (err.data.error && err.data.error.message && err.data.error.message.value) {
        if (err?.data?.error?.message?.value) {
            err.data = err.data.error.message.value;
        }
    } else {
        err.data = err.response;
    }

    if (!err.statusCode) {
        if (err.response && err.response.status) {
            err.statusCode = err.response.status;
        } else {
            err.statusCode = 500;
        }
    }
}