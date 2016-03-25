//var domain = 'https://testapp.redimed.com.au';
var domain = 'https://meditek.redimed.com.au';
//var domain = 'https://192.168.1.172';
//var domain = 'https://localhost';

module.exports = {
	//apiUrl: 'https://testapp.redimed.com.au:3015/',
	//apiServerUrl: 'https://testapp.redimed.com.au:3005/',
	//apiPDFUrl: 'https://testapp.redimed.com.au:3013/',
	//apiUrl: 'https://meditek.redimed.com.au:3015/',
	//apiServerUrl: 'https://meditek.redimed.com.au:3005/',
	//apiPDFUrl: 'https://meditek.redimed.com.au:3013/',
	apiUrl: domain+':3015/',
	apiServerUrl: domain+':3005/',
	apiPDFUrl: domain+':3013/',
	//apiPDFUrl: 'https://192.168.1.100:3013/',
	getParamsIframe: function(appointmentId, patientId,userId){
		return '/eform?appoinmentUID='+appointmentId+'&patientUID='+patientId+'&userUID='+userId;
	},
	getDateTimeZone: function(date){
		if(date === '')
			return '';
		var res = date.charAt(2);
		if(res === '/'){
			var split = date.split('/');
			var z = moment().format('Z');
			return split[2]+'-'+split[1]+'-'+split[0]+' 00:00:00 '+z;
		}
	},
	getPrefixField: function(typeString, findString){
		return typeString.indexOf(findString);
	},
	getArrayConcat: function(concatString){
		var res = [];
		var substring = concatString.substring(7, concatString.length-1);
		var substringRes = substring.split(',');
		for(var i = 0; i < substringRes.length; i++){
			res.push(substringRes[i]);
		}
		return res;
	},
	getArrayDefault: function(defaultString){
		var res = [];
		var substring = defaultString.substring(8, defaultString.length-1);
		var substringRes = substring.split(',');
		for(var i = 0; i < substringRes.length; i++){
			res.push(substringRes[i]);
		}
		return res;
	},
	setDate: function(date){
		if(date === '')
			return '';
		var dateTZ = moment(date).format('DD/MM/YYYY');
		return dateTZ;
	},
	parseQueryString: function(location){
	        var params = location.split('?');
	        var str = params[1];
	        var objURL = {};

	        str.replace(
	            new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
	            function( $0, $1, $2, $3 ){
	                objURL[ $1 ] = $3;
	            }
	        );
	        return objURL;
	}
}