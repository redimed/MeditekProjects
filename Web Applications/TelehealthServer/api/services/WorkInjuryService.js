var requestify = require('requestify');
var config = sails.config.myconf;
var jwt = require('jsonwebtoken');
var url = require('url');
var $q = require('q');
var http = require('http');
var _ = require('lodash');
var rootPath = process.cwd();
var apn = require('apn');
var gcm = require('node-gcm');

module.exports = {
    GetDetailCompanyByUser: function(headers, userUid) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        var path = '/api/company/detail-company-by-user/' + userUid;
        return TelehealthService.MakeRequest({
            path: path,
            method: 'GET',
            headers: headers
        })
    },
    GetListStaff: function(headers, userUid) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        var path = '/api/company/get-list-staff/' + userUid;
        return TelehealthService.MakeRequest({
            path: path,
            method: 'GET',
            headers: headers
        })
    },
    GetListSite: function(headers, companyUid) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        var path = '/api/company/get-list-site/' + companyUid;
        return TelehealthService.MakeRequest({
            path: path,
            method: 'GET',
            headers: headers
        })
    },
    GetDetailPatient: function(headers, body) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/patient/detail-patient',
            method: 'POST',
            headers: headers,
            body: body
        })
    },
    GetUserAccountDetail: function(headers, UID) {
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        var path = '/api/user-account/GetUserAccountDetails?UID=' + UID;
        return TelehealthService.MakeRequest({
            path: path,
            method: 'GET',
            headers: headers
        })
    },
    AppointmentRequestCompany: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-request/company',
            method: 'POST',
            headers: headers,
            body: body
        })
    },
    AppointmentRequestPatient: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/appointment-wa-request/patient-new',
            method: 'POST',
            headers: headers,
            body: body
        })
    },
    EformRedisite: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            host: config.EformAPI,
            path: '/eform/saveWithData',
            method: 'POST',
            body: body,
            headers: headers
        })
    },
    LoadDetailCompany: function(headers, body) {
        headers['content-type'] = 'application/json';
        if (headers.systemtype && HelperService.const.systemType[headers.systemtype.toLowerCase()] != undefined) headers.systemtype = HelperService.const.systemType[headers.systemtype.toLowerCase()];
        return TelehealthService.MakeRequest({
            path: '/api/company/load-detail',
            method: 'POST',
            headers: headers,
            body: body
        })
    },
    MakeRequest: function(info) {
        delete info.headers['if-none-match'];
        delete info.headers['content-length'];
        // info.headers['content-length'] = Buffer.byteLength(info.body);
        return requestify.request((info.host ? info.host : config.CoreAPI) + info.path, {
            method: info.method,
            body: !info.body ? null : info.body,
            params: !info.params ? null : info.params,
            headers: !info.headers ? null : info.headers,
            dataType: 'json',
            withCredentials: true,
            rejectUnauthorized: false
        })
    }
}
