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

Route::get('api/UploadFile', 'UploadFileController@GetUploadFile');

Route::post('api/UploadFile', 'UploadFileController@PostUploadFile');

Route::post('api/UploadFileTelehealthPatient', 'UploadFileController@PostUploadFileTelehealthPatient');

Route::get('api/LoadFile/{Id}', 'UploadFileController@GetLoadFileID');

Route::get('api/LoadFileUID/{UID}', 'UploadFileController@GetLoadFileUID');

Route::post('api/UploadSingleFileTelehealth', 'UploadFileController@PostUploadSingleFileTelehealth');