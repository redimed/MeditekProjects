var models = require('../models');

module.exports = {
	GetList: function(req, res){
		models.EForm.findAll({
			include: [{
				model: models.EFormData,
				required: false,
				as: 'EFormData'
			}]
		})
		.then(function(data){
			res.json({data: data});
		})
	},
	GetListTemplate: function(req, res){
		models.EFormTemplate.findAll({
			where: {Active: 1},
			include: [{
				model: models.EFormTemplateData,
				required: false,
				as: 'EFormTemplateData'
			}]
		})
		.then(function(data){
			res.json({data: data});
		})
	},
	PostCreateTemplate: function(req, res){
		return models.sequelize.transaction(function(t){
			return models.EFormTemplate.create({
				Name: req.body.name 
			}, {transaction: t})
			.then(function(EFormTemplate){
				return models.EFormTemplateData.create({
					EFormTemplateID: EFormTemplate.ID,
					TemplateData: '[]'
				}, {transaction: t})
			})
			.then(function(data){
				res.json({data: data});
				return t.commit();
			})
			.catch(function(err){
				return t.rollback();
			})
		})
	},
	PostUpdateTemplate: function(req, res){
		models.EFormTemplate.find({ where: {ID: req.body.id} })
		.then(function(EFormTemplate){
			if(EFormTemplate){
				EFormTemplate.update({
					Name: req.body.name
				})
				.then(function(){
					res.json({data: EFormTemplate});
				})
			}
		})
	},
	PostRemoveTemplate: function(req, res){
		models.EFormTemplate.find({ where: {ID: req.body.id} })
		.then(function(EFormTemplate){
			if(EFormTemplate){
				EFormTemplate.update({
					Active: 0,
					Enable: 0
				})
				.then(function(){
					res.json({data: EFormTemplate});
				})
			}
		})
	},
	PostDetailTemplate: function(req, res){
		models.EFormTemplate.find({ where: {ID: req.body.id}, 
			include: [{
				model: models.EFormTemplateData,
				required: false,
				as: 'EFormTemplateData'
			}] }
		)
		.then(function(EFormTemplate){
			res.json({data: EFormTemplate});
		})
	},
	PostSaveTemplate: function(req, res){
		models.EFormTemplateData.find({where: {EFormTemplateID: req.body.id}})
		.then(function(EFormTemplateData){
			if(EFormTemplateData){
				EFormTemplateData.update({
					TemplateData: req.body.content
				})
				.then(function(){
					res.json({data: EFormTemplateData});	
				})
			}
		})
	},
	PostSave: function(req, res){
		models.EFormTemplate.find({where:  {ID: req.body.id}})
		.then(function(EFormTemplate){
			if(EFormTemplate){
				return models.sequelize.transaction(function(t){
					return models.EForm.create({
						Name: req.body.name,
						EFormTemplateID: req.body.id 
					}, {transaction: t})
					.then(function(EForm){
						return models.EFormData.create({
							EFormID: EForm.ID,
							FormData: req.body.content
						}, {transaction: t})
					})
					.then(function(data){
						res.json({data: data});
						return t.commit();
					})
					.catch(function(err){
						return t.rollback();
					})
				})
			}
		})
	},
	PostRemove: function(req, res){
		models.EForm.find({ where: {ID: req.body.id} })
		.then(function(EForm){
			if(EForm){
				return models.sequelize.transaction(function(t){
					return models.EForm.destroy({
						where: {ID: req.body.id}
					}, {transaction: t})
					.then(function(EForm){
						return models.EFormData.destroy({
							where: {EFormID: req.body.id}
						}, {transaction: t})
					})
					.then(function(data){
						res.json({data: data});
						return t.commit();
					})
					.catch(function(err){
						return t.rollback();
					})
				})
			}
		})
	},
	PostDetail: function(req, res){
		models.EForm.find({ where: {ID: req.body.id}, 
			include: [{
				model: models.EFormData,
				required: false,
				as: 'EFormData'
			}] }
		)
		.then(function(EForm){
			res.json({data: EForm});
		})
	},
	PostUpdate: function(req, res){
		models.EFormData.find({ where: {EFormID: req.body.id} })
		.then(function(EFormData){
			if(EFormData){
				EFormData.update({
					FormData: req.body.content
				})
				.then(function(){
					res.json({data: EFormData});
				})
			}
		})
	}
}