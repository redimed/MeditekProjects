<?php

namespace App\Http\Controllers;

use App\FileUpload;
use App\UserAccount;
use App\Patient;

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
     * GetUploadFile: get UploadMultiFiles test page
     * @return \Illuminate\View\View
     */
    public function GetUploadMultiFiles()
    {
        return view('UploadMultiFiles');
    }

    /**
     * PostUploadFile: encrypt and save uploaded files onto server
     * @return string
     */
    public function PostUploadMultiFiles(Request $request)
    {

        try{
            
            $userUID = $request['userUID'];
            $arrUploadedFileUIDs = array();

            if(!is_null($userUID))
            {
                $user = UserAccount::where('UID', $userUID)->first();
                // Only Upload if user UID is valid
                if (!is_null($user))
                {
                    $files = Input::file('uploadFiles');
                    $numFiles = 0;
                    $fileType = $request['fileType'];

                    // Encrypt and upload multi files
                    foreach($files as $file)
                    {
                        // Encrypt and Save file to upload folder
                        $UID = Uuid::uuid4();
                        $fileLocation = 'uploadfiles/'.$UID;
                        $fileExtension = $file->getClientOriginalExtension();
                        $fileName = $file->getClientOriginalName();
                        Storage::put($fileLocation, Crypt::encrypt(File::get($file)));

                        // populate FileUpload record to DB
                        $fileupload = new FileUpload();
                        $fileupload->FileLocation = $fileLocation;
                        $fileupload->FileType = $fileType;
                        $fileupload->FileName = $fileName;
                        $fileupload->FileExtension = $fileExtension;
                        $fileupload->UID = $UID;
                        $fileupload->CreatedDate = Carbon::now();
                        $fileupload->CreatedBy = $user->ID;
                        $fileupload->ModifiedDate = Carbon::now();
                        $fileupload->UserAccountID = $user->ID;


                        $fileupload->save();

                        $arrUploadedFileUIDs[$numFiles] = $fileupload->UID;
                        $numFiles++;
                    }

                }
                return response()->json(["ids" => $arrUploadedFileUIDs]);
            }
            else
            {
                return new Response('User Not Found','400');
            }
            
        }
        catch(Exception $ex)
        {
            return new Response('', '400');
        }

    }

    /**
     * Post: get UploadFile test page
     * @return \Illuminate\View\View
     */

    public function PostUploadFileTelehealthPatient( Request $request)
    {
        $patientUID = $request['patientUID'];

        if (!is_null($patientUID))
        {
            $patient = Patient::where('UID', $patientUID)->first();
            if(!is_null($patient))
            {
                $request['userUID'] = $patient->UserAccount->UID;
                return $this->UploadFiles($request);
            }
            else
            {
                return new Response('Patient Not Found', '404');
            }
        }
        else
        {
            return new Response('Patient Not Found', '404');
        }
    }

    /**
    *  DeleteFile: Delete File
    */

    public function PostDeleteFileUID(Request $request)
    {

    }


    /**
     * GetUploadFile: get UploadFile test page
     * @return \Illuminate\View\View
     */
    public function GetUploadSingleFileTelehealthPatient()
    {
        return view('UploadSingleFile');
    }

    /**
    * PostUploadSingleFileTelehealth
    */
    public function PostUploadSingleFileTelehealthPatient(Request $request)
    {
        $patientUID = $request['patientUID'];
        if (!is_null($patientUID))
        {
            $patient = Patient::where('UID', $patientUID)->first();
            if(!is_null($patient))
            {
                $request['userUID'] = $patient->UserAccount->UID;

                try{
            
                    $userUID = $request['userUID'];
                    $appointmentUID = $request['appointmentUID'];
                    $arrUploadedFileUIDs = array();
                    if(!is_null($userUID))
                    {
                        $user = UserAccount::where('UID', $userUID)->first();
                        // Only Upload if user UID is valid
                        if (!is_null($user))
                        {
                            $file = Input::file('uploadFile');
                            $numFiles = 0;
                            $fileType = $request['fileType'];

                            // Encrypt and Save file to upload folder
                            $UID = Uuid::uuid4();
                            $fileLocation = 'uploadfiles/'.$UID;
                            $fileExtension = $file->getClientOriginalExtension();
                            $fileName = $file->getClientOriginalName();
                            Storage::put($fileLocation, Crypt::encrypt(File::get($file)));

                            // populate FileUpload record to DB
                            $fileupload = new FileUpload();
                            $fileupload->FileLocation = $fileLocation;
                            $fileupload->FileType = $fileType;
                            $fileupload->FileName = $fileName;
                            $fileupload->FileExtension = $fileExtension;
                            $fileupload->UID = $UID;
                            $fileupload->CreatedDate = Carbon::now();
                            $fileupload->CreatedBy = $user->ID;
                            $fileupload->ModifiedDate = Carbon::now();
                            $fileupload->UserAccountID = $user->ID;


                            $fileupload->save();

                            $arrUploadedFileUIDs[$numFiles] = $fileupload->UID;

                        }
                        return response()->json(["ids" => $arrUploadedFileUIDs]);
                    }
                    else
                    {
                        return new Response('User Not Found','400');
                    }
                    
                }
                catch(Exception $ex)
                {
                    return new Response('', '400');
                }

            }
            else
            {
                return new Response('Patient Not Found', '404');
            }
        }
        else
        {
            return new Response('Patient Not Found', '404');
        }

    }

    /**
     * GetLoadFile: Load uploaded file content
     * @param $Id
     * @return Response
     */
    public function GetLoadFileID($Id)
    {
        try{

            $file = FileUpload::findOrFail($Id);
            $fileLocation = $file->FileLocation;
            $response  = new Response(Crypt::decrypt(Storage::get($fileLocation)), '200');
            $response->header('Content-Type', '');
            $response->header('Cache-Control','no-cache');
            
            return $response;
        }catch(Exception $ex)
        {
            return new Response('File Not Found', '404');
        }
    }

    /**
     * GetLoadFile: Load uploaded file content
     * @param $UID
     * @return Response
     */
    public function GetLoadFileUID($UID)
    {
        try{
            $file = FileUpload::where('UID', $UID)->first();
            if (!is_null($file)) 
            {
                $fileLocation = $file->FileLocation;
                $response  = new Response(Crypt::decrypt(Storage::get($fileLocation)), '200');
                $response->header('Content-Type', '');
                $response->header('Cache-Control','no-cache');
                
                return $response;
            }
            else
            {
                return new Response('File Not Found', '404');
            }
        }
        catch(Exception $ex)
        {
            return new Response('File Not Found', '404');
        }
    }

}