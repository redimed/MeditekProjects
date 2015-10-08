module.exports = {
   	/*
   		ReDoctocAppointment : set doctor for appointment
   		input:doctor ID, appointment ID
   	*/
    SetDoctorForAppointment:function(req,res){
    	var data = CheckDataService(req)
    	if (data == false) {
    		req.badRequest('failed')
    	}else{
    		var dataCreate = req.body.data
    		RelDoctorAppointment.create({

    						DoctorID : dataCreate.DoctorID,
    						AppointmentID : dataCreate.AppointmentID
    					})
    					.then(function(createData){
    						res.json(200, {data: 'success',status: 200});
    					})
    					.catch(function(err) {
    						console.log("zo1")
                             res.json(500, {error: err,status: 500});
                        });
    	};
    }
};
