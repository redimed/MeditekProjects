var app = angular.module('app.authentication.home.list.controller', []);

app.controller('homeListCtrl', function($scope, $cookies, $state, WAAppointmentService, toastr) {
    $scope.UserRole = $cookies.getObject('userInfo').roles[0].RoleCode;
    $scope.checkRole = false;
    if ($scope.UserRole == 'PATIENT') {
        $scope.checkRole = true;
    };
    $scope.info = {
        data: {
            Limit: 20,
            Offset: 0,
            Filter: [{
                Appointment: {
                    Enable: 'Y',
                    FromTime: null
                }
            }],
            Order: [{
                Appointment: {
                    CreatedDate: 'DESC'
                }
            }]
        }
    };

    $scope.ListTodayConsultation = function(data) {
        if (data == 'todaylist') {
            $state.go("authentication.consultation.listRoleid", {
                roleid: 'roleid'
            });
        } else if (data == 'today') {
            var today = new Date();
            $scope.info.data.Filter[0].Appointment.FromTime = moment(today).format('YYYY-MM-DD 00:00:00 Z');
            console.log("requesr data", $scope.info.data);
            WAAppointmentService.loadListWAAppointmentConsultation($scope.info.data).then(function(response) {
                console.log("response data", response);
                if (response.rows.length != 0) {
                    var dataPost = {
                        UID: response.rows[0].UID,
                        UIDPatient: response.rows[0].Patients[0].UID
                    };
                    $state.go("authentication.consultation.detail", {
                        UID: dataPost.UID,
                        UIDPatient: dataPost.UIDPatient
                    });
                } else {
                    toastr.success('There is no consultation today!');
                }

            });
        } else {
            $state.go("authentication.consultation.list");
        };

    };
    $scope.isDoctor = null;
    var roles = $cookies.getObject('userInfo').roles; 
    for (var i = 0; i < roles.length; i++) {
        if (roles[i].RoleCode === "INTERNAL_PRACTITIONER" || roles[i].RoleCode === "EXTERTAL_PRACTITIONER"){
            $scope.isDoctor = true;         
        }
        if (roles[i].RoleCode === "ADMIN") {
            $scope.isDoctor = false;  
        }
    }
 
    $scope.RosterCalendar = function(){
        var roles = $cookies.getObject('userInfo').roles;        
        var userUID = $cookies.getObject('userInfo').UID;
        console.log("rosterUID", $cookies.getObject('userInfo'))
        for (var i = 0; i < roles.length; i++) {
            if (roles[i].RoleCode === "INTERNAL_PRACTITIONER" || roles[i].RoleCode === "EXTERTAL_PRACTITIONER"){
               
                $state.go("authentication.roster.calendar", {doctorId: userUID});           
            }
            if (roles[i].RoleCode === "ADMIN") {
    
                $state.go("authentication.roster.home", {reload: true});
            }
        }
    }
});
