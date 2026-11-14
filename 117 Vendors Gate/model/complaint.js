const axios = require('axios');
const config = require('./config');

module.exports = class Complaint {
    static createComplaint(complaintData) {
        return axios({
            method: "POST",
            url: config.c4cComplainURL,
            data: {
                ...complaintData
            },
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    static createComplaintText(complaintTextData) {
        return axios({
            method: "POST",
            url: config.c4cComplainTextURL,
            data: {
                ...complaintTextData
            },
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

    }

    static createComplaintAttachment(complaintAttachmentData) {
        return axios({
            method: "POST",
            url: config.c4cComplainAttachURL,
            data: {
                ...complaintAttachmentData
            },
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

    }

    static getCustomerFromC4C(email) {

        return axios({
            method: "GET",
            url: config.c4cCustomerURL + `?$filter=Email eq '${email}'&$format=json`,
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    static createCustomerInC4C(customerData) {
        return axios({
            method: "POST",
            url: config.c4cCustomerURL,
            data: { ...customerData },
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    static getRegions(language = 'AR') {
        return axios({
            method: "GET",
            url: config.c4cRegionsURL + `?$filter=Context eq 'SA'&$format=json`,
            auth: {
                username: config.c4cUser,
                password: config.c4cPassword
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Language': language
            }
        });
    }
};

