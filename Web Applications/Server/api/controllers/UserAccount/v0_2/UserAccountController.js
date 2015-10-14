var regexp = require('node-regexp');
var underscore=require('underscore');

module.exports = {
	Test:function(req,res)
	{
			var orderTemp=[{UserName:undefined},{Email:'DESC'}];
			var arr=['000',undefined,'a'];
			console.log(arr.indexOf(undefined));
			// var order=[];

			// order=_.filter(orderTemp,function(item){

			// 	return HelperService.existIn(_.values(item)[0].toUpperCase(),['ASC','DESC']);
			// })

			// console.log(order);
			res.ok("V2 NE");
	},
	
}