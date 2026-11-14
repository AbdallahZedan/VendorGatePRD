var convert = require('xml-js');

module.exports = (err, msg) => {
    console.log(msg);

    err.odataErrors = [];

    if (err.response && err.response.data && typeof err.response.data === 'string') {
        // --- START OLD XML LOGIC ---
        if (err.response.data.indexOf("<?xml") != -1) {
            err.data = convert.xml2js(err.response.data, { compact: true, spaces: 4 });
            if (err.data.error.message._text) {
                err.data = err.data.error.message._text;
            }
        }

    } else if (err.response && err.response.data) {
        
        err.data = err.response.data;
        if (err?.data?.error?.message?.value) {
            err.data = err.data.error.message.value; 
        }

        const odataError = err.response.data?.error;
        const details = odataError?.innererror?.errordetails;
        
        if (Array.isArray(details) && details.length > 0) {
         
            err.odataErrors = details
                .filter(item => 
                    item.message && 
                    item.code !== "/IWBEP/CX_MGW_BUSI_EXCEPTION" && 
                    item.message !== "An exception was raised"
                )
                .map(item => ({
                    code: item.code,
                    message: item.message,
                    property: item.propertyref || item.target || null,
                    severity: item.severity
                }));
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
};