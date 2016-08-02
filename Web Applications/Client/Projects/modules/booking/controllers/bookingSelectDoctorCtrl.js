var app = angular.module('app.authentication.booking.selectDoctor.controller', [

])

app.controller('bookingSelectDoctorCtrl', function($scope, doctorService,$modalInstance) {
    $scope.paging = {
        doctor:{}
    };
    $scope.display = {
        doctor:{}
    }
    $scope.display.doctor.item = [
        {field:"FirstName",name:"First Name"},
        {field:"LastName",name:"Last Name"},
        {field:"DepartmentName",name:"Department"},
        {field:"UserAccount",name:"Contact Number"}
    ];
    $scope.display.doctor.fieldSort = {
        'FirstName': 'ASC',
        'LastName': 'ASC',
        'DepartmentName': 'ASC',
        'UserAccount': 'ASC'
    };
    $scope.info = {          
        listDoctorTreatingPractitioner: null,
        listDoctorSelected:[]
        
    };
    $scope.loadListDoctor = function(info){

        doctorService.loadlistDoctor(info).then(function(response){
            if(response.message=="success"){
                $scope.info.listDoctorTreatingPractitioner = response.data;
                for(var i = 0; i < response.data.length;i++){
                    $scope.info.listDoctorTreatingPractitioner[i].stt = $scope.searchObjectMap.doctor.offset*1 + i + 1;
                    //Dong bo hien thi voi listDoctorSelected
                    // if($scope.info.listDoctorSelected)
                    // {
                    //     for (var j = 0; j < $scope.info.listDoctorSelected.length; j++) {
                    //         if($scope.info.listDoctorSelected[j].UID == $scope.info.listDoctorTreatingPractitioner[i].UID)
                    //         $scope.info.listDoctorTreatingPractitioner[i].Selected = 'Y';
                    //     }
                    // }
                }
                $scope.paging.doctor.count= response.count;
            }
            else{
                console.log(response.message);
            }
        });
    };

    $scope.searchObject = {};
    $scope.searchObjectMap = {};
    $scope.initListDoctor = function() {
        $scope.searchObject.doctor = {
            limit: 10,
            offset: 0,
            currentPage: 1,
            maxSize: 10,
            attributes:$scope.items,
            Search:{
                RoleAlias: 'Internal'
            },
            order: null,
            RoleID: [5]
        };
        // scope.search.Enable = null;
        $scope.searchObjectMap.doctor = angular.copy($scope.searchObject.doctor);
        $scope.loadListDoctor($scope.searchObjectMap.doctor);
    };

    $scope.paging.doctor.setPage = function() {
        $scope.searchObjectMap.doctor.offset = ($scope.searchObjectMap.doctor.currentPage - 1) * $scope.searchObjectMap.doctor.limit;
        $scope.loadListDoctor($scope.searchObjectMap.doctor);
    };

    $scope.initListDoctor();

    $scope.Search = function(e){
        console.log(">>>>>>>>search");
        if(e==13){
            // scope.searchObjectMap.Search = data;
            console.log("searchObjectMap.doctor", $scope.searchObjectMap.doctor);
            $scope.loadListDoctor($scope.searchObjectMap.doctor);
        }
    };

    $scope.selectDoctor = function(doctor) {
    	$modalInstance.close(doctor);
    };

    $scope.display.doctor.sort = function (field, sort) {
        // alert(field+sort);
        if(sort === 'ASC') {
            $scope.display.doctor.fieldSort[field] = 'DESC';
            sort = 'DESC';
        } else {
            $scope.display.doctor.fieldSort[field] = 'ASC';
            sort = 'ASC';
        }
        if(field =='UserAccount')
            field = 'PhoneNumber';
        if(field=='Role'){
            field = 'RoleName';
        }
        var data = [];
        if(field == 'DepartmentName') data.push('Department');
        if(field == 'PhoneNumber') data.push('UserAccount');
        data.push(field);
        data.push(sort);
        $scope.searchObjectMap.doctor.order = data;
        $scope.loadListDoctor($scope.searchObjectMap.doctor);
    }

})