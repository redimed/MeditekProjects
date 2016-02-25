var SkipperDisk = require('skipper-disk');
module.exports={
	GetDrawingTemplates:function(req,res){
		Services.Drawing.GetDrawingTemplates()
		.then(function(list){
			res.ok(list);
		},function(err){
			res.serverError(err);
		})
	},

	GetDrawingTemplateBase64:function(req,res){
		var id=req.params.id;
		Services.Drawing.GetDrawingTemplate(id)
		.then(function(data){
			res.ok({database64:Services.Drawing.base64Image(data.FileUrl)})
		},function(err){
			res.serverError(err);
		})
	},

	GetDrawingTemplateFile:function(req,res)
	{
		var id=req.params.id;
		Services.Drawing.GetDrawingTemplate(id)
		.then(function(data){
			// console.log(data);
			res.set('filename',data.FileName);
            // res.set('testtesttesttest',true);
            res.header('Access-Control-Expose-Headers', HelperService.const.exposeHeaders);
            var fileAdapter = SkipperDisk(/* optional opts */);
			fileAdapter.read(data.FileUrl)
		    .on('error', function (err){
		      return res.serverError(err);
		    })
		    .pipe(res);
		},function(err){
			res.serverError(err);
		})
	},

}