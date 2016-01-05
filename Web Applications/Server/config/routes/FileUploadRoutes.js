module.exports = {
	'POST /api/uploadFile':{
		controller: 'FileUpload/FileUploadController',
		action: 'UploadFile'
	},
	'GET /api/downloadFile/:size?/:fileUID': {
		controller: 'FileUpload/FileUploadController',
		action: 'DownloadFile'
	},
	'GET /api/enableFile/:isEnable/:fileUID': {
		controller: 'FileUpload/FileUploadController',
		action: 'EnableFile'
	},
	'POST /api/change-status-file': {
		controller: 'FileUpload/FileUploadController',
		action: 'DisableAllFile'
	}
}