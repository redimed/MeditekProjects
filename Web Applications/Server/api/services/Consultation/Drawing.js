module.exports={
	GetDrawingTemplates:function()
	{
		var error=new Error("GetDrawingTemplates.Error");
		return DrawingTemplate.findAll()
		.then(function(list){
			if(list)
				return list;
			else return [];
		},function(err){
			error.pushError("query.error");
			throw error;
		})
	}
}