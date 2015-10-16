<?php
?>
@extends('UploadFile')


@section('UploadForm')

                <form class="form" method="post" action="../api/UploadMultiFiles" enctype="multipart/form-data">
                    <div><input value='6a316ebf-0ea8-4365-ac95-8b9ab340f2cf' type='text' name='userUID' /></div>
                    <div>
                    <select name="fileType" >
                        <option value="MedicalImage">Medical Image</option>
                        <option value="MedicalDocument">Medical Document</option>
                        <option value="ProfileImage">Profile Image</option>
                        <option value="Signature">Signature</option>
                    </select>
                    </div>
<!--                     <div><input type="file" multiple="multiple" name="uploadFiles[]" id="uploadFiles"/></div>
 -->
                    <div><input type="file" multiple="multiple" name="uploadFiles[]" id="uploadFiles"/></div>
                    <span>&nbsp;</span>
                    <div><input class="form-input" type="submit" value="Upload Files" />
                    </div>
                </form>
@stop