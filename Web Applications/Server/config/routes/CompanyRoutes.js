module.exports = {

    'post /api/company/test':{
        controller: 'Company/CompanyController',
        action:'Test'
    },

    'post /api/company/create-company': {
        controller: 'Company/CompanyController',
        action: 'CreateCompany'
    },

    'post /api/company/get-list': {
    	controller: 'Company/CompanyController',
    	action: 'getList'
    },

    'post /api/company/detail-company': {
    	controller: 'Company/CompanyController',
    	action: 'detailCompany'
    },

    'post /api/company/load-detail': {
        controller: 'Company/CompanyController',
        action: 'loadDetail'
    },

    'post /api/company/create' :{
        controller: 'Company/CompanyController',
        action: 'Create'
    },

    'post /api/company/update' :{
        controller: 'Company/CompanyController',
        action: 'Update'
    },

    'post /api/company/change-status' :{
        controller: 'Company/CompanyController',
        action: 'ChangeStatus'
    },

    'post /api/company/create-staff' :{
        controller: 'Company/CompanyController',
        action: 'CreateStaff'
    },

    'post /api/company/get-list-fund' :{
        controller: 'Company/CompanyController',
        action: 'GetListFund'
    },

    'post /api/company/create-fund' :{
        controller: 'Company/CompanyController',
        action: 'CreateFund'
    },

    'get /api/company/detail-company-by-user/:uid':{
        controller: 'Company/CompanyController',
        action: 'DetailCompanyByUser'
    },

    'get /api/company/get-list-staff/:uid':{
        controller: 'Company/CompanyController',
        action: 'GetListStaff'
    },

    'get /api/company/get-list-site/:companyuid' :{
        controller: 'Company/CompanyController',
        action: 'GetListSite'
    },

    'post /api/company/get-child-detail': {
        controller: 'Company/CompanyController',
        action: 'GetDetailChild'
    },

    'post /api/company/create-user' : {
        controller: 'Company/CompanyController',
        action: 'CreateUser'
    }
};