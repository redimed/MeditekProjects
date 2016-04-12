var Config = require('config');

module.exports = {
	saveEFormTemplateRole: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformtemplate/saveRoles',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	getAllUserRoles: function(){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'eformtemplate/getUserRoles',
				success: resolve
			})	
		});
		return p;
	},
	getUserRoles: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'api/user-role/GetRolesOfUser?UID='+data.UID,
				success: resolve
			})	
		});
		return p;
	},
	getImage: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				},
				responseType:'arraybuffer',
				url: Config.apiServerUrl+'api/downloadFileWithoutLogin/'+data.UID,
				dataType: 'binary',
				success: resolve
			})
		});
		return p;
	},
	createPDFForm: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				headers: { 
				        'Accept': 'application/json',
				        'Content-Type': 'application/json' 
				},
				responseType:'arraybuffer',
				url: Config.apiPDFUrl+'print',
				data: JSON.stringify(data),
				dataType: 'binary',
				success: resolve,
				error: reject
			})
		});
		return p;
	},
	eformHistoryDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eform/historyDetail',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	eformGroupCreate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformgroup/create',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	eformGroupList: function(dataFilter){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformgroup/list',
				data: dataFilter,
				success: resolve
			})	
		})
		return p;
	},
	eformGroupUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformgroup/update',
				success: resolve
			})	
		})
		return p;
	},
	eformGroupRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformgroup/remove',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateCreate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformtemplate/create',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	eformTemplateList: function(){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'eformtemplate/list',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateSave: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/save',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/detail',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/update',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateUpdatePrintType: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/updatePrintType',
				success: resolve
			})	
		})
		return p;
	},
	formRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/remove',
				success: resolve
			})
		})
		return p;
	},
	preFormDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'api/appointment-wa-detail/'+data.UID,
				success: resolve
			})
		})
		return p;
	},
	formSave: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/save',
				success: resolve
			})	
		})
		return p;
	},
	formClientList: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eform/list',
				data: data,
				success: resolve
			})	
		})
		return p;
	},
	formClientRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/remove',
				success: resolve
			})	
		})
		return p;
	},
	eformCheckDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/checkDetail',
				success: resolve
			})	
		})
		return p;
	},
	eformDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/detail',
				success: resolve
			})
		})
		return p;	
	},
	formUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/update',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateModuleCreate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformtemplatemodule/create',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	eformTemplateModuleList: function(){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'eformtemplatemodule/list',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateModuleUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplatemodule/update',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateModuleRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplatemodule/remove',
				success: resolve
			})
		})
		return p;
	},
	eformTemplateModuleDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplatemodule/detail',
				success: resolve
			})
		})
		return p;
	},
	eformTemplateModuleSave: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplatemodule/save',
				success: resolve
			})	
		})
		return p;
	},
	eformTemplateListFilter: function(dataFilter){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformtemplate/list-filter',
				data: dataFilter,
				success: resolve
			})	
		})
		return p;
	},
}