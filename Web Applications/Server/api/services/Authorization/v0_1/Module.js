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
			'GP',
			'ASSISTANT'
		]
	},
	{
		uid:'4',
		state:'authentication.appointment.list',
		name:'Appointment List',
		parent:'3',
		order:'1',
		roles:[
			'ADMIN',
			'GP',
			'ASSISTANT'
		]
	},
	{
		uid:'5',
		state:'authentication.appointment.request',
		name:'Send Request',
		parent:'3',
		order:'2',
		roles:[
			'GP',
		]
	},
	{
		uid:'6',
		state:'authentication.doctor.list',
		name:'Doctor',
		parent:'root',
		order:'4',
		roles:[
			'ADMIN',
		]
	},
	{
		uid:'7',
		state:'authentication.patient.list',
		name:'Patient',
		parent:'root',
		order:'5',
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