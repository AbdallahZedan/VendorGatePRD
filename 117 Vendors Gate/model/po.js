const axios = require('axios');
const config = require('./config');

//----------------------------------------------- class Po
module.exports = class Po {
    //----------------------------------------------- Get all POs Data
    static getpos(vendor) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.poUrl,
                query: `sap-client=${config.sapClient}&$filter=VendorNum eq '${vendor}'&$format=json`
            }
        });
    }

    //----------------------------------------------- Get PO Data
    static getpo(poData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.poUrl + `('${poData.Ebeln}')`,
                query: `sap-client=${config.sapClient}&$format=json&$expand=PoLines,PoLines/PoSrv,PoInv,PoGr`
            }
        });
    }

    //----------------------------------------------- Get PO Lines
    static getPoLines(poLinesData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.poLineUrl,
                query: `sap-client=${config.sapClient}&$format=json&$filter=Ebeln eq '${poLinesData.Ebeln}'`
            }
        });
    }
    //----------------------------------------------- Get PO Service
    static getPoSrv(poSrvData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.poSrvUrl,
                query: `sap-client=${config.sapClient}&$format=json&$filter=Ebeln eq '${poSrvData.Ebeln}' and Ebelp eq '${poSrvData.Ebelp}'`
            }
        });
    }
    //----------------------------------------------- Get Invoice
    static getInvoice(invoiceData) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.invoiceUrl,
                query: `sap-client=${config.sapClient}&$format=json&$filter=Ebeln eq '${invoiceData.Ebeln}'`
            }
        });
    }

    //----------------------------------------------- Post Invoice
    static postInvoice(invoiceData) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...invoiceData
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.invoiceUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
    //-----------------------------------------------

    //----------------------------------------------- class Po
}