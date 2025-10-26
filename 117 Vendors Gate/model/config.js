// const s4URL = 'http://sapfiori.tools-solutions.com:8000';
// const cpiURL = 'https://cloud-integration-platform-test-wg40f83x.it-cpi024-rt.cfapps.eu10-002.hana.ondemand.com';
const s4URL = 'http://s4h-prod:80'; //'http://s4hqas:80';
const cpiURL = 'https://l650064-iflmap.hcisbp.sa1.hana.ondemand.com'; //'https://e650042-iflmap.hcisbt.sa1.hana.ondemand.com';
const c4cURL = 'https://my352612.crm.ondemand.com'; //complaints

exports.sapClient = '500'; //300';

// exports.cpiAuthorization = 'Basic c2ItNmRmYzc2MDAtNzVmOC00NzVjLWIzNWUtODM4NzkwNjJkNTllIWIyMTkxOTR8aXQtcnQtY2xvdWQtaW50ZWdyYXRpb24tcGxhdGZvcm0tdGVzdC13ZzQwZjgzeCFiMTgyNzIyOmIyYzUwY2NlLTYwZGEtNDQzMy05MTFkLTQ1OGQyZWRmYjgxOCRscjBaUXg5TFlYWllnc2RVUlF2bW1JenAtOWZoR2VRTTJYWmpIY3VoVTRJPQ==';
// exports.cpiUser = 'sb-6dfc7600-75f8-475c-b35e-83879062d59e!b219194|it-rt-cloud-integration-platform-test-wg40f83x!b182722'
// exports.cpiPassword = 'b2c50cce-60da-4433-911d-458d2edfb818$lr0ZQx9LYXZYgsdURQvmmIzp-9fhGeQM2XZjHcuhU4I='; 
exports.cpiUser = 'S0024882812';
exports.cpiPassword = 'Awqaf#123'; 

exports.cpiGet = cpiURL + '/http/vg_get';
exports.cpiPost = cpiURL + '/http/vg_post';
exports.cpiPut = cpiURL + '/http/vg_put';

exports.c4cCustomerURL = c4cURL + '/sap/c4c/odata/v1/c4codataapi/IndividualCustomerCollection'//complaints
exports.c4cComplainURL = c4cURL + '/sap/c4c/odata/v1/c4codataapi/ServiceRequestCollection';//complaints
exports.c4cComplainTextURL = c4cURL + '/sap/c4c/odata/v1/c4codataapi/ServiceRequestTextCollectionCollection';//complaints
exports.c4cComplainAttachURL = c4cURL + '/sap/c4c/odata/v1/c4codataapi/ServiceRequestTextCollectionCollection';//complaints
exports.c4cRegionsURL = c4cURL + '/sap/c4c/odata/v1/c4codataapi/CorporateAccountInternationalVersionPOBoxDeviatingRegionCodeCollection';//complaints
exports.c4cUser = '_AWQAF_PORTA'; //complaints
exports.c4cPassword = 'Awqaf_PRD@V2030@Por#$$@_%%#WWWsDSA'; //complaints

exports.vendorUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/VENDOR_MESSSet';
exports.vendorAttUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/VEND_ATT_MESSSet';
exports.passwordUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PASS_MESSSet';
exports.passwordResetReqUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PASS_RESET_REQ_MESSSet';
exports.passwordOtpUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PASS_OTPSet';
exports.poUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PO_MESSSet';
exports.invoiceUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PO_INV_MESSSet';
exports.poLineUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PO_LINES_MESSSet';
exports.poSrvUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/PO_SRV_MESSSet'; 

exports.lookCountryUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/LOOK_COUNTRYSet';
exports.lookRegionUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/LOOK_REGIONSet';
exports.lookLanguageUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/LOOK_LANGUAGESet';
exports.lookReqDepUrl = s4URL + '/sap/opu/odata/sap/ZVENDORS_GATE_GW_SRV/LOOK_REQ_DEPSet'; 

exports.jwtSecret = '/ETHOwkf7hqD1foaFGQ+czWVUytgL577897*^&f5ktmLKJhJG^OYqpTTnX/aW9McnQdYSyy5/fehWgSCZBJzs9';