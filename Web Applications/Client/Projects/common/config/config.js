
//BEGIN CONFIG ULOAD URL
var _apiUpload="/api/uploadFile";
var _uploadURL=_restBaseURL+_apiUpload;
//END CONFIG UPLOAD URL

//BEGIN CONFIG DISABLE FILE
var _apiEnableFile="/api/enableFile";
var _enableFileURL=_restBaseURL+_apiEnableFile;
//END CONFIG UPLOAD URL

//BEGIN CONFIG DISABLE FILE
var _apiDownloadFile="/api/downloadFile";
var _downloadFileURL=_restBaseURL+_apiDownloadFile;
//END CONFIG UPLOAD URL


var o={
	const:{
		restBaseUrl:_restBaseURL,

		uploadFileUrl:_uploadURL,

		enableFileUrl:_enableFileURL,

		downloadFileUrl:_downloadFileURL,
	}
}