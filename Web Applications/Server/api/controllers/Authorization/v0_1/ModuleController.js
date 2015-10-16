module.exports={
	GetModulesForUser:function(req,res)
	{
		var modules=Services.Module.GetModulesForUser();

		if(!req.user)
		{
			return res.ok({data:{}});
		}

		modules=_.filter(modules,function(module){
			var result=false;
			for(var i=0;i<req.user.roles.length;i++)
			{
				var role=req.user.roles[i];
				if(module.roles.indexOf(role.RoleCode)>=0)
				{
					result=true;
					break;
				}
			}
			return result;
		});
		
		var moduleMap={};
		_.each(modules,function(module){
			moduleMap[module.uid]=module;
		});

		//--------
		//Tạo object quy định thứ tự
		var moduleMapOrder={};
		_.each(modules,function(module){
			var key=module.order+" "+module.uid;
			moduleMapOrder[module.uid]=key;
		});


		_.each(modules,function(module){
			if(!moduleMap[module.parent])
				moduleMap[module.parent]={order:'0'};
			var key=moduleMap[module.parent].order +" "+ moduleMapOrder[module.uid];
			moduleMapOrder[module.uid]=key;

		})
		moduleMapOrder['root']='root';

		//-----------
		//Tạo result
		var modulemapF={};
		_.each(modules,function(module){
			modulemapF[moduleMapOrder[module.uid]]=module;
		});
		modulemapF['root']={};

		
		_.each(modules,function(module){
			if(!modulemapF[moduleMapOrder[module.parent]].nodes)
				modulemapF[moduleMapOrder[module.parent]].nodes={};
			modulemapF[moduleMapOrder[module.parent]].nodes[moduleMapOrder[module.uid]]=module;
		})

		/*_.each(modules,function(module){
			if(!moduleMap[module.parent])
				moduleMap[module.parent]={};
			moduleMap[module.parent][module.uid]=module;
		})*/

		return res.ok({data:modulemapF['root']});
	}
}