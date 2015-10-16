<?php
?>
@extends('UploadFile')


@section('UploadForm')

                <form class="form" method="post" action="../api/UploadSingleFileTelehealthPatient" enctype="multipart/form-data">
                    <div><input value='c2af34c7-1365-4406-b087-861b74fa5f79' type='test' name='patientUID' /></div>
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
                    <div><input type="file" name="uploadFile" id="uploadFiles"/></div>
                    <span>&nbsp;</span>
                    <div><input class="form-input" type="submit" value="Upload Files" />
                    </div>
                </form>
@stop