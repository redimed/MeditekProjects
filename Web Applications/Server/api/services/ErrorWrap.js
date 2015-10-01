
//ENV=true neu trong qua trinh phat trien, muc dich respose day du chi tiet loi
//ENV=false neu release
var ENV=true;

module.exports=function(err)
{
	if(ENV)
	{
		//Kiem tra co phai kieu Error khong, neu la kieu Error thi tra ve stack error
		if(err.stack)
			return {message:err.message,errors:err.errors,error:err.stack};
		else
			return err;
	}
	else
	{
		if(err.stack)
		{
			if(err.message)
				return {message:err.message,errors:err.errors};
			else
				return {message:'server error'};
		}
		else
		{
			return err;
		}
		
	}
}