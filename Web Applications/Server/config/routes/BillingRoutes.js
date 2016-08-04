module.exports = {
    'post /api/billing/create': {
        controller: 'Billing/BillingController',
        action: 'CreateBilling'
    },
    'get /api/billing/read/:UID': {
        controller: 'Billing/BillingController',
        action: 'ReadBilling'
    },
    'post /api/billing/update': {
        controller: 'Billing/BillingController',
        action: 'UpdateBilling'
    },
    'post /api/billing/destroy/:UID': {
        controller: 'Billing/BillingController',
        action: 'DestroyBilling'
    },
    'post /api/billing/item/add': {
        controller: 'Billing/BillingController',
        action: 'AddItem'
    }
};
