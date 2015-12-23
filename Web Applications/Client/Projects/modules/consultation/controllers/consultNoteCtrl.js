var app = angular.module("app.authentication.consultation.detail.consultNote.controller",[
]);

app.controller('consultNoteCtrl', function($scope){
	$scope.consultNote = {
		OTHER: false,
		OTHER_TEXTBOX: null,
		DDX:{
			BCC: false,
			SCC: true,
			Melanonia: false,
			Merkel: false,
			Other: false,
			OtherTextbox: null,
		},
		Further_Investigation:{
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
	$scope.OtherCheckbox = function(name,value){
		if(name == 'OTHER' && value == false)
			$scope.consultNote.OTHER_TEXTBOX = null;
		if(name == 'DDXOther' && value == false)
			$scope.consultNote.DDX.OtherTextbox = null;
		if(name == 'US_Other' && value == false)
			$scope.consultNote.Further_Investigation.US_OtherTextbox = null;
		if(name == 'CT_Other' && value == false)
			$scope.consultNote.Further_Investigation.CT_OtherTextbox = null;
		if(name == 'MRI_Other' && value == false)
			$scope.consultNote.Further_Investigation.MRI_OtherTextbox = null;
		if(name == 'PET_scan_Other' && value == false)
			$scope.consultNote.Further_Investigation.PET_scan_OtherTextbox = null;

	};
});