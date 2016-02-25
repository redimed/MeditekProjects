var o=require("../HelperService");
var check  = require('../HelperService');
//moment
var moment = require('moment');
var defaultAtrributes = [
		'UID',
		'UserAccountID',
		'FirstName',
		'LastName',
		'PhoneNumber',
		'Gender',
		'Email',
		'DOB',
		'Suburb',
		'Ip',
		'GPReferral',
		'Physiotherapy',
		'Specialist',
		'HandTherapy',
		'ExerciseRehab',
		'GP',
		'Rehab',
		'SpecialistType',
		'Treatment',
		'RequestType',
		'RequestDate',
		'Tried',
		'Interval',
		'Further',
		'UrgentRequestType',
		'ConfirmUserName',
		'CompanyName',
		'CompanyPhoneNumber',
		'ContactPerson',
		'Description',
		'Enable',
		'Status'

];
module.exports={

	/**
	 * GetListUrgentRequests
	 * Input:
	 * 	clause:
	 * 		-criteria: chứa các key và value để filter dữ liệu
	 * 			Ví dụ: {FirstName:'h',LastName:'a'}
	 * 		-attributes: mảng _ tên các trường sẽ trả về
	 * 		-limit: trả về bao nhiêu dòng dữ liệu
	 * 		-offset: bỏ qua bao nhiêu dữ liệu đầu tiên
	 * 		-order: là object chứa key tương ứng tên trường và value tương ứng kiểu sắp xếp
	 * 			ví dụ { UserName:'ASC',Email:'DESC' }
	 */
	GetListUrgentRequests:function(clause,transaction)
	{
		try
		{
			var err=new Error("GetListUrgentRequests.Errors");
			var criteria=clause.criteria;
			var attributes=clause.attributes;
			var limit=clause.limit;
			var offset=clause.offset;
			var orderTemp=clause.order;
			var criteriaValidation={
				UID:null,
				UserAccountID:null,
				FirstName:null,
				LastName:null,
				PhoneNumber:null,
				Gender:null,
				Email:null,
				DOB:null,
				Suburb:null,
				Ip:null,
				GPReferal:null,
				ServiceType:null,
				RequestType:null,
				RequestDate:null,
				Tried:null,
				Interval:null,
				Further:null,
				UrgentRequestType:null,
				ConfirmUserName:null,
				CompanyName:null,
				CompanyPhoneNumber:null,
				ContactPerson:null,
				Description:null,
				Enable:null,
				Status:null
			};
			var orderValidation={
				FirstName:null,
				LastName:null,
				Email:null,
				DOB:null,
				ConfirmUserName:null,
				CompanyName:null
			}

			HelperService.rationalizeObject(criteria,criteriaValidation);
			if(criteria.hasOwnProperty('FirstName'))
				criteria.FirstName={$like:'%'+criteria.FirstName+'%'};
			if(criteria.hasOwnProperty('LastName'))
				criteria.LastName={$like:'%'+criteria.LastName+"%"};

			HelperService.rationalizeObject(orderTemp,orderValidation);
			var order=[];
			_.each(orderTemp,function(value,key){
				if(['ASC','DESC'].indexOf(value)>=0)
					order.push([key,value]);
			});

			var totalRows=0;
			return UrgentRequest.count({
				where:{
					$and:[
						criteria
					]
				}
			},{transaction:transaction})
			.then(function(data){
				totalRows=data;
				if(totalRows>0)
				{
					return UrgentRequest.findAll({
						where:{
							$and:[
								//----------
								//kiểu kiện cứng có thể nhập ở đây,
								//----------
								criteria //điều kiện mềm client gửi lên
							]
						},
						limit:limit,
						offset:offset,
						attributes:attributes,
						order:order
					})					
				}
				else
				{
					return {totalRows:0,rows:[]};
				}
				
			},function(e){
				o.exlog(e);
				err.pushError("GetListUrgentRequests.whenCount");
				throw err;
			})
			.then(function(rows){
				return {totalRows:totalRows,rows:rows};
			},function(e){
				o.exlog(e);
				err.pushError("GetListUrgentRequests.whenSelect");
				throw err;
			})
			
		}
		catch(err)
		{
			throw err;
		}

 	},

 	whereClause : function(data) {
		var whereClause = {};
		whereClause.UrgentRequest = {};
		whereClause.UserAccount ={};
		if(check.checkData(data.Search)){
			if(data.Search.FirstName){
				whereClause.UrgentRequest.FirstName={
					like:'%'+data.Search.FirstName+'%'
				} 
			}
			if(data.Search.MiddleName){
				whereClause.UrgentRequest.MiddleName = {
					like:'%'+data.Search.MiddleName+'%'
				}
			}
			if(data.Search.LastName){
				whereClause.UrgentRequest.LastName = {
					like:'%'+data.Search.LastName+'%'
				}
			}
			if(data.Search.RequestType){
				whereClause.UrgentRequest.RequestType = {
					like:'%'+data.Search.RequestType+'%'
				}
			}
			if(data.Search.Email){
				whereClause.UrgentRequest.Email = {
					like:'%'+data.Search.Email+'%'
				}
			}
			if(data.Search.PhoneNumber){
				whereClause.UrgentRequest.PhoneNumber = {
					like:'%'+data.Search.PhoneNumber+'%'
				}
			}
			if(data.Search.RequestDate){
				if(data.Search.RequestDate.from!=undefined && data.Search.RequestDate.from!=null
				&& data.Search.RequestDate.from!=""){
					data.Search.RequestDate.from = data.Search.RequestDate.from + " 00:00:00";
				}
				if(data.Search.RequestDate.to!=undefined && data.Search.RequestDate.to!=null
				&& data.Search.RequestDate.to!=""){
					data.Search.RequestDate.to = data.Search.RequestDate.to + " 23:59:59";
				}
				var from = moment(data.Search.RequestDate.from,'DD/MM/YYYY HH:mm:ss').toDate();
				var to   = moment(data.Search.RequestDate.to,'DD/MM/YYYY HH:mm:ss').toDate();
				console.log(data.Search.RequestDate);
				whereClause.UrgentRequest.RequestDate = {
					between: [from,to]
				}
			}
			if(data.Search.Suburb){
				whereClause.UrgentRequest.Suburb = {
					like:'%'+data.Search.Suburb+'%'
				}
			}
			if(data.Search.Status){
				whereClause.UrgentRequest.Status = data.Search.Status;
			}
		}
		return whereClause;
	},

 	LoadlistUrgentRequests: function(data, transaction) {
		var FullName = '';
		var attributes = [];
		var isConcat = false;
		var whereClause = Services.UrgentCare.whereClause(data);
		if(data.Search){
			if(data.Search.FullName!='' && data.Search.FullName!=undefined){
				FullName = data.Search.FullName;
				isConcat = true;
			}
		}
		if(data.attributes!=undefined && data.attributes!=null
			 && data.attributes!='' && data.attributes.length!=0){
			for(var i = 0; i < data.attributes.length; i++){
				if(data.attributes[i].field!='UserAccount' && data.attributes[i].field!='RoleName'){
					attributes.push(data.attributes[i].field);
				}
			};
			attributes.push("UID");
			attributes.push("Enable");
		}
		else{
			attributes = defaultAtrributes;
		}
		return UrgentRequest.findAndCountAll({
			attributes : attributes,
			limit      : data.limit,
			offset     : data.offset,
			order      : data.order,
			subQuery   : false,
			where: {
				$or: [
					whereClause.UrgentRequest,
					isConcat?Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"),' ', Sequelize.col("LastName")), {
		    	   	like: '%'+FullName+'%'}):null,
				]			
			},
			transaction:transaction
		}).
		then(function(result){
			return result;
		},function(err){
			throw err;
		});
	},

	DetailUrgentRequests: function(data, transaction) {
		return UrgentRequest.findOne({
			where:{
				UID: data.UID
			},
			attributes:defaultAtrributes
		});
	}
}