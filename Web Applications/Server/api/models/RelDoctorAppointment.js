module.exports = {
	attributes: {
		
	DoctorID:{
	type: Sequelize.BIGINT(20),
	allowNull: false,
	references:{
		model: 'Doctor',
		key: 'ID'
		}
	},
	AppointmentID:{
		type: Sequelize.BIGINT(20),
		allowNull: false,
		references:{
			model: 'Appointment',
			key: 'ID'
			}
		}
	},
associations: function(){
},
options:{
	tableName: 'RelDoctorAppointment',
	timestamps: false 
	}
};