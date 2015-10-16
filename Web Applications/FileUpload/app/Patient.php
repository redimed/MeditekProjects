<?php
namespace App;

use Illuminate\Database\Eloquent\Model;


/**
*	Patient Model
*/
class Patient extends Model{
    protected $table = 'Patient';
    public $timestamps = false;

    public function UserAccount()
    {
    	return $this->hasOne('App\UserAccount', 'ID','UserAccountID');
    }


}


?>