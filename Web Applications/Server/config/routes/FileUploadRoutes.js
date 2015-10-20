module.exports = {
	'POST /api/uploadFile':{
		controller: 'FileUpload/FileUploadController',
		action: 'UploadFile'
	},
	'GET /api/downloadFile/:fileUID': {
		controller: 'FileUpload/FileUploadController',
		action: 'DownloadFile'
	}
}