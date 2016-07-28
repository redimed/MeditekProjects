var _ = require('lodash');
module.exports = function(data) {
	var promise_getChild = function(modelName, whereCondition) {
		var promise = new Promise(function(a, b) {
			var model = sequelize.models[modelName];
			if(model != null && model != '') {
				model.findAll({
					where : whereCondition,
					order: [['CreatedDate', 'DESC']]
				})
				.then(function(got_model) {
					var obj = {};
					obj[modelName] = got_model;
					a(obj);
				}, function(err) {
					b(err);
				})
			}
			else {
				var err = new Error('loadChildNode.error');
				err.pushError('not.Model');
				b(err);
			}
		});
		return promise;
	}

	var p = new Promise(function(a, b) {
		if(!data) {
			var err = new Error('loadChildNode.error');
			err.pushError('notFound.params');
			throw err;
		}

		if(!data.UID) {
			var err = new Error('loadChildNode.error');
			err.pushError('notFound.UID.params');
			throw err;
		}

		if(!data.models || !Array.isArray(data.models) || data.models.length == 0) {
			var err = new Error('loadChildNode.error');
			err.pushError('notFound.models.params');
			throw err;
		}

		Patient.findOne({
			attributes:['ID','UID','FirstName','LastName'],
			where :{
				UID : data.UID,
			}
		})
		.then(function(got_patient) {
			if(got_patient == null || got_patient == '') {
				var err = new Error('loadChildNode.error');
				err.pushError('notFound.Patient');
				throw err;
			}
			else {
				var promise_arr = [];
				for(var i = 0; i < data.models.length; i++) {
					promise_arr.push(promise_getChild(data.models[i], {PatientID: got_patient.ID}));
				}
				return Promise.all(promise_arr);
			}
		}, function(err) {
			throw err;
		})
		.then(function(finish) {
			a({data:finish});
		}, function(err) {
			b(err);
		})
	});
	return p;
};