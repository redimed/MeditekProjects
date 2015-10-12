<?php

namespace App\Http\Controllers;

use App\FileUpload;
use Input;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Session;
use Storage;
use File;
use Crypt;
use Ramsey\Uuid\Uuid;
use Carbon\Carbon;

class UploadFileController extends Controller
{
    /**
     * PostUploadFile: encrypt and save uploaded files onto server
     * @return string
     */
    public function PostUploadFile(Request $request)
    {
        $files = Input::file('uploadFiles');
        $arrUploadedFileIds = array();
        $numFiles = 0;
        $fileType = $request['fileType'];

        // Encrypt and upload multi files
        foreach($files as $file)
        {
            // Save file to upload folder
            $uid = Uuid::uuid4();
            $fileLocation = 'uploadfiles/'.$uid;
            $fileExtension = $file->getClientOriginalExtension();
            $fileName = $file->getClientOriginalName();
            Storage::put($fileLocation, Crypt::encrypt(File::get($file)));

            // populate FileUpload record to DB
            $fileupload = new FileUpload();
            $fileupload->FileLocation = $fileLocation;
            $fileupload->FileType = $fileType;
            $fileupload->FileName = $fileName;
            $fileupload->FileExtension = $fileExtension;
            $fileupload->uid = $uid;
            $fileupload->CreatedDate = Carbon::now();
            $fileupload->ModifiedDate = Carbon::now();
            $fileupload->save();

            $arrUploadedFileIds[$numFiles] = $fileupload->id;
            $numFiles++;
        }

        return response()->json(["ids" => $arrUploadedFileIds]);
    }

    public function PostDeleteFile( $Id, Request $request)
    {
        $file = FileUpload::findOrFail($Id);

    }

    /**
     * GetUploadFile: get UploadFile test page
     * @return \Illuminate\View\View
     */
    public function GetUploadFile()
    {
        return view('UploadFile');
    }


    /**
     * GetLoadFile: Load uploaded file content
     * @param $Id
     * @return Response
     */
    public function GetLoadFile($Id)
    {
        $file = FileUpload::findOrFail($Id);
        $fileLocation = $file->FileLocation;
        $response  = new Response(Crypt::decrypt(Storage::get($fileLocation)), '200');
        $response->header('Content-Type', '');
        $response->header('Cache-Control','no-cache');
        
        return $response;
    }
}

?>