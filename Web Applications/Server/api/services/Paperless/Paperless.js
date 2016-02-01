var $q = require('q');
var requestify = require('requestify');

//moment
var moment = require('moment');
var check  = require('../HelperService');


module.exports = {

	getSize: function(obj){
		var size = 0;
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				size++;
		}
		return size;
	},

	getPropertyName: function(obj) {
		var name;
		for(var key in obj){
			name = key;
			break;
		}
		return name;
	},

	checkObj: function(obj) {
		var flag = 1;
		var tempObj = obj;
		var propObj = [];
		while(flag==1) {
			var size = 0;
			size = Services.Paperless.getSize(tempObj);
			if(size == 1) {
				for(var key in tempObj)
					propObj.push(key);
				tempObj = tempObj[key];
			}
			else {
				break;
			}
		}
		return propObj;
	},

	getMultiPropertyName : function(obj) {
		var array = [];
		for(var key in obj) {
			if(obj.hasOwnProperty(key)==true)
				array.push(key);
		}
		return array;
	},

	getIndex : function(string, charset) {
		return string.indexOf(charset);
	},

	stringCut : function(string, begin, end) {
		return string.substr(begin,end);
	},

	parseObj : function(obj, charset, value) {
		var array = Services.Paperless.ParsePropertyName(charset);
		var flag ="";
		obj = Services.Paperless.addProperty(array,obj,flag, value);
		return obj;
		
	},

	//func parse string A.B.C to array ['A','B','C']
	ParsePropertyName : function(charset) {
		var arrayBuild = [];
		while(1){
			var index = Services.Paperless.getIndex(charset,".");
			var prop = index!=-1?Services.Paperless.stringCut(charset,0,index):charset;
			charset = Services.Paperless.stringCut(charset,index+1,charset.length);
			arrayBuild.push(prop);
			if(index == -1){
				break;
			}
		}
		return arrayBuild;
	},
	//end func

	//func convert array ['A','B','C'] to object A{B{C{}}}
	addProperty : function(array, objectmerge, flag, value) {
		while(1) {
			if(array.length > 0){
				if(typeof objectmerge =='object'){
					if(objectmerge.hasOwnProperty(array[0])==true){
						var key = array[0];
						flag = array[0];
						array.splice(0,1);
						Services.Paperless.addProperty(array,objectmerge[key], flag, value);
					}
					else{
						objectmerge[array[0]] = {};
						if(array.length == 1){
							objectmerge[array[0]] = value;
						}
						flag = array[0];
						array.splice(0,1);
						Services.Paperless.addProperty(array,objectmerge[flag], flag, value);
					}
				}
				else {
					break;
				}	
			}
			else {
				break;
			}
		}
		return objectmerge;
	},
	//end func

	//convert object to string that insert into table
	Check: function(obj,stringParse,array) {
		if(typeof obj =='object'){
			for(var key in obj){
				stringParse = stringParse +"."+key;
				Services.Paperless.Check(obj[key],stringParse, array);
				var a = "."+key;
				stringParse = stringParse.replace(a,'');
			}
		}
		else {
			array.push({Name:stringParse,Value:obj});
			stringParse = "";
		}
		return array;
	},
	//end func

	convert: function(obj,stringParse,array) {
		if(typeof obj =='object'){
			for(var key in obj){
				stringParse = stringParse +"."+key;
				Services.Paperless.convert(obj[key],stringParse, array);
				var a = "."+key;
				stringParse = stringParse.replace(a,'');
			}
		}
		else {
			array.push({name:stringParse,value:obj});
			stringParse = "";
		}
		return array;
	},

	//get section and question
	GetSectionAndQuestion : function(obj) {
		var returnObj = {};
		returnObj.section = [];
		returnObj.question = [];
		for(var key in obj)
			returnObj.section.push({Name:key});
		for(var i = 0; i < returnObj.section.length; i++) {
			for(var key in obj[returnObj.section[i].Name]){
				returnObj.question.push({SectionName:returnObj.section[i].Name,Name:key});
			}
		};
		return returnObj;
	},
	//end func

	CreateTemplate: function(listTemplate, DetailTemplate) {
		return sequelize.transaction()
		.then(function(t){
			return Template.bulkCreate(listTemplate,{transaction:t})
			.then(function(result){
				return TemplateDetail.bulkCreate(DetailTemplate,{transaction:t});
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(success){
				return success;
			},function(err){
				throw err;
			})
		},function(err){
			throw err;
		});
	},

	insertTemplate : function(data) {
		var tempstring = "";
        var DetailTemplate = [];
        Services.Paperless.Check(data.listquestion, tempstring, DetailTemplate);
        for(var i = 0; i < DetailTemplate.length; i++) {
            DetailTemplate[i].Name = DetailTemplate[i].Name.substr(1,DetailTemplate[i].Name.length);
        }
        for(var i = 0; i < data.listTemplate.length; i++) {
            for(var j = 0; j < DetailTemplate.length; j++) {
                if(DetailTemplate[j].Name.indexOf(data.listTemplate[i].Name) != -1 &&
                   DetailTemplate[j].Name.indexOf(data.listTemplate[i].SectionName) != -1 ){
                    DetailTemplate[j].QuestionName = data.listTemplate[i].Name;
                    DetailTemplate[j].UID          = UUIDService.Create();
                }
            }
        }
        for(var i = 0; i < data.listTemplate.length; i++) {
            data.listTemplate[i].UID = UUIDService.Create();
        }
        var temp = Services.Paperless.GetSectionAndQuestion(data.listquestion);
        return sequelize.transaction()
        .then(function(t){
        	return EFormTemplate.create({
        		UID  : UUIDService.Create(),
        		Name : data.DocName
        	},{transaction:t})
        	.then(function(created_EFormTemplate){
        		for(var i = 0; i < temp.section.length; i++) {
        			temp.section[i].UID = UUIDService.Create();
        			temp.section[i].EFormTemplateID = created_EFormTemplate.ID;
        			temp.section[i].Description = data.sectionNames['sectionName'+(i+1)];
        		}
        		return EFormSectionTemplate.bulkCreate(temp.section,{transaction:t,individualHooks:true});
        	},function(err){
        		t.rollback();
        		throw err;
        	})
        	.then(function(created_EFormSectionTemplate){
        		//get sectionID to insert table Question
        		for(var i = 0; i < temp.question.length; i++) {
        			temp.question[i].UID = UUIDService.Create();
        			for(var j = 0; j < created_EFormSectionTemplate.length; j++) {
        				if(temp.question[i].SectionName == created_EFormSectionTemplate[j].Name)
        					temp.question[i].EFormSectionTemplateID = created_EFormSectionTemplate[j].ID;
        			}
        			for(var n = 0; n < data.listTemplate.length; n++) {
        				if(data.listTemplate[n].Name == temp.question[i].Name)
        					temp.question[i].QuestionTypeID = data.listTemplate[n].IDQuestion;
        			}
        		}
        		// end
        		return EFormQuestionTemplate.bulkCreate(temp.question,{transaction:t,individualHooks:true});
        	},function(err){
        		t.rollback();
        		throw err;
        	})
			.then(function(created_EFormQuestionTemplate){
				console.log(DetailTemplate);
				for(var i = 0; i < DetailTemplate.length; i++) {
					for(var j = 0; j < created_EFormQuestionTemplate.length; j++) {
        				if(DetailTemplate[i].QuestionName == created_EFormQuestionTemplate[j].Name)
        					DetailTemplate[i].EFormQuestionTemplateID = created_EFormQuestionTemplate[j].ID;
        			}
				}
				return EFormLineTemplate.bulkCreate(DetailTemplate,{transaction:t,individualHooks:true});
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(success){
				t.commit();
				return success;
			},function(err){
				t.rollback();
				throw err;
			})
        });
	},

	getTemplate : function(data) {
		var temp = {};
		if(data == null || data == "" || data.UID == null || data.UID == "") {
			var err = new Error("getTemplate.Error");
			err.pushError("invalid.Params");
			throw err;
		}
		else {
			return sequelize.transaction()
			.then(function(t) {
				return EFormTemplate.findAll({
					where:{
						UID : data.UID
					},
					transaction:t
				})
				.then(function(got_EFormTemplate){
					// t.commit();
					// return got_EFormTemplate;
					if(got_EFormTemplate == null || got_EFormTemplate == "" || got_EFormTemplate.length == 0){
						var err = new Error("getTemplate.Error");
						err.pushError("FormUID.NotExisted");
						t.commit();
						throw err;
					}
					else {	
						temp.EFormTemplate = got_EFormTemplate;
						temp.EFormID = got_EFormTemplate[0].ID;
						return EFormSectionTemplate.findAll({
							where:{
								EFormTemplateID : got_EFormTemplate[0].ID
							},
							transaction: t
						});
					}
				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(got_EFormSectionTemplate){
					if(got_EFormSectionTemplate == null || got_EFormSectionTemplate == "" || got_EFormSectionTemplate.length == 0) {
						var err = new Error("getTemplate.Error");
						err.pushError("FormID.NotFound.inSection");
						t.commit();
						throw err;
					}
					else {
						//get EFormSectionTemplateID to find Question
						temp.EFormSectionTemplate = got_EFormSectionTemplate;
						var EFormSectionTemplateID_array = [];
						for(var i = 0; i < got_EFormSectionTemplate.length; i++) {
							EFormSectionTemplateID_array.push(got_EFormSectionTemplate[i].ID);
						}
						//end

						return EFormQuestionTemplate.findAll({
							where: {
								EFormSectionTemplateID : {
									$in : EFormSectionTemplateID_array
								}
							},
							transaction: t
						});
					}

				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(got_EFormQuestionTemplate){
					if(got_EFormQuestionTemplate == null || got_EFormQuestionTemplate == "" || got_EFormQuestionTemplate.length == 0) {
						var err = new Error("getTemplate.Error");
						err.pushError("sectionID.NotFound.inQuestion");
						t.commit();
						throw err;
					}
					else {
						temp.EFormQuestionTemplate = got_EFormQuestionTemplate;
						var EFormQuestionTemplateID_array = [];
						for(var i = 0; i < got_EFormQuestionTemplate.length; i++) {
							EFormQuestionTemplateID_array.push(got_EFormQuestionTemplate[i].ID);
						}
						return EFormLineTemplate.findAll({
							where: {
								EFormQuestionTemplateID : {
									$in : EFormQuestionTemplateID_array
								}
							},
							order: ['Name'],
							transaction: t
						});
					}

				},function(err){
					t.rollback();
					throw err;
				})
				.then(function(got_EFormLineTemplate){
					if(got_EFormLineTemplate == null || got_EFormLineTemplate == "" || got_EFormLineTemplate.length == 0){
						var err = new Error("getTemplate.Error");
						err.pushError("QuestionID.NotFound.inLine");
						t.commit();
						throw err;
					}
					else {
						t.commit();
						temp.EFormLineTemplate = got_EFormLineTemplate;
						return temp;
					}
				},function(err){
					t.rollback();
					throw err;
				})
			},function(err) {
				throw err;
			});
		}
		
	},

	updateTemplate : function(data) {
		var deleteData = {};
		var tempstring = "";
        var DetailTemplate = [];
        Services.Paperless.Check(data.listquestion, tempstring, DetailTemplate);
        for(var i = 0; i < DetailTemplate.length; i++) {
            DetailTemplate[i].Name = DetailTemplate[i].Name.substr(1,DetailTemplate[i].Name.length);
        }
        for(var i = 0; i < data.listTemplate.length; i++) {
            for(var j = 0; j < DetailTemplate.length; j++) {
                if(DetailTemplate[j].Name.indexOf(data.listTemplate[i].Name) != -1 &&
                   DetailTemplate[j].Name.indexOf(data.listTemplate[i].SectionName) != -1 ){
                    DetailTemplate[j].QuestionName = data.listTemplate[i].Name;
                    DetailTemplate[j].UID          = UUIDService.Create();
                }
            }
        }
        for(var i = 0; i < data.listTemplate.length; i++) {
            data.listTemplate[i].UID = UUIDService.Create();
        }
        var temp = Services.Paperless.GetSectionAndQuestion(data.listquestion);

        for(var i = 0; i < temp.section.length; i++) {
        	temp.section[i].UID = UUIDService.Create();
        	temp.section[i].EFormTemplateID = data.EFormID;
        	temp.section[i].Description = data.sectionNames['sectionName'+(i+1)];
        }

        return sequelize.transaction()
        .then(function(t){
        	return EFormSectionTemplate.findAll({
        		where :{
        			EFormTemplateID : data.EFormID
        		},
        		transaction : t
        	})
        	.then(function(got_EFormSectionTemplate){
        		if(got_EFormSectionTemplate == null || got_EFormSectionTemplate == "" || got_EFormSectionTemplate.length == 0){
        			t.rollback();
        			var err = new Error("updateTemplate.Error");
        			err.pushError("notfound.Section");
        			throw err;
        		}
        		else {
        			var arraytemp = [];
        			for(var j = 0; j < got_EFormSectionTemplate.length; j++) {
        				arraytemp[j] = got_EFormSectionTemplate[j].ID;
        			}
        			deleteData.section = arraytemp;
        			return EFormQuestionTemplate.findAll({
        				where : {
        					EFormSectionTemplateID : {
        						$in : arraytemp
        					}
        				},
        				transaction : t
        			});
        		}
        	},function(err) {
        		t.rollback();
        		throw err;
        	})
        	.then(function(got_EFormQuestionTemplate){
        		if(got_EFormQuestionTemplate == null || got_EFormQuestionTemplate == "" || got_EFormQuestionTemplate.length == 0){
        			t.rollback();
        			var err = new Error("updateTemplate.Error");
        			err.pushError("notfound.Question");
        			throw err;
        		}
        		else {
        			var arraytemp = [];
        			for(var j = 0; j < got_EFormQuestionTemplate.length; j++) {
        				arraytemp[j] = got_EFormQuestionTemplate[j].ID;
        			}
        			deleteData.question = arraytemp;
        			console.log(deleteData);
        			return EFormLineTemplate.destroy({
        				where : {
        					EFormQuestionTemplateID : {
        						$in : deleteData.question
        					}
        				},
        				transaction : t
        			});
        		}
        	},function(err){
        		t.rollback();
        		throw err;
        	})
        	.then(function(deleted_line) {
        		console.log(deleted_line);
        		if(deleted_line == null || deleted_line == "") {
        			t.rollback();
        			var err = new Error("updateTemplate.Error");
        			err.pushError("deleteLine.Error");
        			throw err;
        		}
        		else {
        			return EFormQuestionTemplate.destroy({
        				where : {
        					EFormSectionTemplateID : {
        						$in : deleteData.section
        					}
        				},
        				transaction : t
        			});
        		}
        	},function(err){
        		t.rollback();
        		throw err;
        	})
        	.then(function(deleted_question){
        		console.log(deleted_question);
        		if(deleted_question == null || deleted_question == "") {
        			t.rollback();
        			var err = new Error("updateTemplate.Error");
        			err.pushError("deleteQuestion.Error");
        			throw err;
        		}
        		else {
        			return EFormSectionTemplate.destroy({
        				where : {
        					EFormTemplateID : data.EFormID
        				},
        				transaction : t
        			});
        		}
        	},function(err){
        		t.rollback();
        		throw err;
        	})
        	.then(function(deleted_section){
        		if(deleted_section == null || deleted_section == "") {
        			t.rollback();
        			var err = new Error("updateTemplate.Error");
        			err.pushError("deleteSection.Error");
        			throw err;
        		}
        		else {
        			for(var i = 0; i < temp.section.length; i++) {
	        			temp.section[i].UID = UUIDService.Create();
	        			temp.section[i].EFormTemplateID = data.EFormID;
	        			temp.section[i].Description = data.sectionNames['sectionName'+(i+1)];
	        		}
	        		return EFormSectionTemplate.bulkCreate(temp.section,{transaction:t,individualHooks:true});
	        	}
        	},function(err){
        		t.rollback();
        		throw err;
        	})
        	.then(function(created_EFormSectionTemplate){
        		//get sectionID to insert table Question
        		for(var i = 0; i < temp.question.length; i++) {
        			temp.question[i].UID = UUIDService.Create();
        			for(var j = 0; j < created_EFormSectionTemplate.length; j++) {
        				if(temp.question[i].SectionName == created_EFormSectionTemplate[j].Name)
        					temp.question[i].EFormSectionTemplateID = created_EFormSectionTemplate[j].ID;
        			}
        			for(var n = 0; n < data.listTemplate.length; n++) {
        				if(data.listTemplate[n].Name == temp.question[i].Name)
        					temp.question[i].QuestionTypeID = data.listTemplate[n].QuestionTypeID;
        			}
        		}
        		// end
        		return EFormQuestionTemplate.bulkCreate(temp.question,{transaction:t,individualHooks:true});
        	},function(err){
        		t.rollback();
        		throw err;
        	})
			.then(function(created_EFormQuestionTemplate){
				console.log(DetailTemplate);
				for(var i = 0; i < DetailTemplate.length; i++) {
					for(var j = 0; j < created_EFormQuestionTemplate.length; j++) {
        				if(DetailTemplate[i].QuestionName == created_EFormQuestionTemplate[j].Name)
        					DetailTemplate[i].EFormQuestionTemplateID = created_EFormQuestionTemplate[j].ID;
        			}
				}
				return EFormLineTemplate.bulkCreate(DetailTemplate,{transaction:t,individualHooks:true});
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(success){
				t.commit();
				return success;
			},function(err){
				t.rollback();
				throw err;
			})
        },function(err){
        	throw err;
        });
  
	},

	listEFormsAppointment : function(data) {
		var count;
		var whereClause ={};
		console.log(data);
		if(data.search != null && data.search != "" && data.search != undefined) {
			for(var key in data.search) {
				if(key == "CreatedDate") {
					console.log(data.search[key]);
					// data.search[key] = moment(data.search[key], 'YYYY-MM-DD HH:mm:ss Z').toDate();
					var dateActual = moment(data.search[key], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    var dateAdded = moment(dateActual).add(1, 'day').toDate();
                    whereClause[key] = {
                        '$gte': dateActual,
                        '$lt': dateAdded
                    };
				}
				else
					whereClause[key] = {like:'%'+data.search[key]+'%'};
			}
		}
		return sequelize.transaction()
		.then(function(t){
			return Appointment.findOne({
				where:{
					UID : data.UID
				},
				transaction : t
			})
			.then(function(got_appt){
				if(got_appt== null || got_appt == "" || got_appt.length == 0){
					var err = new Error("listEFormsAppointment.Error");
					err.pushError("NotFound.Appointment");
					throw err;
				}
				else {
					return got_appt.getEForms({transaction:t})
					.then(function(result){
						count = result.length;
						return got_appt.getEForms({
							where:whereClause,
							limit:data.limit,
							offset:data.offset,
							transaction:t
						});
					},function(err){
						t.rollback();
						throw err;
					});
				}
			},function(err){
				t.rollback();
				throw err;
			})
			.then(function(result){
				t.commit();
				console.log(result);
				var returnData = {};
				returnData.data = result;
				returnData.count = count;
				return returnData;
			},function(err){
				t.rollback();
				throw err;
			})
		},function(err){
			throw err;
		});
	},

	listTemplate : function(data) {
		var whereClause ={};
		console.log(data);
		if(data.search != null && data.search != "" && data.search != undefined) {
			for(var key in data.search) {
				if(key == "CreatedDate") {
					console.log(data.search[key]);
					// data.search[key] = moment(data.search[key], 'YYYY-MM-DD HH:mm:ss Z').toDate();
					var dateActual = moment(data.search[key], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                    var dateAdded = moment(dateActual).add(1, 'day').toDate();
                    whereClause[key] = {
                        '$gte': dateActual,
                        '$lt': dateAdded
                    };
				}
				else
					whereClause[key] = {like:'%'+data.search[key]+'%'};
			}
		}
		return sequelize.transaction()
		.then(function(t) {
			return EFormTemplate.findAndCountAll({
				where       : whereClause,
				offset      : data.offset,
				limit       : data.limit,
				transaction : t,
				attributes  :['ID','UID','Name','Description','CreatedDate']
			})
			.then(function(result) {
				t.commit();
				return result;
			},function(err) {
				t.rollback();
				throw err;
			});
		},function(err) {
			throw err;
		});
	},

	updateData : function( arrayValue, EFormID, transaction, size) {
		if(size == arrayValue.length) {
			return {message:"success"};
		}
		else{
			return EFormData.update({
				Value : arrayValue[size].Value
			},{
				where : {
					Name : {
						$like: "%"+arrayValue[size].Name+"%"
					},
					EFormID : EFormID
				},
				transaction : transaction
			})
			.then(function(result) {
				if(result != null && result != "" && result.length != 0) {
					size++;
					return Services.Paperless.updateData(arrayValue, EFormID, transaction, size);
				}
				else {
					var err = new Error("updateData.Error");
					err.pushError("updateData.queryError");
					throw err;
				}
			},function(err){
				throw err;
			});
		}
	},

	CreateRequest: function(data) {
        // delete data.headers['if-none-match'];
        // delete data.headers['content-length'];
        // data.headers['content-length'] = Buffer.byteLength(data.body);
        return requestify.request(data.host + data.path, {
            method: data.method,
            body: !data.body ? null : data.body,
            params: !data.params ? null : data.params,
            headers: !data.headers ? null : data.headers,
            dataType: 'json',
            responseType:'arraybuffer',
            withCredentials: true,
            rejectUnauthorized: false
        });
    }
};