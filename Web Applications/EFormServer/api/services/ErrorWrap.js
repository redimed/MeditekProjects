
//ENV=true neu trong qua trinh phat trien, muc dich respose day du chi tiet loi
//ENV=false neu release
var ENV=true;

module.exports=function(err)
{
	var returnObj={};
	if(ENV)
	{
		//Kiem tra co phai kieu Error khong, neu la kieu Error thi tra ve stack error
		if(err)
		{
			if(err.message)
				returnObj.ErrorType=err.message;
			returnObj.ErrorsList=err.errors;
			if(err.stack)
				returnObj.Stack=err.stack;
		}
		else
		{
			returnObj.ErrorType="Server.Error";
		}
	}
	else
	{
		if(err)
		{
			if(err.message)
				returnObj.ErrorType=err.message;
			returnObj.ErrorsList=err.errors;
		}
		else
		{
			returnObj.ErrorType="Server.Error";
		}
	}
	return returnObj;
}