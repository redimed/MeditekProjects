module.exports = {
    'POST /api/uploadFile': {
        controller: 'FileUpload/FileUploadController',
        action: 'UploadFile'
    },
    'POST /api/uploadFileWithoutLogin': {
        controller: 'FileUpload/FileUploadController',
        action: 'UploadFileWithoutLogin'
    },
    'GET /api/downloadFile/:size?/:fileUID': {
        controller: 'FileUpload/FileUploadController',
        action: 'DownloadFile'
    },
    'GET /api/downloadFileWithoutLogin/:size?/:fileUID': {
        controller: 'FileUpload/FileUploadController',
        action: 'DownloadFileWithoutLogin'
    },
    'GET /api/enableFile/:isEnable/:fileUID': {
        controller: 'FileUpload/FileUploadController',
        action: 'EnableFile'
    },
    'POST /api/change-status-file': {
        controller: 'FileUpload/FileUploadController',
        action: 'DisableAllFile'
    },
    'POST /api/change-enable-file': {
        controller: 'FileUpload/FileUploadController',
        action: 'ChangeStatus'
    }
}
