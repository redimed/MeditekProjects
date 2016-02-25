module.exports = {
	apiUrl: 'https://localhost:3015/',
	apiServerUrl: 'https://192.168.1.235:3005/',
	apiPDFUrl: 'https://192.168.1.100:3019/',
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