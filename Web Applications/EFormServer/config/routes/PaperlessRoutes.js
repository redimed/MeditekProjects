module.exports = {
	'post /api/paperless/post-data':{
		controller: 'Paperless/PaperlessController',
		action: 'postData'
	},

	'post /api/paperless/insert-template':{
		controller: 'Paperless/PaperlessController',
		action: 'insertTemplate'
	},

	'post /api/paperless/get-template':{
		controller: 'Paperless/PaperlessController',
		action: 'getTemplate'
	},

	'post /api/paperless/insert-data':{
		controller: 'Paperless/PaperlessController',
		action: 'insertData'
	},
	
	'post /api/paperless/get-data':{
		controller: 'Paperless/PaperlessController',
		action: 'getData'
	},

	'post /api/paperless/print-pdf' :{
		controller: 'Paperless/PaperlessController',
		action: 'printData'
	},

	'post /api/paperless/loadlist-eformappt' : {
		controller: 'Paperless/PaperlessController',
		action: 'listEFormsAppointment'
	},

	'post /api/paperless/get-uid-template' : {
		controller: 'Paperless/PaperlessController',
		action:'getUIDTemplate'
	},

	'post /api/paperless/loadlist-template' : {
		controller: 'Paperless/PaperlessController',
		action : 'listTemplate'
	},

	'post /api/paperless/update-data' : {
		controller: 'Paperless/PaperlessController',
		action : 'updateData'
	},

	'post /api/paperless/update-template' : {
		controller: 'Paperless/PaperlessController',
		action: 'updateTemplate'
	}
}