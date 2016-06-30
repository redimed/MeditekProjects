var modules=[
	// {uid:'1',state:'authentication.home.list',name:'Homepage',parent:'root',order:'1',icon:'icon-home active'},
	{
		uid:'2',
		state:'authentication.urgentCare.list',
		link:'urgentCare/list',
		name:'Urgen Care',
		parent:'root',
		order:'2',
		icon:'fa fa-rocket',
		roles:[
			'ADMIN',
		]
	},

	{
		uid:'3',
		state:'',
		link: '',
		name:'Appointment',
		icon: 'fa fa-calendar',
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
		link: 'Appointment/list',
		name:'Appointment List',
		icon:'fa fa-canlendar',
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
		link: 'Appointment/list',
		name:'Referral History',
		icon:'fa fa-calendar',
		parent:'root',
		order:'4',
		roles:[
			'EXTERTAL_PRACTITIONER'
		]
	},
	{
		uid:'12',
		state:'authentication.WAAppointment.GP',
		link: 'Appointment/request',
		name:'Telehealth Referral',
		icon: 'fa fa-calendar',
		parent:'root',
		order:'5',
		roles:[
			'EXTERTAL_PRACTITIONER'
		]
	},
	{
		uid:'13',
		state:'authentication.consultation.list',
		link: 'consultation/list',
		name:'Consultation',
		icon: 'fa fa-file-text',
		parent:'root',
		order:'6',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER',
			'PATIENT'
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
		state:'',
		link: '',
		name:'Doctor',
		icon: 'fa fa-user-md',
		parent:'root',
		order:'7',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER'
		]
	},
	{
		uid:'17',
		state:'authentication.doctor.list',
		link: 'doctor/list',
		name:'Doctor List',
		icon: 'fa fa-user-md',
		parent:'6',
		order:'1',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER'
		]
	},
	{
		uid:'18',
		state:'authentication.doctor.group',
		link: 'doctor/group',
		name:'Doctor Group',
		icon: 'fa fa-user-md',
		parent:'6',
		order:'2',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER'
		]
	},
	{
		uid:'7',
		state:'authentication.patient.list',
		link: 'patient/list',
		name:'Patient',
		icon: 'fa fa-bed',
		parent:'root',
		order:'8',
		roles:[
			'ADMIN',
			'ASSISTANT'
		]
	},
	{
		uid:'14',
		state:'authentication.booking.scheduler',
		link: 'booking/scheduler',
		name:'Booking',
		icon: 'fa fa-calendar-check-o',
		parent:'root',
		order:'9',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER',
		]
	},
	{
		uid:'15',
		state:'authentication.roster.home',
		link: 'roster/home',
		name:'Roster',
		icon: 'fa fa-calendar-o',
		parent:'root',
		order:'10',
		roles:[
			'ADMIN',
			'INTERNAL_PRACTITIONER',
		]
	},
	{
		uid:'16',
		state:'authentication.company.list',
		link: 'company/list',
		name:'Company',
		icon: 'fa fa-building',
		parent:'root',
		order:'11',
		roles:[
			'ADMIN',
		]
	},
	

]
module.exports={
	GetModulesForUser:function()
	{
		return modules;
	}
}