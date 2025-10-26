const axios = require('axios');
const config = require('./config');

//----------------------------------------------- class Lookup
module.exports = class Lookup {
    //----------------------------------------------- Get Country
    static getCountry(language) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.lookCountryUrl,
                query: `sap-client=${config.sapClient}&$filter=Spras eq '${language}'&$format=json`
            }
        });
    }
    //----------------------------------------------- Get Region
    static getRegion(regionData) {

        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.lookRegionUrl,
                query: `sap-client=${config.sapClient}&$filter=Spras eq '${regionData.Language}' and Country eq '${regionData.Country}'&$format=json`
            }
        });
    }
    //----------------------------------------------- Get Language
    static getLanguage(language) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.lookLanguageUrl,
                query: `sap-client=${config.sapClient}&$filter=Spras eq '${language}'&$format=json`
            }
        });
    }
    //----------------------------------------------- Get Requesting Department
    static getReqDep(language) {
        // const xcrf = "X-Requested-With"
        return axios({
            method: "GET",
            url: config.cpiGet,
            auth: {
                username: config.cpiUser,
                password: config.cpiPassword
            },
            headers: {
                url: config.lookReqDepUrl,
                query: `sap-client=${config.sapClient}&$filter=Spras eq '${language}'&$format=json`
            }
        });
    }
    //-----------------------------------------------

}