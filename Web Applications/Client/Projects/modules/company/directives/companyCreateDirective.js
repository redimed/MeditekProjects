var app = angular.module('app.authentication.company.create.directive',[]);

app.directive('companyCreate', function($uibModal, $timeout, $state, companyService, toastr, doctorService){
	return {
		restrict: 'E',
		scope:{
			info:'=onCompanyInfo',
			cancel:'=onCancel',
			load:'=onLoad',
		},
		templateUrl: 'modules/company/directives/templates/companyCreateDirective.html',
		link: function(scope, elem, attrs){
			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];
			doctorService.listCountry()
			.then(function(response){
				scope.country = response;
			},function(err){
				console.log(err);
			});
			console.log(scope.info);
			// scope.info = {};
			scope.info = scope.info?scope.info:{};
			scope.erlist ={};
			scope.toggle = false;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			// $timeout(function(){
			// 	// ComponentsDateTimePickers.init(); // init todo page
			// });

			scope.checkDataNull = function(key) {
				if(scope.info[key].length == 0) {
					delete scope.info[key];
				}
			}

			// func  : save
			//input  : thong tin dung de tao Company
			//output : *kiem tra thong tin co chinh xac hay k
			//         *neu thong tin dung tiep tuc gui len server de server kiem tra va insert vao database
			//		   *neu thong tin khong dung hoac sai dinh dang thi thong bao cho nguoi dung sua thong tin
			scope.save = function(){
				//check data
				companyService.validate(scope.info)
				.then(function(result){
					//when check success
					//call create APIs
					companyService.createCompany(scope.info)
					.then(function(success){
						toastr.success('Create Successfully','Success');
						if(scope.load) scope.load();
						if (scope.cancel) scope.cancel();
					},function(err){
						toastr.error('Please check data again !!!','error');
						for(var i = 0; i < err.data.ErrorsList.length; i++) {
							scope.erlist[err.data.ErrorsList[i].field] = {};
							scope.erlist[err.data.ErrorsList[i].field].msg = err.data.ErrorsList[i].message;
							scope.erlist[err.data.ErrorsList[i].field].style = { 'border': '2px solid #DCA7B0' };
						}
					})
					//end call

				//when check failed	
				},function(err) {
					toastr.error('Please check data again !!!','error');
					for(var i = 0; i < err.length; i++) {
						scope.erlist[err[i].field] = {};
						scope.erlist[err[i].field].msg = err[i].message;
						scope.erlist[err[i].field].style = { 'border': '2px solid #DCA7B0' };
					}
				})
			};
			scope.detail = function(){
				$state.go('authentication.company.detail');
			};
		},
	};
});