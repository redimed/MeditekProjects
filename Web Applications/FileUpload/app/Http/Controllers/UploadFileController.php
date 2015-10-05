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

        $files = Input::file('images');

        foreach($files as $file)
        {
            $uid = Uuid::uuid4();
            $fileLocation = 'uploadfiles/'.$uid;
            $fileType = $file->getClientOriginalExtension();
            $fileName = $file->getClientOriginalName();
            Storage::put($fileLocation, Crypt::encrypt(File::get($file)));

            $fileupload = new FileUpload();
            $fileupload->FileLocation = $fileLocation;
            $fileupload->FileType = $fileType;
            $fileupload->FileName = $fileName;
            $fileupload->FileExtension = $fileType;
            $fileupload->uid = $uid;
            $fileupload->CreatedDate = Carbon::now();
            $fileupload->ModifiedDate = Carbon::now();

            $fileupload->save();
        }

        return count($files);


    }

    public function GetUploadFile()
    {
        return view('UploadFile');
    }


    public function GetLoadFile($Id)
    {
        $file = FileUpload::findOrFail($Id);

        $fileLocation = $file->FileLocation;
        $fileExtension = $file->FileExtension;
        $uid = $file->UID;
        $fileTempLocation = 'temp/'.$uid.'.'.$fileExtension;


//        Storage::put($fileTempLocation, Crypt::decrypt(Storage::get($fileLocation)));
//        return $fileTempLocation;

        $response  = new Response(Crypt::decrypt(Storage::get($fileLocation)), '200');
        $response->header('Content-Type', '');

        return $response;
    }
}

?>