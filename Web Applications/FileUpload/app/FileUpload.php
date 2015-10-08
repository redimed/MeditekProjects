<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class FileUpload extends Model{
    // FileUpload Model
    protected $table = 'FileUpload';
    protected $date = array ('ModifiedDate', 'CreatedDate');
    public $timestamps = false;

    //protected $fillable = ['FileType','FileLocation', 'CreatedDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy', 'FileExtension'];



}

?>