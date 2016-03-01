module.exports={

	host:'http://192.168.1.2',

	prefix:'/api',
	
	version:{
		v0_1:'',
		v0_2:'/0_2'
	},

	method:{
		'get':'GET ',
		'post':'POST ',
		'put':'POST ',
		'delete':'DELETE ',
		'options':'OPTIONS ',
		'head':'HEAD '
	},



	//method,ver,path
	make:function(method,ver)
	{
		var url=arguments[0]+this.prefix;
		for(var i=1;i<arguments.length;i++)
		{
			url=url+arguments[i];
		}
		console.log(url);
		return url;
	}
}