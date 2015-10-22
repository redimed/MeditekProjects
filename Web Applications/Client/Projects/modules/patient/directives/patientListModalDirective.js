var app = angular.module('app.authentication.patient.list.modal.directive',[]);
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            onCancel: '='
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

		    scope.savechange = function(Patient){
				PatientService.validate(Patient)
					.then(function(result){
						scope.er ='';
						scope.ermsg ='';
						PatientService.updatePatient(Patient).then(function(response){
							toastr.success("update success!!!","SUCCESS");
							scope.onCancel();
						},function(err){
							toastr.error(err.data.message.errors,"ERROR");
							scope.info = angular.copy(oriInfo);
						});
				}, function(err){
					toastr.error("Please check data again.","ERROR");
					scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				})
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