module.exports = {
		attributes: {
		
		PatientID:{
			type: Sequelize.BIGINT(20),
			allowNull: false,
			references:{
			model: 'Patient',
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
	tableName: 'RelPatientAppointment',
	timestamps: false 
	}
};