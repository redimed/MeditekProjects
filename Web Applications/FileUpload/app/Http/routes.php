<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});


// Web App Upload File
Route::get('api/UploadMultiFiles','UploadFileController@GetUploadMultiFiles');
Route::post('api/UploadMultiFiles', 'UploadFileController@PostUploadMultiFiles');



// View File
Route::get('api/LoadFile/{Id}', 'UploadFileController@GetLoadFileID');
Route::get('api/LoadFileUID/{UID}', 'UploadFileController@GetLoadFileUID');


// Telehealth Patient - Upload Single File
Route::get( 'api/UploadSingleFileTelehealthPatient',        'UploadFileController@GetUploadSingleFileTelehealthPatient');
Route::post('api/UploadSingleFileTelehealthPatient', 'UploadFileController@PostUploadSingleFileTelehealthPatient');
Route::post('api/UploadMultiFileTelehealthPatient',  'UploadFileController@PostUploadMultiFileTelehealthPatient');
