const { validationResult } = require('express-validator');
const fileType = require('file-type');

const Complaint = require('../model/complaint');

exports.postComplaint = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    postComplaintReq(req, res, next);
};

exports.getRegions = (req, res, next) => {


    getRegions(req, res, next);

};

async function postComplaintReq(req, res, next) {

    try {
        let customerID;
        //check if customer has been created before or not
        let customerResponse = await Complaint.getCustomerFromC4C(req.body.Email);
        // console.log(`email:${req.body.Email}`);
        // console.log(`customer count:${customerResponse.data.d.results.length}`);
        // console.log(`customer :${customerResponse.data.d.results[0].CustomerID}`);

        if (customerResponse.data.d.results.length < 1) {
            let customderData = {
                FirstName: req.body.FirstName,
                MiddleName: req.body.MiddleName,
                LastName: req.body.LastName,
                RoleCode: "CRM000",
                LifeCycleStatusCode: "2",
                LanguageCode: req.body.Language,
                CountryCode: "SA",
                StateCode: req.body.Region.toString(),
                Email: req.body.Email,
                Mobile: req.body.Mobile.toString(),
                GenderCode: req.body.Gender.toString()
            };
            // console.log(`customer --: ${JSON.stringify(customderData, null, 2)}`);
            let createCustomerResponse = await Complaint.createCustomerInC4C(customderData);
            // console.log(`Customer id: ${createCustomerResponse.data.d.results.CustomerID}`);

            customerID = createCustomerResponse.data.d.results.CustomerID;
        } else {
            customerID = customerResponse.data.d.results[0].CustomerID;
        }

        // console.log(`Customer id:${customerID}`);
        if (!customerID)
            throw new Error(`Failed to create/get customer: ${customerID}`);

        //create ticket
        let complaintData = {
            Name: "شكوي",
            ServiceIssueCategoryID: "CM_1",
            IncidentServiceIssueCategoryID: "CM_37",
            BuyerPartyID: customerID,
            DataOriginTypeCode: "4"
        };

        let complaintResponse = await Complaint.createComplaint(complaintData);
        let objectIdForComplaint = complaintResponse.data.d.results.ObjectID || "";
        if (!complaintResponse || !objectIdForComplaint || !complaintResponse.status || complaintResponse.status != 201)
            throw new Error(`Failed to create complaint: ${complaintResponse.status || "No response"}`);

        let complaintTextData = {
            ParentObjectID: objectIdForComplaint,
            TypeCode: "10004",
            FormattedText: req.body.ComplaintText,
        };

        let complaintTextResponse = await Complaint.createComplaintText(complaintTextData);
        if (!complaintTextResponse || !complaintTextResponse.status || complaintTextResponse.status != 201)
            throw new Error(`Failed to create complaint text: ${complaintTextResponse.status || "No response"}`);

        res.status(201).json({
            Message: "Complaint created successfully",
            ComplaintId: objectIdForComplaint,
            ComplaintText: complaintTextData.FormattedText,
            CustomerID: customerID
        });

    } catch (error) {
        res.status(500).json({
            message: "An error occurred while processing the complaint",
            error: error.message
        });
    }

}


async function getRegions(req, res, next) {
    try {
        let language = req.headers['language'] || 'AR';
        let regionListResponse = await Complaint.getRegions(language);
        if (!regionListResponse || !regionListResponse.status || regionListResponse.status != 200) {
        
            let statusCode = (regionListResponse && regionListResponse.status) || 500;
            return res.status(statusCode).json({
                message: "An error occured while retriving the regions"
            });
        }

        let regionArr = regionListResponse.data.d.results.map(region => {
            let { __metadata, ...cleanRegion } = region;
            return cleanRegion;
        });

        res.status(regionListResponse.status).json({
            ...regionArr
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unexpected error occurred",
            error: error.message
        });
    }
}