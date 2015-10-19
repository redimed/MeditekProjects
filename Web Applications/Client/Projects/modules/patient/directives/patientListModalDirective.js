var app = angular.module('app.authentication.patient.list.modal.directive',[]);
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            onCancel: '=',
            onSavechange: '='
        },
		link: function(scope, elem, attrs){
			var oriInfo,clearInfo;
			var data = {};
			data.UID = scope.uid;
			scope.info = {};
			var oriInfo,clearInfo;
			scope.infoChanged = function() {
		        return angular.equals(oriInfo, scope.info);
		    },

			scope.infoClear = function() {
			    return !angular.equals(clearInfo, scope.info);
		    },
			PatientService.detailPatient(data).then(function(response){
				if(response.message=="success"){
					scope.info = response.data[0];
					scope.info.DOB = moment(new Date(scope.info.DOB)).format('DD/MM/YYYY');
					oriInfo = angular.copy(scope.info);
				}
				else{
					console.log(response.message);
				}
			});

			AuthenticationService.getListCountry().then(function(result){
				scope.countries = result.data;
			},function(err){
				toastr.error("error data country","ERROR");
			});

			scope.titles = [
				{id:"0", name:'Mr'},
				{id:"1", name:'Mrs'},
				{id:"2", name:'Ms'},
				{id:"3", name:'Dr'}
			];

			scope.states = [
				{ name: 'Victoria' },
				{ name: 'New South Wales' },
				{ name: 'Queensland' },
				{ name: 'Austria Capital Territory' },
				{ name: 'Northern Territory' },
				{ name: 'Western Australia' },
				{ name: 'Tasmania' }
			];

			scope.insurers = [
				{name: 'Insurer Company'},
				{name: 'Mineral Resources'},
				{name: 'Mesa Minerals'}
			];
			scope.Account_types = [
				{name: 'Titanium Privilege Account'},
				{name: '3-in-1 Account'},
				{name: 'Silver Savings Account'}
			];
		},
		templateUrl:'modules/patient/directives/template/patientListModal.html'
	};
});