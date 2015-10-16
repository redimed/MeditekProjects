angular.module("app.common.CommonService",[])
.factory("CommonService",function(Restangular){
	var commonService={};
	var api = Restangular.all("api");
	//FUNCTION MẪU
	commonService.getTitles=function()
	{
		var list=[
			{id:1, name:'Mr'},
			{id:2, name:'Mrs'},
			{id:3, name:'Ms'},
			{id:4, name:'Dr'}
		];
		return list; 
	}
	commonService.getModulesForUser=function()
	{
		var result = api.one("module/GetModulesForUser");
		return result.get();
	}	
	commonService.GetClinicalDetails=function(){
	var list =	[
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Trauma",
          Name: "Dislocation",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Trauma",
          Name: "Fracture",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Trauma",
          Name: "Open",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Trauma",
          Name: "Closed",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Trauma",
          Name: "Displaced",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Hand",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Nerve",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Tendon/musde",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Facial",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Others",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Skin loss",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Lacerations",
          Name: "Skin loss",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Skin cancer",
          Name: "BCC/SCC",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Skin cancer",
          Name: "Melanoma",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Hand Condition",
          Name: "Ganglion",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Hand Condition",
          Name: "Arthritis",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Hand Condition",
          Name: "DeQuervains/Trigger",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "Hand Condition",
          Name: "Contracture",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "PNS",
          Name: "Carpal Tunnel",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "PNS",
          Name: "Cubital Tunnel",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "PNS",
          Name: "Tarsal Tunnel",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "PNS",
          Name: "Other",
          Value: null,
          ClinicalNote: null,
          Description: null
        },
        {
          Section: "Clinical Details",
          Category: "Telehealth Appointment",
          Type: "PNS",
          Name: "Complex Reconstructive Case",
          Value: null,
          ClinicalNote: null,
          Description: null
        }
      ];
      return list
	}

	commonService.GetNamDoctor=function(){
		var list = [
		    {
          Name: "First Surgeon Available",
          Value: null
        },
         {
          Name: "Mr Hanh Nguyen",
          Value: null
        },
         {
          Name: "Mr Adrian Brooks",
          Value: null
        },
         {
          Name: "Mr Dan Luo",
          Value: null
        },
         {
          Name: "Ms Sharon Chu",
          Value: null
        }  
		]
    return list
	}
	return commonService;
})
