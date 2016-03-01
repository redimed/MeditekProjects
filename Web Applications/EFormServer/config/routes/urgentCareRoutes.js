module.exports={
	'post /api/urgent-care/GetListUrgentRequests':{
		controller:'UrgentCare/UrgentCareController',
		action:'GetListUrgentRequests'
	},
	'post /api/urgent-care/loadlist-urgentrequests':{
		controller:'UrgentCare/UrgentCareController',
		action:'LoadlistUrgentRequests'
	},
	'post /api/urgent-care/detail-urgentrequests':{
		controller:'UrgentCare/UrgentCareController',
		action:'DetailUrgentRequests'
	}
}