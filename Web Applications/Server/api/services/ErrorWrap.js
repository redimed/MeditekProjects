
//ENV=true neu trong qua trinh phat trien, muc dich respose day du chi tiet loi
//ENV=false neu release
var ENV=true;

module.exports=function(err)
{
	if(ENV)
	{
		return err;
	}
	else
	{
		return {message:err.message};
	}
}