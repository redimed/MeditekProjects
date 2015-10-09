module.exports = {

    SetPatientForAppointment:function(req,res){
    	var data = CheckDataService(req)
    	if (data == false) {
    		req.badRequest('failed')
    	}else{
    		var dataCreate = req.body.data
    		RelPatientAppointment.create({

    						PatientID : dataCreate.PatientID,
    						AppointmentID : dataCreate.AppointmentID
    					})
    					.then(function(createData){
    						res.json(200, {data: 'success',status: 200});
    					})
    					.catch(function(err) {
    						
                             res.json(500, {error: err,status: 500});
                        });
    	};
    }
};
