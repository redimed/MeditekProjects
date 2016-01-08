var modules=[
	// {uid:'1',state:'authentication.home.list',name:'Homepage',parent:'root',order:'1',icon:'icon-home active'},
	{uid:'2',
		state:'authentication.urgentCare.list',
		name:'Urgen Care',
		parent:'root',order:'2',
		icon:'icon-rocket',
		roles:[
			'ADMIN',
		]
	},

	{
		uid:'3',
		state:'',
		name:'Appointment',
		parent:'root',
		order:'3',
		roles:[
			'ADMIN',
			'ASSISTANT'
		]
	},
	{
		uid:'8',
		state:'authentication.WAAppointment.list',
		name:'Telehealth Appointment List',
		parent:'3',
		order:'3',
		roles:[
			'ADMIN',
			'ASSISTANT',
		]
	},

	{
		uid:'11',
		state:'authentication.WAAppointment.list',
		name:'Referral History',
		parent:'root',
		order:'4',
		roles:[
			'EXTERTAL_PRACTITIONER'
		]
	},
	{
		uid:'12',
		state:'authentication.WAAppointment.GP',
		name:'Telehealth Referral',
		parent:'root',
		order:'5',
		roles:[
			'EXTERTAL_PRACTITIONER'
		]
	},
	{
		uid:'13',
		state:'authentication.consultation.list',
		name:'Consultation',
		parent:'root',
		order:'6',
		roles:[
			'ADMIN','INTERNAL_PRACTITIONER'
		]
	},
	// {
	// 	uid:'4',
	// 	state:'authentication.appointment.list',
	// 	name:'Telehealth Appointment List',
	// 	parent:'3',
	// 	order:'1',
	// 	roles:[
	// 		'ADMIN',
	// 		'EXTERTAL_PRACTITIONER',
	// 		'ASSISTANT'
	// 	]
	// },
	// {
	// 	uid:'5',
	// 	state:'authentication.appointment.request',
	// 	name:'Telehealth Send Request',
	// 	parent:'3',
	// 	order:'2',
	// 	roles:[
	// 		'EXTERTAL_PRACTITIONER',
	// 	]
	// },
	{
		uid:'6',
		state:'authentication.doctor.list',
		name:'Doctor',
		parent:'root',
		order:'7',
		roles:[
			'ADMIN',
		]
	},
	{
		uid:'7',
		state:'authentication.patient.list',
		name:'Patient',
		parent:'root',
		order:'8',
		roles:[
			'ADMIN',
			'ASSISTANT'
		]
	},
	

]
module.exports={
	GetModulesForUser:function()
	{
		return modules;
	}
}