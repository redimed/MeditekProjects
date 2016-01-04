var fs = require('fs');
var util = require("util");
var mime = require("mime");
function base64Image(src) {
    try
    {
        var srcImage;
        var data;
        var ex = fs.existsSync(src);

        if(ex)
            srcImage = src;
        else
            srcImage = "./uploadFile/no-image.png";

        data = fs.readFileSync(srcImage).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(srcImage), data);
    }
    catch(err){
        if (err.code !== 'ENOENT')
            return null;
    }
}

module.exports={

	base64Image:base64Image,

	GetDrawingTemplates:function()
	{
		var error=new Error("GetDrawingTemplates.Error");
		return DrawingTemplate.findAll()
		.then(function(list){
			if(list)
				return list;
			else return [];
		},function(err){
			console.log(err);
			error.pushError("query.error");
			throw error;
		})
	},

	GetDrawingTemplate:function(id)
	{
		var error=new Error("GetDrawingTemplate.Error");
		return DrawingTemplate.findOne({
			where:{
				id:id
			}
		})
		.then(function(data){
			if(data)
			{
				return data;
			}
			else
			{
				error.pushError("template.notFound");
				throw error;
			}
			
		},function(err){
			console.log(err);
			error.pushError("query.error");
			throw error;
		})
	},
	// return {database64:base64Image(data.fileUrl)};
}