var app = angular.module('app.authentication.patient.create.directive',[]);
app.directive('patientCreate',function(toastr, PatientService, $state, $timeout, $cookies, AuthenticationService){
	return {
		scope :{
			appointment:'=',
			abc:'=onItem'
		},
		restrict: "EA",
		controller:function($scope, FileUploader) {
			// Profile Image
			//create reqeust uploader
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,
		    	headers:{
		    		Authorization:'Bearer '+$cookies.get("token"),
		    		systemtype:'WEB',
		    	},
		    	withCredentials:true,
		    	alias : 'uploadFile'
		    });

		    // FILTERS
		    uploader.filters.push({
		        name: 'customFilter',
		        fn: function (item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 10;
		        }
		    });

		},
		link: function(scope, elem, attrs){
			// State
			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];

			// Title
			scope.titles = [
				{'id':'Mr', 'name':'Mr'},
				{'id':'Mrs', 'name':'Mrs'},
				{'id':'Ms', 'name':'Ms'},
				{'id':'Dr', 'name':'Dr'}
			];
			//services getListCountry
			//call Api getListCountry from server
			AuthenticationService.getListCountry().then(function(response){
				scope.countries = response.data;
			},function(err){
				console.log("Server Error");
			});
			//define variable
			scope.data ={};
			scope.er={};
			scope.ermsg={};
			scope.isShowNext=false;
			scope.isBlockStep1 =false;
			//if appointment add this directive to their template 
			//this directive will receive data from appointment
			//when this code run
			if(scope.appointment){
				var input = PatientService.getDatatoDirective();
				if(input){
					scope.data = angular.copy(input);
				}
			}
			// Back
			//input: none
			//output: back to the previous step
			//and show buttons that were disabled when continue to the next step
			scope.Back = function() {
				scope.isShowNext=false;
				scope.isShowCreate=false;
				scope.isBlockStep1=false;
			};
			//event timeout will call after this template's directive rendered
			$timeout(function(){
				App.setAssetsPath('theme/assets/'); // Set the assets folder path	
				FormWizard.init(); // form step
				ComponentsDateTimePickers.init();
			},0);
			//checkPhone : validate data to correct and check PhoneNumber can be used to create patient
			//input : data(FirstName,MiddleName,LastName,PhoneNumber)
			//output: 
			//****show Continue button and show notification check success if check success
			//****show notification check error if data doesn't match validate or 
			//PhoneNumber used to create patient
			scope.checkPhone = function(data) {
				scope.loadingCheck = true;
				//service validate data
				var verifyData = {
					FirstName:data.FirstName,
					LastName:data.LastName,
					PhoneNumber:data.PhoneNumber
				};
				PatientService.validateCheckPhone(data)
				.then(function(success){
					scope.er ='';
					scope.ermsg='';
					scope.isBlockStep1=true;
					//service call API check PhoneNumber can be used to create Patient
					PatientService.checkPatient(verifyData)
					.then(function(result){
						if(result!=undefined && result!=null && result!='' && result.length!=0){
							if(result.data.isCreated==false){
								scope.er ='';
								scope.ermsg='';
								scope.loadingCheck = false;
								toastr.success("Phone Number can be choose to create patient","SUCCESS");
								scope.isShowEmail1 = result.data.data.Email1;
								scope.data.Email1 = result.data.data.Email1;
								scope.isShowNext = true;
								scope.data.CountryID1 = 14;
								scope.data.Title= null;
								scope.data.Gender= null;
								scope.data.Address1= null;
								scope.data.Suburb= null;
								scope.data.Postcode= null;
								scope.data.State = null;
								// scope.data.DOB = new Date('1/1/1990');
							}
							else{
								toastr.error("Phone Number was used to create patient","ERROR");
								scope.isBlockStep1 =false;
								scope.loadingCheck = false;
							}
						}
					}, function(err){
						//if receive error push error message into array ermsg, 
						//push error css into array er
						//and show in template
						scope.loadingCheck = false;
						scope.er={};
						scope.ermsg={};
						toastr.error("Please input correct information","ERROR");
						for(var i = 0; i < err.data.message.ErrorsList.length;i++){
							scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
						}
					});
				},function (err){
					console.log(err);
					scope.loadingCheck = false;
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
				
			};
			//Cancel : cancel create patient
            scope.Cancel = function() {
                if (scope.appointment) {
                	scope.appointment.runIfClose();
                } else {
                    $state.go('authentication.patient.list', null, {
                        'reload': true
                    });
                };
            };


            //CreatePatient : create patient
            //input : data information
            //output: 
            //****create UserAccount to create Patient if validate data success 
            //and show notification success
            //****show notification error if validate data error 
			scope.createPatient = function(data) {
				console.log(data);
				scope.loadingCreate = true;
				//service check data
				return PatientService.validate(data)
				.then(function(result){
					//service call API create patient
					return PatientService.createPatient(data)
					.then(function(success){
						scope.loadingCreate = false;
						//check if patient has avatar, upload avatar
						if(scope.uploader.queue[0]!==undefined && scope.uploader.queue[0]!==null && 
							scope.uploader.queue[0]!=='' && scope.uploader.queue[0].length!==0){
				            scope.uploader.queue[0].formData[0]={};
							scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
							scope.uploader.queue[0].formData[0].userUID = success.data.UserAccountUID;
							scope.uploader.uploadAll();
						}
						//*****check if appointment uses this directive
						//run function success transmission from appointment
						//****else show notification success and back state list patient
						if (scope.appointment) {
							scope.appointment.runIfSuccess(success.data);
						}else{
							toastr.success("Create Successful!!","SUCCESS");
							$state.go('authentication.patient.list',null, {
			           			'reload': true
			        		});
						};
					},function(err){
						scope.er={};
						scope.ermsg={};
						scope.loadingCreate = false;
						toastr.error("Please check data again.","ERROR");
						if(err.data.message.ErrorsList[0].field!=undefined){
							for(var i = 0; i < err.data.message.ErrorsList.length; i++){
								scope.er[err.data.message.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
								scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
							}
						}
						else{
							for(var i = 0; i < err.data.message.ErrorsList.length; i++){
								scope.er[err.data.message.ErrorsList[i].path] ={'border': '2px solid #DCA7B0'};
								scope.ermsg[err.data.message.ErrorsList[i].path] = "invalid value";
							}
						}
					});
				},function(err){
					scope.loadingCreate = false;
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					scope.er = scope.er?scope.er:{};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
			};

			scope.checkDataNull = function(name){
		    	if(scope.data[name].length==0)
		    		scope.data[name] = null;
		    };

		},
		templateUrl:"modules/patient/directives/template/patientCreate.html"
	}
});
