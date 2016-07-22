var app = angular.module('app.authentication.consultation.TelehealthDetail.directives', []);
app.directive('telehealthDetail', function(doctorService) {
    return {
        scope:{
            runWhenFinish:"="
        },
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/consultationTelehealthDetailDirectives.html",
        controller: function(AuthenticationService, $state, $cookies, WAAppointmentService, toastr, $uibModal, PatientService, CommonService, $stateParams,$scope,$timeout, $uibModal, companyService, consultationServices) {
            o.loadingPage(true);
            $scope.isLinked = false;
            $scope.isShowBtnLink = true;
            $scope.isShowTitle = false;
            $scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];
            $('#medicareExpiry').fdatepicker();
            WAAppointmentService.getDetailWAAppointmentByUid($stateParams.UID).then(function(data) {
                $scope.wainformation = data.data;
                $scope.wainformation.Company = {};
                $scope.wainformation.CompanySite = {};
                runAll()
                o.loadingPage(false);
            }, function(error) {});

            var runAll = function() {
                $timeout(function(){
                    for(var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                        if($scope.wainformation.AppointmentData[i].Name == "GPReferral") {
                            if($scope.wainformation.AppointmentData[i].Value == "Y")
                                $('#gp_referral_Y').attr('checked', 'checked');
                            else
                                $('#gp_referral_N').attr('checked', 'checked');
                        }
                        if($scope.wainformation.AppointmentData[i].Name == "physiotherapy") {
                            if($scope.wainformation.AppointmentData[i].Value == "Y")
                                $('#Physiotherapy').attr('checked', 'checked');
                        }
                        if($scope.wainformation.AppointmentData[i].Name == "handTherapy") {
                            if($scope.wainformation.AppointmentData[i].Value == "Y")
                                $('#Hand_Therapy').attr('checked', 'checked');
                        }
                        if($scope.wainformation.AppointmentData[i].Name == "exerciseRehab") {
                            if($scope.wainformation.AppointmentData[i].Value == "Y")
                                $('#Exercuse_Rehab').attr('checked', 'checked');
                        }
                        if($scope.wainformation.AppointmentData[i].Name == 'Description') {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                $scope.wainformation.Description = $scope.wainformation.AppointmentData[i].Value;
                            }
                        }
                    }
                },0);
                $scope.loadListContry = function() {
                    AuthenticationService.getListCountry().then(function(response) {
                        $scope.ListContry = response.data;
                    })
                }
                $scope.ShowData = {
                    isLinkPatient: false,
                    patient: []
                };

                var checkDateUndefined = function(data) {
                    if (data == ' ' || data == '' || data == undefined) {
                        return false;
                    }
                    return true;
                };
                $scope.loadListContry();
                $scope.submited = false;
                $scope.ViewDoc = function(Url, UID) {
                    var LinkUID = Url + UID;
                    CommonService.downloadFile(UID)
                        .then(function(data) {
                            console.log(data);
                        }, function(er) {
                            console.log(er);
                        })
                }
                console.log("data---->", $scope.wainformation);
                //tannv.dts@gmail.com
                $scope.appointmentData = {};
                for (var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                    var apptData = $scope.wainformation.AppointmentData[i];
                    var key = apptData.Category+"."+apptData.Section+"."+apptData.Type+"."+apptData.Name;
                    $scope.appointmentData[key] = apptData.Value;
                }
                console.log("|||||||||||||||||||||||||||||||| appointmentData : ", $scope.appointmentData);
                //----------------------------------
                $scope.FileUploadImage = []
                $scope.FileUploads = function() {
                    $scope.FileUploadImage = angular.copy($scope.wainformation.FileUploads)
                    if ($scope.wainformation.TelehealthAppointment !== null) {
                        for (var key in $scope.wainformation.TelehealthAppointment.ClinicalDetails) {
                            $scope.FileUploadImage = $scope.FileUploadImage.concat($scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads)
                        }
                    };
                }
                $scope.FileUploads()
                $scope.tab_body_part = 'all';
                $scope.checkRoleUpdate = true;
                for(var i = 0; i < $cookies.getObject('userInfo').roles.length; i++){
                    if ($cookies.getObject('userInfo').roles[i].RoleCode == 'INTERNAL_PRACTITIONER'
                        || $cookies.getObject('userInfo').roles[i].RoleCode == 'ADMIN') {
                        $scope.checkRoleUpdate = false;
                    };
                }
                $scope.Temp = angular.copy($scope.wainformation)
                var ClinicalDetailsTemp = [];
                $scope.loadFuntion = function() {
                    if ($scope.wainformation.Patients.length != 0) {
                        $scope.ShowData.isLinkPatient = true;
                        if (checkDateUndefined($scope.wainformation.Patients[0])) {
                            $scope.ShowData.patient = angular.copy($scope.wainformation.Patients[0]);
                            $scope.ShowData.patient.PhoneNumber = $scope.ShowData.patient.UserAccount.PhoneNumber;
                            $scope.ShowData.patient.MedicareExpiryDate = $scope.ShowData.patient.MedicareExpiryDate!=null?moment($scope.ShowData.patient.MedicareExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY'):null;
                        };
                    } else {
                        if(_.isEmpty($scope.wainformation.TelehealthAppointment) == true) {
                            if($scope.wainformation.PatientAppointments) {
                                $scope.ShowData.patient = angular.copy($scope.wainformation.PatientAppointments[0]);
                                $scope.ShowData.patient.MedicareExpiryDate = $scope.ShowData.patient.MedicareExpiryDate!=null?moment($scope.ShowData.patient.MedicareExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY'):null;
                            }
                        }
                        else {
                            $scope.ShowData.patient = angular.copy($scope.wainformation.TelehealthAppointment.PatientAppointment);
                            $scope.ShowData.patient.MedicareExpiryDate = $scope.ShowData.patient.MedicareExpiryDate!=null?moment($scope.ShowData.patient.MedicareExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY'):null;
                        }
                    }
                    if ($scope.wainformation.TelehealthAppointment != null || $scope.wainformation.TelehealthAppointment != undefined) {
                        $scope.wainformation.TelehealthAppointment.ClinicalDetails = {}
                        $scope.Temp.TelehealthAppointment.ClinicalDetails.forEach(function(valueRes, indexRes) {
                            if (valueRes != null && valueRes != undefined) {
                                var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                                keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                                var keyOther = valueRes.Type + valueRes.Name;
                                if (keyOther != 0) {
                                    keyOther = keyOther.split(" ").join("");
                                }
                                $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail] = {};
                                $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].Value = valueRes.Value;
                                $scope.wainformation.TelehealthAppointment.ClinicalDetails[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                                $scope[valueRes.Name] = 'Yes';
                                if (valueRes.Name == 'OThers' || valueRes.Name == 'Other') {
                                    $scope[keyOther] = 'Yes';
                                }
                            }
                        })
                    };

                }
                $scope.loadFuntion();
                if ($scope.wainformation.TelehealthAppointment !== null) {
                    $scope.info = {
                        apptStatus: WAConstant.apptStatus,
                        listDoctorTreatingPractitioner: null,
                        patientInfomation: ($scope.wainformation.Patients.length != 0) ? $scope.wainformation.Patients : $scope.wainformation.TelehealthAppointment.PatientAppointment,
                        appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('DD/MM/YYYY') : null,
                        appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('HH:mm') : null,
                        MedicareExpiryDate: ($scope.wainformation.TelehealthAppointment.PatientAppointment && $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate != null) ? moment($scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate).format('DD/MM/YYYY') : null,
                        listDoctorTreatingPractitioner: null,
                        selectRadioGender: function() {
                            $scope.wainformation.TelehealthAppointment.PatientAppointment.Gender = "";
                        }
                    }
                } else if ($scope.wainformation.PatientAppointments) {
                    if($scope.wainformation.PatientAppointments.length > 0){
                        $scope.info = {
                            apptStatus: WAConstant.apptStatus,
                            listDoctorTreatingPractitioner: null,
                            patientInfomation: ($scope.wainformation.Patients.length != 0) ? $scope.wainformation.Patients : $scope.wainformation.PatientAppointments[0],
                            appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('DD/MM/YYYY') : null,
                            appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('HH:mm') : null,
                            MedicareExpiryDate: ($scope.wainformation.PatientAppointments && $scope.wainformation.PatientAppointments[0].MedicareExpiryDate != null) ? moment($scope.wainformation.PatientAppointments[0].MedicareExpiryDate).format('DD/MM/YYYY') : null,
                            listDoctorTreatingPractitioner: null,
                            selectRadioGender: function() {
                                $scope.wainformation.PatientAppointments[0].Gender = "";
                            }
                        }
                    }
                }
                else {
                    $scope.info = {
                        apptStatus: WAConstant.apptStatus,
                        listDoctorTreatingPractitioner: null,
                        appointmentDate: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('DD/MM/YYYY') : null,
                        appointmentTime: ($scope.wainformation.FromTime != null) ? moment($scope.wainformation.FromTime).format('HH:mm') : null,
                        listDoctorTreatingPractitioner: null,
                    }
                };

                /*$scope.loadAllDoctor = function() {
                    WAAppointmentService.ListDoctor().then(function(data) {
                        $scope.info.listDoctorTreatingPractitioner = data;
                    });
                }

                $scope.loadAllDoctor();
*/
                //Tannv.dts@gmail.com------------------------------------------------------------------
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

                $scope.loadListDoctor = function(info){
                    doctorService.loadlistDoctor(info).then(function(response){
                        if(response.message=="success"){
                            $scope.info.listDoctorTreatingPractitioner = response.data;
                            for(var i = 0; i < response.data.length;i++){
                                $scope.info.listDoctorTreatingPractitioner[i].stt = $scope.searchObjectMap.doctor.offset*1 + i + 1;
                                //Dong bo hien thi voi listDoctorSelected
                                if($scope.info.listDoctorSelected)
                                {
                                    for (var j = 0; j < $scope.info.listDoctorSelected.length; j++) {
                                        if($scope.info.listDoctorSelected[j].UID == $scope.info.listDoctorTreatingPractitioner[i].UID)
                                        $scope.info.listDoctorTreatingPractitioner[i].Selected = 'Y';
                                    }
                                }
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
                            RoleAlias: 'Internal',
                            Enable: 'Y'
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
                
                //-----------------------group doctor
                $scope.info.listDoctorGroup = [];
                $scope.paging.doctorGroup = {
                    count: null
                }
                $scope.display.doctorGroup = {
                    fieldSort: {
                        'GroupName': 'ASC',
                        'Enable':' ASC'
                    }
                }
                function loadlistDoctorGroup(data) {
                    doctorService.loadlistGroup(data)
                    .then(function(response){
                        for (var i = 0; i < response.rows.length; i++) {
                            response.rows[i].stt = $scope.searchObjectMap.doctorGroup.offset*1 + i +1;
                            response.rows[i].DoctorsName = '';
                            for(var j = 0; j < response.rows[i].Doctors.length; j ++) {
                                var d = response.rows[i].Doctors[j];
                                if( response.rows[i].Doctors[j].Enable === "Y"){
                                response.rows[i].DoctorsName = response.rows[i].DoctorsName + d.FirstName + ' ' + d.LastName + (j<response.rows[i].Doctors.length-1?', ':'');
                                }
                            }
                        }
                        $scope.info.listDoctorGroup = response.rows;
                        console.log("List Doctor Group",$scope.info.listDoctorGroup);
                        $scope.paging.doctorGroup.count =  response.count;
                    },function(err){
                        console.log('err ', err);
                    })
                }

                $scope.initDoctorGroup = function() {
                    $scope.searchObject.doctorGroup = {
                        limit: 10,
                        offset: 0,
                        currentPage: 1,
                        maxSize: 10,
                        search: {},
                        order: null,
                        include: {
                            Doctor: ['UID', 'FirstName', 'LastName'],
                            Department: ['DepartmentName']
                        }
                    }
                    $scope.searchObjectMap.doctorGroup = angular.copy($scope.searchObject.doctorGroup);
                    loadlistDoctorGroup($scope.searchObjectMap.doctorGroup);
                }
                $scope.initDoctorGroup();

                $scope.paging.doctorGroup.setPage = function() {
                    $scope.searchObjectMap.doctorGroup.offset = ($scope.searchObjectMap.doctorGroup.currentPage -1) * $scope.searchObjectMap.doctorGroup.limit;
                    loadlistDoctorGroup($scope.searchObjectMap.doctorGroup);
                }

                $scope.display.doctorGroup.sort = function(field, sort) {
                    if(sort==='ASC') {
                        $scope.display.doctorGroup.fieldSort[field] = 'DESC';
                    } else {
                        $scope.display.doctorGroup.fieldSort[field] = 'ASC';
                    }
                    var data = field + ' ' + sort;
                    $scope.searchObjectMap.doctorGroup.order = data;
                    loadlistDoctorGroup($scope.searchObjectMap.doctorGroup);
                }
                $scope.paging.doctorGroup.Search = function(e) {
                    if(e==13) {
                        loadlistDoctorGroup($scope.searchObjectMap.doctorGroup);
                    }
                }

                //selected doctor --------------------------------------------------------------
                $scope.info.listDoctorSelected = [
                    // {UID:'aa13', Name:'Nguyen Van Minh', DepartmentName:'Business Department'},
                    // {UID:'bb24', Name:'Tran Van Khuong', DepartmentName:'Information Technology'}
                ]
                $scope.action = {};
                $scope.action.doctor={
                    selectedDoctor: function(doctor){
                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>", doctor);
                        if(doctor.Selected=='Y')
                        {
                            console.log("sajfioasjoifjasoifjaosifjoaisjoaisjfsaoijsi")
                            //Push vao listDoctorSelected
                            var d = {
                                UID: doctor.UID,
                                Name: doctor.FirstName + ' ' + doctor.LastName,
                                DepartmentName: doctor.Department?doctor.Department.DepartmentName:null,
                            }
                            $scope.info.listDoctorSelected.push(d);
                        } else {
                            //Remove tu listDoctorSelected
                            for(var i = 0; i < $scope.info.listDoctorSelected.length; i++) {
                                if($scope.info.listDoctorSelected[i].UID == doctor.UID) {
                                    $scope.info.listDoctorSelected.splice(i, 1);
                                    break;
                                }
                            }
                        }

                    }
                }
                $scope.action.doctorsSelected = {
                    removeDoctor: function (doctor, index) {
                        for (var i = 0; i < $scope.info.listDoctorTreatingPractitioner.length; i++) {
                            if($scope.info.listDoctorTreatingPractitioner[i].UID == doctor.UID) {
                                $scope.info.listDoctorTreatingPractitioner[i].Selected = 'N';
                                break;
                            }
                        }
                        $scope.info.listDoctorSelected.splice(index, 1);

                    }
                }

                $scope.action.doctorGroup = {
                    selectDoctorFromGroup: function (doctorGroup) {
                        //Loop cac doctor trong group
                        for(var i = 0; i < doctorGroup.Doctors.length; i++) {
                            console.log("Doctors ",doctorGroup.Doctors[i])
                            if(doctorGroup.Doctors[i].Enable === 'Y') {
                                var d = {
                                    UID: doctorGroup.Doctors[i].UID,
                                    Name: doctorGroup.Doctors[i].FirstName  + ' ' + doctorGroup.Doctors[i].LastName,
                                    DepartmentName: doctorGroup.Doctors[i].Department?doctorGroup.Doctors[i].Department.DepartmentName:null,
                                    GroupID: doctorGroup.ID,
                                    GroupName: doctorGroup.GroupName
                                }
                                //Kiem tra xem doctor co ton tai trong listDoctorSelected  hay khong
                                var exist = false;
                                console.log("$scope.info.listDoctorSelected", $scope.info.listDoctorSelected);
                                for (var j = 0; j< $scope.info.listDoctorSelected.length; j++) {
                                    if(d.UID == $scope.info.listDoctorSelected[j].UID)
                                    {
                                        exist = true;
                                        $scope.info.listDoctorSelected[j].GroupID = doctorGroup.ID;
                                        $scope.info.listDoctorSelected[j].GroupName = doctorGroup.GroupName;
                                        break;
                                    }
                                }
                                if(!exist)
                                {
                                    $scope.info.listDoctorSelected.push(d);
                                }
                                //Dong bo hoa hien thi voi listDoctorTreatingPractitioner
                                for( var j = 0; j < $scope.info.listDoctorTreatingPractitioner.length; j++) {
                                    if (d.UID == $scope.info.listDoctorTreatingPractitioner[j].UID)
                                    {
                                        $scope.info.listDoctorTreatingPractitioner[j].Selected = 'Y';
                                    }
                                }
                            }
                        }
                        toastr.success("Selected list doctors!", "success");
                    }
                }

                $scope.initListDoctorSelected = function ()
                {
                    if ($scope.wainformation.Doctors) {
                        for (var i = 0; i < $scope.wainformation.Doctors.length; i++) {
                            var d = {
                                UID: $scope.wainformation.Doctors[i].UID,
                                Name: $scope.wainformation.Doctors[i].FirstName + ' ' + $scope.wainformation.Doctors[i].LastName,
                                DepartmentName: $scope.wainformation.Doctors[i].Department?
                                                $scope.wainformation.Doctors[i].Department.DepartmentName:null
                            }
                            $scope.info.listDoctorSelected.push(d);
                            if($scope.info.listDoctorTreatingPractitioner)
                            {
                                for(var j = 0; j < $scope.info.listDoctorTreatingPractitioner.length; j++) {
                                    if (d.UID == $scope.info.listDoctorTreatingPractitioner[j].UID) {
                                        $scope.info.listDoctorTreatingPractitioner[j].Selected = 'Y';
                                    }
                                }
                            }

                        }
                    }
                }
                $scope.initListDoctorSelected();
                //tannv.dts@gmail.com comment
                /*$scope.selectTreatingPractitioner = function(data) {
                    WAAppointmentService.getDoctorById({
                        UID: data
                    }).then(function(data) {
                        $scope.wainformation.Doctors[0] = data[0];
                        toastr.success("Select doctor successfully", "Success");
                    })
                }*/
                //--------------------------------------------------------------------------------------------------------------------------------


                
                
                $scope.ClinicalDetails = function() {
                    if($scope.wainformation.TelehealthAppointment){
                        for (var key in $scope.wainformation.TelehealthAppointment.ClinicalDetails) {
                            var newkey = key.split("__").join(" ");
                            var res = newkey.split(".");
                            var keyOtherRequest = res[2] + res[3];
                            keyOtherRequest = keyOtherRequest.split(" ").join("");
                            if ($scope[keyOtherRequest] != undefined) {
                                if ($scope[keyOtherRequest] == 'Yes') {
                                    var object = {
                                        Section: res[0],
                                        Category: res[1],
                                        Type: res[2],
                                        Name: res[3],
                                        Value: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                                        FileUploads: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                                    }
                                }
                            } else {
                                var object = {
                                    Section: res[0],
                                    Category: res[1],
                                    Type: res[2],
                                    Name: res[3],
                                    Value: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].Value,
                                    FileUploads: $scope.wainformation.TelehealthAppointment.ClinicalDetails[key].FileUploads
                                }
                            }
                            var isExist = false;

                            ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                                if (valueTemp !== undefined) {
                                    if (valueTemp.Section == object.Section &&
                                        valueTemp.Category == object.Category &&
                                        valueTemp.Type == object.Type &&
                                        valueTemp.Name == object.Name) {
                                        isExist = true;
                                    }
                                } else {
                                    isExist = true;
                                };

                            })
                            if (!isExist) {
                                ClinicalDetailsTemp.push(object);
                            };
                        };
                        var countCliniDetail = 0;
                        ClinicalDetailsTemp.forEach(function(value, key) {
                            if (value !== undefined) {
                                if (value.Value != 'N' && value.Value != null) {
                                    countCliniDetail++;
                                };
                            };
                        })
                        if (countCliniDetail == 0) {
                            ClinicalDetailsTemp = [];
                        }
                        $scope.wainformation.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp;
                    }
                }
                $scope.saveWaAppointment = function() {
                    var doctoruid;
                    $scope.ValidateData();
                    $scope.ClinicalDetails();
                    console.log("saveWaAppointment",$scope.wainformation);
					if(!_.isEqual($scope.ShowData.patient, $scope.wainformation.PatientAppointments[0])) {
                        $scope.wainformation.PatientAppointment = angular.copy($scope.ShowData.patient);
                        console.log($scope.wainformation.PatientAppointment);
                        if($scope.wainformation.PatientAppointment.MedicareExpiryDate && $scope.wainformation.PatientAppointment.MedicareExpiryDate != ''){
                            if($scope.wainformation.PatientAppointment.MedicareExpiryDate != null){
                                $scope.wainformation.PatientAppointment.MedicareExpiryDate = moment('01/'+$scope.wainformation.PatientAppointment.MedicareExpiryDate+' 00:00:00','DD/MM/YYYY HH:mm:ss Z').format('YYYY-MM-DD hh:mm:ss Z');
                            }
                        }
                        else {
                            $scope.wainformation.PatientAppointment.MedicareExpiryDate = null;
                        }
                    }

                    if($scope.wainformation.PatientAppointments) {
                        if($scope.wainformation.Patients && $scope.wainformation.Patients.length > 0) {
                            delete $scope.wainformation['Patients'];
                        }

                        //Tanv.dts@gmail.com comment
                        /*if($scope.wainformation.Doctors && $scope.wainformation.Doctors.length > 0) {
                            for(var i = 0; i < $scope.wainformation.Doctors.length; i++) {
                                doctoruid = $scope.wainformation.Doctors[i].UID;
                                $scope.wainformation.Doctors.splice(0,1);
                                $scope.wainformation.Doctors.push({UID:doctoruid});
                            }
                        }*/
                        WAAppointmentService.updateWaAppointmentwithCompany($scope.wainformation).then(function(data) {
                            toastr.success("Update appointment successfully !");
                            swal.close();
                            if ($scope.runWhenFinish) {
                                $scope.runWhenFinish.success();
                            }
                        }, function(err) {
                            if (err.status == 401) {
                                swal.close();
                            } else {
                                swal.close();
                                toastr.error('Update Appointment Failed');
                                if ($scope.runWhenFinish) {
                                    $scope.runWhenFinish.success();
                                }
                            }
                        });
                    }
                    else {
                        if($scope.wainformation.Patients && $scope.wainformation.Patients.length > 0) {
                            delete $scope.wainformation['Patients'];
                        }
                        //tannv.dts@gmail.com comment
                        /*if($scope.wainformation.Doctors && $scope.wainformation.Doctors.length > 0) {
                            for(var i = 0; i < $scope.wainformation.Doctors.length; i++) {
                                doctoruid = $scope.wainformation.Doctors[i].UID;
                                $scope.wainformation.Doctors.splice(0,1);
                                $scope.wainformation.Doctors.push({UID:doctoruid});
                            }
                        }*/
                        WAAppointmentService.updateWaAppointment($scope.wainformation).then(function(data) {
                            toastr.success("Update appointment successfully !");
                            swal.close();
                            if ($scope.runWhenFinish) {
                                $scope.runWhenFinish.success();
                            }
                        }, function(err) {
                            if (err.status == 401) {
                                swal.close();
                            } else {
                                swal.close();
                                toastr.error('Update Appointment Failed');
                                if ($scope.runWhenFinish) {
                                    $scope.runWhenFinish.success();
                                }
                            }
                        });
                    }
                }
                $scope.ValidateData = function() {
                    if($scope.wainformation.TelehealthAppointment != null && $scope.wainformation.TelehealthAppointment != ''){
                        if (!$scope.wainformation.TelehealthAppointment && !$scope.wainformation.TelehealthAppointment.PatientAppointment && !$scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible) {
                            if ($scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareEligible == 'N') {
                                $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareNumber = null;
                                $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareReferenceNumber = null;
                                $scope.info.MedicareExpiryDate = null;
                                $scope.wainformation.TelehealthAppointment.PatientAppointment.DVANumber = null;
                            };
                        };
                        if ($scope.wainformation.TelehealthAppointment.WAAppointment !== null && !$scope.wainformation.TelehealthAppointment) {
                            if (!$scope.wainformation.TelehealthAppointment.WAAppointment.IsUsualGP) {
                                if ($scope.wainformation.TelehealthAppointment.WAAppointment.IsUsualGP == 'Y') {
                                    $scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPName = null;
                                    $scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPContactNumber = null;
                                    $scope.wainformation.TelehealthAppointment.WAAppointment.UsualGPFaxNumber = null;
                                };
                            };
                        };
                        console.log("$scope.wainformation.FromTime",$scope.info.appointmentDate)
                        if ($scope.info.appointmentDate != null && $scope.info.appointmentDate != '') {
                            var Time = moment($scope.info.appointmentTime, ["HH:mm:ss A"]).format("HH:mm:ss");
                            var appointmentDateTime = $scope.info.appointmentDate + ' ' + Time;
                            $scope.wainformation.FromTime = moment(appointmentDateTime, "DD/MM/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z');
                        } else {
                            $scope.wainformation.FromTime = null;
                        };
                        if ($scope.info.MedicareExpiryDate != null && $scope.info.MedicareExpiryDate != '') {
                            $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate = moment($scope.info.MedicareExpiryDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z');
                        } else {
                            if ($scope.wainformation.TelehealthAppointment.PatientAppointment == null) {
                                $scope.wainformation.TelehealthAppointment.PatientAppointment = {}
                            };
                            $scope.wainformation.TelehealthAppointment.PatientAppointment.MedicareExpiryDate = null
                        };
                        if ($scope.wainformation.TelehealthAppointment.PatientAppointment.InterpreterRequired == 'N') {
                            $scope.wainformation.TelehealthAppointment.PatientAppointment.InterpreterLanguage = null;
                        };
                    }
                    else if ($scope.wainformation.PatientAppointments != null && $scope.wainformation.PatientAppointments.length > 0) {
                        if (!$scope.wainformation.PatientAppointments && !$scope.wainformation.PatientAppointments[0].MedicareEligible) {
                            if ($scope.wainformation.PatientAppointments[0].MedicareEligible == 'N') {
                                $scope.wainformation.PatientAppointments[0].MedicareNumber = null;
                                $scope.wainformation.PatientAppointments[0].MedicareReferenceNumber = null;
                                $scope.info.MedicareExpiryDate = null;
                                $scope.wainformation.PatientAppointments[0].DVANumber = null;
                            };
                        }
                        console.log("$scope.wainformation.FromTime",$scope.info.appointmentDate)
                        if ($scope.info.appointmentDate != null && $scope.info.appointmentDate != '') {
                            var Time = moment($scope.info.appointmentTime, ["HH:mm:ss A"]).format("HH:mm:ss");
                            var appointmentDateTime = $scope.info.appointmentDate + ' ' + Time;
                            $scope.wainformation.FromTime = moment(appointmentDateTime, "DD/MM/YYYY HH:mm:ss Z").format('YYYY-MM-DD HH:mm:ss Z');
                        } else {
                            $scope.wainformation.FromTime = null;
                        };
                        if ($scope.ShowData.patient.MedicareExpiryDate != null && $scope.ShowData.patient.MedicareExpiryDate != '') {
                            // $scope.wainformation.PatientAppointments[0].MedicareExpiryDate = moment($scope.info.MedicareExpiryDate, "DD/MM/YYYY").format('YYYY-MM-DD HH:mm:ss Z');
                        } else {
                            if ($scope.wainformation.PatientAppointments.length == 0) {
                                $scope.wainformation.PatientAppointments.push({});
                            };
                            $scope.wainformation.PatientAppointments[0].MedicareExpiryDate = null
                        };
                        if ($scope.wainformation.PatientAppointments[0].InterpreterRequired == 'N') {
                            $scope.wainformation.PatientAppointments[0].InterpreterLanguage = null;
                        };
                    }
                }
                $scope.CheckValidation = function() {
                    var stringAlert = null
                    if ($scope.info.appointmentDate !== null) {
                        if ($scope.info.appointmentTime !== null) {
                            if ($scope.wainformation.Patients.length > 0) {
                                if ($scope.wainformation.Doctors.length > 0) {
                                    stringAlert = null;
                                } else {
                                    stringAlert = "Please Choose Treating Practitioner";
                                };
                            } else {
                                stringAlert = "Please Link Patients";
                            };
                        } else {
                            stringAlert = "Please Choose Appointment Time";
                        };
                    } else {
                        stringAlert = "Please Choose Appointment Date";
                    };
                    return stringAlert
                }
                $scope.close = function() {
                    $modalInstance.close();
                };
                $scope.showImage = function(UID) {
                    var LinkUID = UID;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'showImageTemplate',
                        controller: 'showImageController',
                        windowClass: 'app-modal-window-full',
                        resolve: {
                            LinkUID: function() {
                                return LinkUID;
                            }
                        }
                    });
                    modalInstance.result.then(function(data) {
                        $modalInstance.close('err');
                    });
                };

                $scope.selectPatient = function() {
                    var info = {};
                    for(var key in $scope.ShowData.patient) {
                        if(key == 'FirstName') {
                            info[key] = $scope.ShowData.patient[key];
                        }
                        else if (key == 'LastName') {
                            info[key] = $scope.ShowData.patient[key];
                        }
                        else if (key == 'LastName') {
                            info[key] = $scope.ShowData.patient[key];
                        }
                        else if (key == 'Gender') {
                            info[key] = $scope.ShowData.patient[key];
                        }
                        else if (key == 'Email1') {
                            info[key] = $scope.ShowData.patient[key];
                        }
                        else if (key == 'PhoneNumber') {
                            info['UserAccount'] = $scope.ShowData.patient[key];
                        }
                    }
                    console.log("?????? hehe");
                    var PatientAppointment = angular.copy($scope.ShowData.patient)
                    var postData = {
                        "data": {
                            "Title": PatientAppointment.Title,
                            "FirstName": PatientAppointment.FirstName,
                            "MiddleName": PatientAppointment.MiddleName,
                            "LastName": PatientAppointment.LastName,
                            "DOB": PatientAppointment.DOB,
                            "Gender": PatientAppointment.Gender,
                            "Address1": PatientAppointment.Address1,
                            "HomePhoneNumber": PatientAppointment.HomePhoneNumber,
                            "PhoneNumber": PatientAppointment.PhoneNumber,
                            "WorkPhoneNumber": PatientAppointment.WorkPhoneNumber,
                            "Suburb": PatientAppointment.Suburb,
                            "Postcode": PatientAppointment.Postcode,
                            "State": PatientAppointment.State,
                            "Email1": PatientAppointment.Email1,
                            "Email2": PatientAppointment.Email2,
                            "Address2": PatientAppointment.Address2,
                            "FaxNumber": PatientAppointment.FaxNumber,
                            "Indigenous": PatientAppointment.Indigenous,
                            "InterpreterLanguage": PatientAppointment.InterpreterLanguage,
                            "InterpreterRequired": PatientAppointment.InterpreterRequired,
                            "MaritalStatus": PatientAppointment.MaritalStatus,
                            "OtherSpecialNeed": PatientAppointment.OtherSpecialNeed,
                            "PreferredName": PatientAppointment.PreferredName,
                            "PreviousName": PatientAppointment.PreviousName,
                            "CountryID2": PatientAppointment.CountryOfBirth
                        },
                        "otherData": {
                            "PatientKin": {
                                "FirstName": PatientAppointment.FirstName,
                                "LastName": PatientAppointment.LastName,
                                "Relationship": PatientAppointment.PatientKinRelationship
                            },
                            "PatientMedicare": {
                                "MedicareEligible": PatientAppointment.MedicareEligible,
                                "MedicareNumber": PatientAppointment.MedicareNumber,
                                "MedicareReferenceNumber": PatientAppointment.MedicareReferenceNumber,
                                "MedicareExpiryDate": PatientAppointment.MedicareExpiryDate
                            },
                            "PatientDVA": {
                                "DVANumber": PatientAppointment.DVANumber
                            }
                        }
                    }
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: '../modules/appointment/views/appointmentSelectPatientModal.html',
                        controller: function($scope, $modalInstance) {
                            $scope.info = info;
                            $scope.patient = {
                                runIfSuccess: function(data) {
                                    $modalInstance.close({
                                        status: 'success',
                                        data: data
                                    });
                                },
                                runIfClose: function() {
                                    $modalInstance.close();
                                }
                            };
                        },
                        windowClass: 'app-modal-window',
                        resolve: {
                            patientInfo: function() {
                                function postDatatoService(postData, callback) {
                                    for(var i = 0;i < $scope.wainformation.AppointmentData.length; i++) {
                                        if($scope.wainformation.AppointmentData[i].Name == "SiteIDRefer") {
                                            postData.data.SiteIDRefer = $scope.wainformation.AppointmentData[i].Value;
                                        }
                                        else if($scope.wainformation.AppointmentData[i].Name == "SiteID") {
                                            postData.data.SiteID = $scope.wainformation.AppointmentData[i].Value;
                                        }
                                        else if($scope.wainformation.AppointmentData[i].Name == "PatientSignatureID") {
                                            postData.data.PatientSignatureID = $scope.wainformation.AppointmentData[i].Value;
                                        }
                                        else if($scope.wainformation.AppointmentData[i].Name == "PatientSignatureUID") {
                                            postData.data.PatientSignatureUID = $scope.wainformation.AppointmentData[i].Value;
                                        }
                                    }
                                    callback();
                                };
                                postDatatoService(postData,function() {
                                    PatientService.postDatatoDirective(postData);
                                });
                            }
                        }
                    });
                    modalInstance.result.then(function(data) {
                        if (data && data.status == 'success') {
                            $scope.info.isLinkPatient = true;
                            var patientUid = data.data.UID;
                            WAAppointmentService.GetDetailPatientByUid({
                                UID: patientUid
                            }).then(function(data) {
                                if (data.message == 'success') {

                                    console.log('patientInfomation', data.data[0]);
                                    console.log('$scope.wainformation.Patients', $scope.wainformation.Patients);
                                    $scope.ShowData.isLinkPatient = true;
                                    $scope.isShowTitle = true;
                                    $scope.ShowData.patient = data.data[0];
                                    $scope.ShowData.patient.PhoneNumber = data.data[0].UserAccount.PhoneNumber;
                                    $scope.wainformation.Patients = [];
                                    function loopArray(arr, objName, callback) {
                                        var ishaveCompany = false;
                                        var data = {};
                                        for(var i = 0; i < arr.length; i++) {
                                            for(var key in objName) {
                                                if(arr[i].Name == objName[key]) {
                                                    if(arr[i].Value != null && arr[i].Value != ''){
                                                        ishaveCompany = true;
                                                        data[key] = arr[i].Value;
                                                    }
                                                }
                                            }
                                        }
                                        callback(ishaveCompany, data);
                                    }
                                    WAAppointmentService.linkPatient({
                                        Appointment: {
                                           UID: $scope.wainformation.UID
                                       },
                                       Patient: {
                                           UID: patientUid
                                       }

                                    })
                                    .then(function(result) {
                                        if(result == 'success') {
                                            $scope.isLinked = true;
                                            $scope.wainformation.Patients.push({UID:patientUid});
                                            
                                            var p1 = new Promise(function(a, b) {
                                                loopArray($scope.wainformation.AppointmentData, {CompanyName:'CompanyName'}, function(isExist) {
                                                    console.log(isExist);
                                                    if(isExist == false) {
                                                        $scope.wainformation.Company = data.data[0].Companies[0];
                                                    }
                                                });
                                            });

                                            var p2 = new Promise(function(a, b) {
                                                loopArray($scope.wainformation.AppointmentData, {
                                                    PatientSignatureUID:'PatientSignatureUID',
                                                    PatientSignatureID:'PatientSignatureID'}, function(isExist, data) {
                                                    console.log(isExist);
                                                    if(isExist == true) {
                                                        console.log("data ",data);
                                                        PatientService.updateSignature({Signature:data.PatientSignatureID,FileUID:data.PatientSignatureUID,PatientUID:patientUid})
                                                        .then(function(result) {
                                                            console.log("result ",result);
                                                        }, function(err) {
                                                            console.log("err ",err);
                                                        })
                                                    }
                                                });
                                            });

                                            var p3 = new Promise(function(a, b) {
                                                PatientService.updateEFormAppointment({PatientUID: patientUid,ApptUID: $stateParams.UID})
                                                .then(function(result) {
                                                    console.log("result eform ",result)
                                                },function(err) {
                                                    console.log(err)
                                                });
                                            });

                                            Promise.all([p1,p2])
                                            .then(function(values) {
                                                toastr.success("Select patient successfully!", "success");
                                            });
                                        }
                                    },function(err) {
                                        console.log(err);
                                    });
                                };
                            })
                        };
                    });
                };
                $scope.submitUpdate = function() {
                    $scope.wainformation.Doctors = [];
                    for (var i = 0; i < $scope.info.listDoctorSelected.length; i ++)
                    {
                        $scope.wainformation.Doctors.push({UID: $scope.info.listDoctorSelected[i].UID});
                    }
                    $scope.submited = true;
                    if ($scope.userForm.$valid) {
                        var stringAlert = null;
                        if ($scope.wainformation.Status == 'Approved' || $scope.wainformation.Status == 'Attended' || $scope.wainformation.Status == 'Waitlist' || $scope.wainformation.Status == 'Finished') {
                            stringAlert = $scope.CheckValidation();
                        };
                        if ($scope.info.appointmentDate != null && $scope.info.appointmentDate != '' || $scope.info.appointmentTime != null && $scope.info.appointmentTime != '') {
                            stringAlert = $scope.CheckValidation();
                        };
                        if (stringAlert == null) {
                            swal({
                                    title: "Are you sure ?",
                                    text: "Update Appointment",
                                    type: "info",
                                    showCancelButton: true,
                                    closeOnConfirm: false,
                                    showLoaderOnConfirm: true,
                                },
                                function() {
                                    $scope.saveWaAppointment();
                                });
                        } else {
                            toastr.error(stringAlert);
                        };
                    } else {
                        console.log($scope.userForm.$valid);
                        toastr.error("Please check input data");
                    }
                };

                $timeout(function(){
                  $.uniform.update();
                },0);
            }

            $scope.openCalendar = function(){
                //var PatientAppointment = $scope.wainformation.TelehealthAppointment.PatientAppointment;
                modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modules/onsite/views/onsiteCalendar.html',
                    controller: 'onsiteCalendarCtrl',
                    windowClass: 'app-modal-window',
                        // size: 'lg',
                    resolve: {
                        getItem: function() {
                            return $scope.wainformation.Patients[0];
                        },
                        bookingType:function(){
                            return "Telehealth";
                        },
                        appDate:function(){
                            return $scope.info.appointmentDate;
                        },
                        appTime:function(){
                            return $scope.info.appointmentTime;
                        }
                    },
                });
            };

            $scope.removeAppointment = function(){
                swal({
                    title: 'Are you sure?',
                    text: 'Appointment you want to delete!!!',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    allowOutsideClick: false,
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, function(){
                    swal("Deleted!", "Your Appointment has been deleted.", "success");
                    var UID = $scope.wainformation.UID;
                    WAAppointmentService.removeWAAppointmentByUid({UID:UID})
                        .then(function(response){
                            $state.go('authentication.WAAppointment.list', {}, {reload: true});
                        },function(err){
                            
                        })
                })
            }

            $scope.type_of_treatment = ['physiotherapy','exerciseRehab','handTherapy'];
            $scope._onChangeChecked = function(id, list_id) {
                var filterArr;
                if(list_id.length != 0) {
                    list_id = list_id.filter(function(el) { return el != id; });
                }
                if($scope.wainformation) {
                    for(var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                        if($scope.wainformation.AppointmentData[i].Name == id) {
                            $scope.wainformation.AppointmentData[i].Value = 'Y';
                        }
                        for(var j = 0; j < list_id.length; j++) {
                            if($scope.wainformation.AppointmentData[i].Name == list_id[j]) {
                                $scope.wainformation.AppointmentData[i].Value = 'N';
                            }
                        }
                    }
                }
            };

            $scope.setValue = function(value, name) {
                if($scope.wainformation) {
                    for(var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                        if($scope.wainformation.AppointmentData[i].Name == name) {
                            $scope.wainformation.AppointmentData[i].Value = value;
                        }
                    }
                }
            }

            $("#gp_referral_Y").click(function(){
                var value = $("#gp_referral_Y").val();
                $scope.setValue(value,'GPReferral');
            });

            $("#gp_referral_N").click(function(){
                var value = $("#gp_referral_N").val();
                $scope.setValue(value,'GPReferral');
            });

            $scope.linkcompany = function() {
                if($scope.wainformation.Patients && $scope.wainformation.Patients.length > 0){
                    console.log($scope.wainformation.Patients[0]);
                    var patientuid = $scope.wainformation.Patients[0].UID;
                    console.log('$scope.wainformation ',$scope.wainformation);
                    var companyinfo = {
                        CompanyName: $scope.wainformation.Company?$scope.wainformation.Company.CompanyName:null,
                        Description: $scope.wainformation.Company?$scope.wainformation.Company.Description:null,
                        CompanySiteSiteName: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.SiteName:null,
                        CompanySiteAddress1: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.Address1:null,
                        CompanySiteAddress2: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.Address2:null,
                        CompanySiteSuburb  : $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.Suburb:null,
                        CompanySitePostcode: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.Postcode:null,
                        CompanySiteCountry : $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.Country:null,
                        CompanySiteState   : $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.State:null,
                        CompanySiteContactName: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.ContactName:null,
                        CompanySiteHomePhoneNumber: $scope.wainformation.CompanySite?$scope.wainformation.CompanySite.HomePhoneNumber:null,
                    };
                    var returnData;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'LinkCompanyModal',
                        controller: function($scope,$modalInstance){
                            $scope.patientuid  = patientuid;
                            $scope.info = companyinfo;
                            $scope.cancel = function(data){
                                console.log("link success ",data);
                                returnData = data;
                                toastr.success('link company success');
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        // size: 'lg',
                        windowClass: 'app-modal-window'
                    }).result.finally(function(){
                        if(returnData) {
                            companyService.getDetailSite({model: 'CompanySite',whereClause: {ID:returnData.site}, getCompany: false})
                            .then(function(result) {
                                console.log(result);
                                $scope.wainformation.CompanySite = result.data;
                                $scope.wainformation.Company = returnData.company;
                                var Site = $scope.wainformation.AppointmentData.filter(function(el) {return el.Name == 'SiteID'});
                                if(Site.length > 0) {
                                    for(var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                                        if($scope.wainformation.AppointmentData[i].Name == 'SiteID') {
                                            $scope.wainformation.AppointmentData[i].Value = returnData.site;
                                        }
                                    }
                                }
                                else {
                                    $scope.wainformation.AppointmentData.push({
                                        Name: 'SiteID',
                                        Value: returnData.site,
                                        Section: 'Telehealth',
                                        Category: 'Appointment',
                                        Type: 'RequestPatient',
                                        Note:null,
                                        Description:null,

                                    });
                                }
                            },function(err) {
                                console.log(err);
                            });
                            // console.log("returnData ",returnData);
                            // $scope.wainformation.Company = returnData;
                            // console.log($scope.wainformation.Patients);
                        }
                    });
                }
            };

            $scope.changeValue = function(Name) {
                for(var i = 0;i < $scope.wainformation.AppointmentData.length; i++) {
                    if($scope.wainformation.AppointmentData[i].Name == Name) {
                        $scope.wainformation.AppointmentData[i].Value = $scope.wainformation[Name];
                    }
                }
            };

            $scope.getSiteFromAppData = function() {

                var iscomp = false;
                var nocompany = false;
                if(!$scope.wainformation.Patients || $scope.wainformation.Patients.length == 0)
                    nocompany = true;
                else {
                    if(!$scope.wainformation.Patients[0].Companies || $scope.wainformation.Patients[0].Companies.length == 0)
                        nocompany = true;
                    else {
                        function loopArray(arr, callback) {
                            var ishaveCompany = false;
                            for(var i = 0; i < arr.length; i++) {
                                if(arr[i].Name == 'CompanyName') {
                                    if(arr[i].Value != null && arr[i].Value != ''){
                                        ishaveCompany = true;
                                    }
                                }
                                if(arr[i].Name == 'SiteID') {
                                    nocompany = true;
                                }
                            }
                            callback(ishaveCompany);
                        }
                        loopArray($scope.wainformation.AppointmentData, function(isExist) {
                            if(isExist == false)
                                $scope.wainformation.Company = $scope.wainformation.Patients[0].Companies[0];
                        });
                    }
                }


                function getDetailSite(whereClause , getCompany) {
                    companyService.getDetailSite({model: 'CompanySite',whereClause: whereClause, getCompany: getCompany})
                    .then(function(result) {
                        console.log(result);
                        result.data.Country = parseInt(result.data.Country);
                        $scope.wainformation.CompanySite = result.data;
                        if(result.company) {
                            $scope.wainformation.Company = result.company;
                        }
                    },function(err) {
                        console.log(err);
                    });
                }

                function getDetailChild(compuid) {
                    o.loadingPage(true);
                    companyService.getDetailChild({UID:compuid,model:"CompanySites",limit:1,order:[['CreatedDate','ASC']]})
                    .then(function(result) {
                        console.log(result);
                        $scope.wainformation.CompanySite = result.data[0];
                        o.loadingPage(false);
                    },function(err) {
                        console.log(err);
                    });
                }

                if($scope.wainformation.AppointmentData && $scope.wainformation.AppointmentData.length > 0) {
                    for(var i = 0; i < $scope.wainformation.AppointmentData.length; i++) {
                        if($scope.wainformation.AppointmentData[i].Name == 'SiteIDRefer') {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                $('#btnLinkComp').hide();
                                getDetailSite({SiteIDRefer:$scope.wainformation.AppointmentData[i].Value}, nocompany);
                            }
                        }
                        else if($scope.wainformation.AppointmentData[i].Name == 'SiteID' && $scope.wainformation.AppointmentData[i].Value != "0" &&
                            $scope.wainformation.AppointmentData[i].Value != 0) {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                getDetailSite({ID:$scope.wainformation.AppointmentData[i].Value}, nocompany);
                            }
                        }
                        else if($scope.wainformation.AppointmentData[i].Name == 'CompanyName') {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                $scope.wainformation.Company.CompanyName = $scope.wainformation.AppointmentData[i].Value;
                            }
                        }
                        else if($scope.wainformation.AppointmentData[i].Name == 'companyPhoneNumber') {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                $scope.wainformation.CompanySite.HomePhoneNumber = $scope.wainformation.AppointmentData[i].Value;
                            }
                        }
                        else if($scope.wainformation.AppointmentData[i].Name == 'contactPerson') {
                            if($scope.wainformation.AppointmentData[i].Value != null && $scope.wainformation.AppointmentData[i].Value != ''){
                                $scope.wainformation.CompanySite.ContactName = $scope.wainformation.AppointmentData[i].Value;
                            }
                        }
                        else {
                            iscomp = true;
                        }
                    }
                }
                else {
                    if(_.isEmpty($scope.wainformation.Company) == false) {
                        if($scope.wainformation.Company.UID) {
                            getDetailChild($scope.wainformation.Company.UID);
                        }
                    }
                }
                if(iscomp == true) {

                    if(_.isEmpty($scope.wainformation.Company) == false){
                        if($scope.wainformation.Company.UID) {
                            getDetailChild($scope.wainformation.Company.UID);
                        }
                    }
                }
            };

            $scope.getDetailPatient = function() {
                var flag;
                console.log("wainformation ohohoho ",$scope.wainformation);
                function setDataByPatientAppointment(callback) {
                    if($scope.wainformation.PatientAppointments && $scope.wainformation.PatientAppointments.length > 0) {
                        $scope.ShowData.patient.PatientKinFirstName = $scope.wainformation.PatientAppointments[0].PatientKinFirstName;
                        $scope.ShowData.patient.PatientKinLastName = $scope.wainformation.PatientAppointments[0].PatientKinLastName;
                        $scope.ShowData.patient.PatientKinRelationship = $scope.wainformation.PatientAppointments[0].PatientKinRelationship;
                        $scope.ShowData.patient.PatientKinMobilePhoneNumber = $scope.wainformation.PatientAppointments[0].PatientKinMobilePhoneNumber;
                        $scope.ShowData.patient.MedicareEligible = $scope.wainformation.PatientAppointments[0].MedicareEligible;
                        $scope.ShowData.patient.MedicareNumber = $scope.wainformation.PatientAppointments[0].MedicareNumber;
                        $scope.ShowData.patient.MedicareReferenceNumber = $scope.wainformation.PatientAppointments[0].MedicareReferenceNumber;
                        $scope.ShowData.patient.MedicareExpiryDate = $scope.wainformation.PatientAppointments[0].MedicareExpiryDate!=null && $scope.wainformation.PatientAppointments[0].MedicareExpiryDate!=''? 
                            moment($scope.wainformation.PatientAppointments[0].MedicareExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('MM/YYYY') : null;
                        $scope.ShowData.patient.DVANumber = $scope.wainformation.PatientAppointments[0].DVANumber;
                        callback(null);
                    }
                    else {
                        var err = new Error("PatientAppointments.notFound");
                        callback(err);
                    }
                }

                function getChildDetail(obj, model) {
                    PatientService.detailChildPatient({ UID: $scope.wainformation.Patients[0].UID , model: [model], where:{Enable:'Y'} })
                    .then(function(response) {
                        if(response.data && response.data[model].length > 0) {
                            obj[model] = response.data[model][0];
                        }
                    }, function(err) {
                        console.log(err);
                    });
                }

                function setDataByPatient(callback) {
                    var model = ['PatientKin','PatientDVA','PatientMedicare'];
                    var obj = {};
                    if($scope.wainformation.Patients && $scope.wainformation.Patients.length > 0) {
                        for(var i = 0; i < model.length; i++) {
                            getChildDetail($scope.wainformation, model[i]);
                        }
                        console.log("sau khi chon xong.", $scope.wainformation);
                        if($scope.wainformation.PatientKins) {
                            $scope.ShowData.patient.PatientKinFirstName = $scope.wainformation.PatientKins.FirstName;
                            $scope.ShowData.patient.PatientKinLastName = $scope.wainformation.PatientKins.LastName;
                            $scope.ShowData.patient.PatientKinRelationship = $scope.wainformation.PatientKins.Relationship;
                            $scope.ShowData.patient.PatientKinMobilePhoneNumber = $scope.wainformation.PatientKins.MobilePhoneNumber;
                        }
                        if($scope.wainformation.PatientMedicares) {
                            $scope.ShowData.patient.MedicareEligible = $scope.wainformation.PatientMedicares.MedicareEligible;
                            $scope.ShowData.patient.MedicareNumber = $scope.wainformation.PatientMedicares.MedicareNumber;
                            $scope.ShowData.patient.MedicareReferenceNumber = $scope.wainformation.PatientMedicares.MedicareReferenceNumber;
                            $scope.ShowData.patient.MedicareExpiryDate = $scope.wainformation.PatientMedicares.MedicareExpiryDate ? 
                                moment($scope.wainformation.PatientMedicares.MedicareExpiryDate).format('MM/YYYY') : null;
                        }
                        if($scope.wainformation.PatientDVAs){
                            $scope.ShowData.patient.DVANumber = $scope.wainformation.PatientDVAs.DVANumber;
                        }
                        callback(null);
                    }
                    else {
                        var err = new Error("Patients.notFound");
                        callback(err);
                    }
                }
                if($scope.wainformation.Patients.length > 0 && $scope.wainformation.PatientAppointments.length > 0) {
                    flag = 0;
                }
                else if ($scope.wainformation.Patients.length > 0) {
                    flag = 1;
                }
                else if ($scope.wainformation.PatientAppointments.length > 0) {
                    flag = 2;
                }
                switch(flag) {
                    case 0:
                        //truong hop co ca Patient va Patient Appointment => da dc link va khong cho sua
                        console.log("truong hop 0");
                        setDataByPatientAppointment(function(err) {
                            if(err == null) {
                                $('#tab_3-3 :input').attr("disabled",true);
                                $('#tab_kinGuardian :input').attr("disabled",true);
                            }
                            else {
                                console.log(err);
                            }
                        });
                        break;
                    case 1:
                    //truong hop co Patient => da duoc link va khong cho sua
                        console.log("truong hop 1");
                        setDataByPatient(function(err) {
                            if(err == null) {
                                $('#tab_3-3 :input').attr("disabled",true);
                                $('#tab_kinGuardian').attr("disabled",true);
                            }
                        });
                        break;
                    case 2:
                    //truong hop co Patient Appointment => chua duoc link van cho phep sua
                        console.log("truong hop 2");
                        setDataByPatientAppointment(function(err){});
                        break;
                    default:
                            $scope.ShowData.patient.PatientKinFirstName = null;
                            $scope.ShowData.patient.PatientKinLastName = null;
                            $scope.ShowData.patient.PatientKinRelationship = null;
                            $scope.ShowData.patient.PatientKinMobilePhoneNumber = null;
                            $scope.ShowData.patient.MedicareEligible = null;
                            $scope.ShowData.patient.MedicareNumber = null;
                            $scope.ShowData.patient.MedicareReferenceNumber = null;
                            $scope.ShowData.patient.MedicareExpiryDate = null;
                            $scope.ShowData.patient.DVANumber = null;
                        break;
                }
                
            };
            $scope.SelectDialogPassword = function(){
                if($scope.ShowData.isLinkPatient === true){
                    var UID = $scope.wainformation.Patients[0].UserAccount.UID;
                    consultationServices.generatepassword({UID:UID})
                    .then(function(response) {
                        var modalInstance = $uibModal.open({                            
                            size:'sm',
                            templateUrl:'LinkGeneratePassword',
                            controller: function($scope,$modalInstance,data){
                                $scope.UserName = data.UserName;
                                $scope.Password = data.Password;
                                $scope.close = function(){
                                    $modalInstance.close('err');
                                }
                            },
                            resolve:{
                                data: function(){
                                    return response.data;
                                }
                            },
                        });
                    }, function(err) {
                        
                    })
                } else{
                    toastr.warning('You need link Patient');
                }
            };

            $scope.sendMailWhenLinked = function() {
                var email = [];
                for(var key in $scope.ShowData.patient) {
                    if((key == 'Email1' || key == 'Email2') && $scope.ShowData.patient[key] != null && $scope.ShowData.patient[key] != '') {

                        email.push($scope.ShowData.patient[key]);
                    }
                }
                if(email.length > 0) {
                    PatientService.sendEmailWhenLinked({ 
                        to:email, 
                        patientUID:$scope.ShowData.patient.UID, 
                        type:$scope.wainformation.Type, 
                        subject:'Confirm Linked Patient.'
                    }).then(function(result) {
                        console.log("result ",result);
                        toastr.success('Send successfully.');
                    }, function(err) {
                        console.log("err ",err);
                    })
                }
                else {
                    toastr.error('Not found Email to send.');
                }
            }

            var userObj = $cookies.getObject('userInfo');
            if(userObj && userObj.roles) {
                for(var i = 0; i < userObj.roles.length; i++) {
                    if(userObj.roles[i].RoleCode == CommonService.role_admin || userObj.roles[i].RoleCode == CommonService.role_assistant) {
                        $scope.isShowBtnLink = false;
                    }
                }
            }
        }
    };
});
