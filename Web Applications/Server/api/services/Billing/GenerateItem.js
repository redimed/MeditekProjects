module.exports = {
    Create: function(objGenerate) {
        var result = {};
        var moment = require('moment');
        if (!_.isEmpty(objGenerate) &&
            objGenerate.type &&
            !_.isEmpty(objGenerate.item)) {
            var item = objGenerate.item;
            switch (objGenerate.type) {
                case 'PriceFund':
                    result.UID = UUIDService.Create();
                    result.Code = item.ItemNum || null;
                    result.Description = item.Description || null;
                    var objPriceFund = {};
                    _.forEach(item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPriceFund[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPriceFund[item_key] = item_val;
                            }
                        }
                    });
                    objPriceFund.PriceColumnList = ['Benefit100', 'ScheduleFee'];
                    result.PriceFund = JSON.stringify([objPriceFund]);
                    break;
                case 'PricePrivate':
                    result.UID = UUIDService.Create();
                    result.Code = item.ItemNum || null;
                    result.Description = item.Description || null;
                    var objPricePrivate = {};
                    _.forEach(item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPricePrivate[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPricePrivate[item_key] = item_val;
                            }
                        }
                    });
                    objPricePrivate.PriceColumnList = ['Benefit100', 'ScheduleFee'];
                    result.PricePrivate = JSON.stringify([objPricePrivate]);
                    break;
                case 'PriceCompany':
                    result.UID = UUIDService.Create();
                    result.Code = item.ItemNum || null;
                    result.Description = item.Description || null;
                    var objPriceCompany = {};
                    _.forEach(item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPriceCompany[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPriceCompany[item_key] = item_val;
                            }
                        }
                    });
                    objPriceCompany.PriceColumnList = ['Benefit100', 'ScheduleFee'];
                    result.PriceCompany = JSON.stringify([objPriceCompany]);
                    break;
                default:
                    sails.log.info('-----import item billing without type-----', data.Type);
                    break;
            }
        }
        return result;
    },
    Update: function(objGenerate) {
        if (!_.isEmpty(objGenerate) &&
            !_.isEmpty(objGenerate.item) &&
            !_.isEmpty(objGenerate.dataOrigin) &&
            objGenerate.type) {
            switch (objGenerate.type) {
                case 'PriceFund':
                    console.log('PriceFund>>>>>', objGenerate);
                    break;
                case 'PriceFund':
                    console.log('PriceFund>>>>>');
                    break;
                case 'PriceFund':
                    console.log('PriceFund>>>>>');
                    break;
                default:
                    sails.log.info('-----import item billing without type-----', data.Type);
                    break;
            }
        } else {
            return false;
        }
    }
};
