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
        var moment = require('moment');
        if (!_.isEmpty(objGenerate) &&
            !_.isEmpty(objGenerate.item) &&
            !_.isEmpty(objGenerate.dataOrigin) &&
            objGenerate.type) {
            switch (objGenerate.type) {
                case 'PriceFund':
                    var priceFundOrigin = (!_.isEmpty(objGenerate) &&
                            !_.isEmpty(objGenerate.dataOrigin) &&
                            !_.isEmpty(objGenerate.dataOrigin.PriceFund)) ?
                        JSON.parse(objGenerate.dataOrigin.PriceFund) : [];
                    var itemStartDate = moment(objGenerate.item.ItemStartDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                    var itemEndDate = objGenerate.item.ItemEndDate ?
                        moment(objGenerate.item.ItemEndDate, 'DD.MM.YYYY').format('YYYY-MM-DD') :
                        objGenerate.item.ItemEndDate;
                    var indexFound = -1;
                    _.forEach(priceFundOrigin, function(price, index) {
                        var itemStartDateOrigin = price.ItemStartDate;
                        var itemEndDateOrigin = moment(price.ItemEndDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                        if (itemEndDateOrigin == itemStartDate &&
                            itemEndDateOrigin == itemEndDate) {
                            indexFound = index;
                            return;
                        }
                    });
                    var objPriceFund = {};
                    _.forEach(objGenerate.item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPriceFund[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPriceFund[item_key] = item_val;
                            }
                        }
                    });
                    if (indexFound) {
                        //update json price
                        objGenerate.dataOrigin.PriceFund[indexFound] = objPriceFund;
                    } else {
                        //push new price json
                        objGenerate.dataOrigin.PriceFund.push(objPriceFund);
                    }
                    break;
                case 'PriceCompany':
                    var priceCompanyOrigin = (!_.isEmpty(objGenerate) &&
                            !_.isEmpty(objGenerate.dataOrigin) &&
                            !_.isEmpty(objGenerate.dataOrigin.PriceCompany)) ?
                        JSON.parse(objGenerate.dataOrigin.PriceCompany) : [];
                    var itemStartDate = moment(objGenerate.item.ItemStartDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                    var itemEndDate = objGenerate.item.ItemEndDate ?
                        moment(objGenerate.item.ItemEndDate, 'DD.MM.YYYY').format('YYYY-MM-DD') :
                        objGenerate.item.ItemEndDate;
                    var indexFound = -1;
                    _.forEach(priceCompanyOrigin, function(price, index) {
                        var itemStartDateOrigin = price.ItemStartDate;
                        var itemEndDateOrigin = moment(price.ItemEndDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                        if (itemEndDateOrigin == itemStartDate &&
                            itemEndDateOrigin == itemEndDate) {
                            indexFound = index;
                            return;
                        }
                    });
                    var objPriceCompany = {};
                    _.forEach(objGenerate.item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPriceCompany[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPriceCompany[item_key] = item_val;
                            }
                        }
                    });
                    if (indexFound) {
                        //update json price
                        objGenerate.dataOrigin.PriceCompany[indexFound] = objPriceCompany;
                    } else {
                        //push new price json
                        objGenerate.dataOrigin.PriceCompany.push(objPriceCompany);
                    }
                    break;
                case 'PricePrivate':
                    var pricePrivateOrigin = (!_.isEmpty(objGenerate) &&
                            !_.isEmpty(objGenerate.dataOrigin) &&
                            !_.isEmpty(objGenerate.dataOrigin.PricePrivate)) ?
                        JSON.parse(objGenerate.dataOrigin.PricePrivate) : [];
                    var itemStartDate = moment(objGenerate.item.ItemStartDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                    var itemEndDate = objGenerate.item.ItemEndDate ?
                        moment(objGenerate.item.ItemEndDate, 'DD.MM.YYYY').format('YYYY-MM-DD') :
                        objGenerate.item.ItemEndDate;
                    var indexFound = -1;
                    _.forEach(pricePrivateOrigin, function(price, index) {
                        var itemStartDateOrigin = price.ItemStartDate;
                        var itemEndDateOrigin = moment(price.ItemEndDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
                        if (itemEndDateOrigin == itemStartDate &&
                            itemEndDateOrigin == itemEndDate) {
                            indexFound = index;
                            return;
                        }
                    });
                    var objPricePrivate = {};
                    _.forEach(objGenerate.item, function(item_val, item_key) {
                        if (item_key != 'ItemNum' &&
                            item_key != 'Description') {
                            if (moment(item_val, 'DD.MM.YYYY', true).isValid()) {
                                objPricePrivate[item_key] = moment(item_val, 'DD.MM.YYYY').format('YYYY-MM-DD');
                            } else {
                                objPricePrivate[item_key] = item_val;
                            }
                        }
                    });
                    if (indexFound) {
                        //update json price
                        objGenerate.dataOrigin.PricePrivate[indexFound] = objPricePrivate;
                    } else {
                        //push new price json
                        objGenerate.dataOrigin.PricePrivate.push(objPricePrivate);
                    }
                    break;
                default:
                    sails.log.info('-----import item billing without type-----', data.Type);
                    break;
            }
        } else {
            return false;
        }
        return objGenerate.dataOrigin;
    }
};
