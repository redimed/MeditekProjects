var app = angular.module('app.authentication.user.profile.controller',[
]);

app.controller('userProfileCtrl', function($scope, PatientService,$cookies){
	$scope.isShow=true;
	$scope.list={
		columm1 : true,
		columm2 : true,
		columm3 : true
	};
	var data ={
		// UID : "a75b5a3f-f3c4-4b2b-9eab-95f6a798aacd",
		UID : $cookies.getObject("userInfo").UID,
		attributes: [
			{field:"UID"}
		]
	};
	$scope.aaa;
	PatientService.getPatient(data).then(function(response){
		if(response.message=="Success"){
			$scope.aaa = response;
			$scope.patientUID = response.data[0].UID;
		}
		else
			$scope.patientUID = null;
	},function(err){
		$scope.patientUID = null;
		console.log(err);
	});

	// $scope.listname = {
	// 	header:"Test Table",
	// 	body:[
	// 		{field:"FirstName",name:"First Name",type:"text",value:"Giang"},
	// 		{field:"LastName",name:"Last Name",type:"text",value:"Vo"},
	// 		{field:"DOB",name:"Date of Birth",type:"datetime",value:"25/11/1994"},
	// 		{field:"Gender",name:"Gender",type:"select",value:"M"},
	// 		{field:"checkbox",name:"checkbox1",type:"checkbox",value:"Y"},
	// 		{field:"radioBtn",name:"radioBtn1",type:"radio",value:"Y"}
	// 	]
		
	// };
	// $scope.listfunc = {
	// 	func1 : function(){
	// 		return $scope.aaa;
	// 	},
	// 	func2 : function(){
	// 		var test=1020;
	// 		return test;
	// 	},
	// 	func3 : function(){

	// 	}
	// };
});