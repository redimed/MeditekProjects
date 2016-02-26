var domain = 'https://meditek.redimed.com.au';

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
	getParamsIframe: function(appointmentId, patientId){
		return '/eform?appoinmentUID='+appointmentId+'&patientUID='+patientId;
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
	setDate: function(date){
		if(date === '')
			return '';
		var dateTZ = moment(date).format('DD/MM/YYYY');
		return dateTZ;
	}
}