var APIServices = {
	// Root: 'http://192.168.1.118:8080/api',
	Root: 'http://192.168.1.70:8080/api',
};

//Module Urgent Care
APIServices.UrgentCare = APIServices.Root + '/urgent-care';
APIServices.UrgentCareRequest = APIServices.UrgentCare + '/urgent-request';
APIServices.UrgentCareConfirm = APIServices.UrgentCare + '/urgent-confirm/:id';

module.exports = APIServices;