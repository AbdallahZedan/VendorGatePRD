const axios = require('axios');
const config = require('./config');

module.exports = class bankGuarantee {

    static getList(taxRegNo, vendor, acceptLanguage) {

        const filters = [];
        if (taxRegNo)
            filters.push(`TaxRegNo eq '${taxRegNo}'`);
        if (vendor)
            filters.push(`Vendor eq '${vendor}'`);

        const filterStr = filters.join(' and ');

        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                'accept-language': acceptLanguage,
                url: config.guaranteeHeaderUrl,
                query: `sap-client=${config.sapClient}&$filter=${filterStr}&$format=json`
            }
        });
    }

    static getDetails(guaranteeData, acceptLanguage) {
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                'accept-language': acceptLanguage,
                url: config.guaranteeHeaderUrl + `(GuaranteeNo='${guaranteeData.GuaranteeNo}',Version='${guaranteeData.Version}',Banks='${guaranteeData.Banks}',Bankl='${guaranteeData.Bankl}')`,
                query: `sap-client=${config.sapClient}&$format=json&$expand=GuaranteeItemSet,GuaranteeAttachSet`
            }
        });
    }

    static sendGuarantee(guaranteeData, acceptLanguage) {
        return axios({
            method: "POST",
            url: config.cpiPost,
            data: {
                ...guaranteeData
            },
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                'Accept-Language': acceptLanguage,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                url: config.guaranteeItemUrl,
                query: `sap-client=${config.sapClient}`
            }
        });
    }
}