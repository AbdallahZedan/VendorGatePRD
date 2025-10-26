const axios = require('axios');
const config = require('./config');

//----------------------------------------------- class Vendor
module.exports = class Vendor {
    //----------------------------------------------- getPassword Login
    static getPassword(taxRegNo) {
        const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.passwordUrl + `('${taxRegNo}')`,
                query: `sap-client=${config.sapClient}&$format=json`
            }
        });
    }
    //----------------------------------------------- postPswResetReq to send reset password request 
    static postPswResetReq(vendorPswResetReq) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...vendorPswResetReq
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.passwordResetReqUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //----------------------------------------------- post OTP
    static postPswOtp(vendorPswOtp) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...vendorPswOtp
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.passwordOtpUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //----------------------------------------------- GET OTP
    static getPswOtp(taxRegNo) {
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.passwordOtpUrl + `('${taxRegNo}')`,
                query: `sap-client=${config.sapClient}&$format=json`
            }
        });
    }
    //----------------------------------------------- postPswReset to Post Password 
    static postPswReset(vendorPswReset) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...vendorPswReset
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.passwordUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //----------------------------------------------- Get Vendor Data
    static getVendorData(taxRegNo) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorUrl + `('${taxRegNo}')`,
                query: `sap-client=${config.sapClient}&$format=json`
            }
        });
    }
    //----------------------------------------------- post Vendor Data
    static postVendor(vendordata) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...vendordata
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //---------------------------------------- PUT Vendor Data
    static putVendor(vendordata) {
        return axios({
            method: "PUT",
            url: config.cpiPut,
            data: {
                ...vendordata
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorUrl + `('${vendordata.TaxRegNo}')`,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //----------------------------------------------- GET Vendor Attachment
    static getVendorAttachment(vendorAttaData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorAttUrl + `(TaxRegNo='${vendorAttaData.TaxRegNo}',DocumentType='${vendorAttaData.DocumentType}',AttaId='${vendorAttaData.AttaId}')`,
                query: `sap-client=${config.sapClient}&$format=json`
            }
        });
    }
    //-----------------------------------------------POST Vendor Attachment
    static postVendorAttachment(vendorAttaData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...vendorAttaData
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorAttUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //-----------------------------------------------PUT Vendor Attachment
    static putVendorAttachment(vendorAttaData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "PUT",
            url: config.cpiPut,
            data: {
                ...vendorAttaData
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.vendorAttUrl + `(TaxRegNo='${vendorAttaData.TaxRegNo}',DocumentType='${vendorAttaData.DocumentType}',AttaId='${vendorAttaData.AttaId}')`,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //-----------------------------------------------
}
//-----------------------------------------------