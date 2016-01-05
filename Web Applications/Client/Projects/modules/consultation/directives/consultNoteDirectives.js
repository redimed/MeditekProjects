var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, $modal, $cookies, $state, $stateParams, toastr, $timeout) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        link: function(scope, ele, attr) {
            $timeout(function() {
                App.initAjax();
            })
            scope.$watch('consultationuid', function(newValue, oldValue) {
                if (newValue !== undefined) {
                    consultationServices.detailConsultation(newValue).then(function(response) {
                        $timeout(function() {
                            App.initAjax();
                        })
                        scope.loadData(response.data);
                    });
                };
            });
            scope.loadData = function(data){
                scope.requestInfo = {
                    UID: $stateParams.UID,
                    Consultations : [
                        {
                            ConsultationData : []
                        }
                    ]
                }
                scope.Temp = angular.copy(data.ConsultationData);
                scope.Temp.forEach(function(valueRes, indexRes) {
                    if (valueRes != null && valueRes != undefined) {
                        var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                        keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                        var keyOther = valueRes.Type + valueRes.Name;
                        if (keyOther != 0) {
                            keyOther = keyOther.split(" ").join("");
                        }
                        scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail] = {};
                        scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                        scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                    }
                })
            }
            scope.consultNote = {
                OTHER: false,
                OTHER_TEXTBOX: null,
                DDX: {
                    BCC: false,
                    SCC: true,
                    Melanonia: false,
                    Merkel: false,
                    Other: false,
                    OtherTextbox: null,
                },
                Further_Investigation: {
                    // US
                    US: false,
                    US_WD: false,
                    US_ENVISION: false,
                    US_INSIGHT: false,
                    US_Other: false,
                    US_OtherTextbox: null,
                    // CT
                    CT: false,
                    CT_WD: false,
                    CT_ENVISION: false,
                    CT_INSIGHT: false,
                    CT_Other: false,
                    CT_OtherTextbox: null,
                    // MRI
                    MRI: false,
                    MRI_WD: false,
                    MRI_ENVISION: false,
                    MRI_INSIGHT: false,
                    MRI_Other: false,
                    MRI_OtherTextbox: null,
                    // PET_scan
                    PET_scan: false,
                    PET_scan_WD: false,
                    PET_scan_ENVISION: false,
                    PET_scan_INSIGHT: false,
                    PET_scan_Other: false,
                    PET_scan_OtherTextbox: null,
                },
            };
            scope.requestInfo = {
                UID: $stateParams.UID,
                Consultations: []
            }
            scope.Submit = function() {
                scope.ConsultationData();
                console.log(scope.requestInfo)
                o.loadingPage(true);
                consultationServices.createConsultation(scope.requestInfo).then(function(response) {
                    if (response == 'success') {
                        o.loadingPage(false);
                        $state.go("authentication.consultation.detail", {
                            UID: $stateParams.UID
                        });
                        toastr.success("Success");
                    };

                });
            }
            scope.ConsultationData = function() {
                var ConsultationDataTemp = [];
                for (var key in scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        ConsultationDataTemp.push(object);
                    };
                };
                var countCliniDetail = 0;
                ConsultationDataTemp.forEach(function(value, key) {
                    if (value.Value != 'N' && value.Value != null) {
                        countCliniDetail++;
                    } else {
                        // if (value.FileUploads.length > 0) {
                        //     countCliniDetail++;
                        // };
                    };
                });
                if (countCliniDetail == 0) {
                    ConsultationDataTemp = [];
                };
                scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
            }
            scope.OtherCheckbox = function(name, value) {
                if (name == 'OTHER' && value == false)
                    scope.consultNote.OTHER_TEXTBOX = null;
                if (name == 'DDXOther' && value == false)
                    scope.consultNote.DDX.OtherTextbox = null;
                if (name == 'US_Other' && value == false)
                    scope.consultNote.Further_Investigation.US_OtherTextbox = null;
                if (name == 'CT_Other' && value == false)
                    scope.consultNote.Further_Investigation.CT_OtherTextbox = null;
                if (name == 'MRI_Other' && value == false)
                    scope.consultNote.Further_Investigation.MRI_OtherTextbox = null;
                if (name == 'PET_scan_Other' && value == false)
                    scope.consultNote.Further_Investigation.PET_scan_OtherTextbox = null;
            };
        }
    };
})
