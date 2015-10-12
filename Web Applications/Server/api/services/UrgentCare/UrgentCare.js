var o=require("../HelperService");
module.exports={
	/**
	 * GetListUrgentRequests
	 * Input:
	 * 	clause:
	 * 		-criteria: chứa các key và value để filter dữ liệu
	 * 			-là một object chứa các toán tử:
	 * 				tham khảo sequelize
	 * 		-attributes: tên các trường sẽ trả về
	 * 		-limit: trả về bao nhiêu dòng dữ liệu
	 * 		-offset: bỏ qua bao nhiêu dữ liệu đầu tiên
	 * 		-order: ví dụ { UserName:'ASC',Email:'DESC' }
	 */
	GetListUrgentRequestsCustom:function(clause,transaction)
	{
		var criteria=clause.criteria;
		var attributes=clause.attributes;
		var limit=clause.limit;
		var offset=clause.offset;
		var order=_.pairs(clause.order);
		var whereClause={};
		whereClause={
			$and:[
				// {LastName:{$like:'G%'}},//đưa vào các điều kiện bắt buộc
				criteria// đưa vào các điều kiện từ client
			],
		}
		console.log(whereClause)
		var totalRows=0;
		return UrgentRequest.count({
			where:whereClause
		},{transaction:transaction})
		.then(function(count){
			totalRows=count;
			return UrgentRequest.findAll({
				where:whereClause,
				limit:limit,
				offset:offset,
				attributes:attributes,
				order:order
			})
		},function(err){
			throw err;
		})
		.then(function(rows){
			return {totalRows:totalRows,rows:rows};
		},function(err){
			throw err;
		})
	},

	/**
	 * GetListUsers
	 * Input:
	 * 	clause:
	 * 		-criteria: chứa các key và value để filter dữ liệu
	 * 		-attributes: tên các trường sẽ trả về
	 * 		-limit: trả về bao nhiêu dòng dữ liệu
	 * 		-offset: bỏ qua bao nhiêu dữ liệu đầu tiên
	 * 		-order: ví dụ { UserName:'ASC',Email:'DESC' }
	 */
	GetListUrgentRequests:function(clause,transaction)
	{
		var criteria=clause.criteria;
		var attributes=clause.attributes;
		var limit=clause.limit;
		var offset=clause.offset;
		var order=_.pairs(clause.order);
		// var order=clause.order;
		var whereClause={
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
		var orderClause={
			FirstName:null,
			LastName:null,
			Email:null,
			DOB:null,
			ConfirmUserName:null,
			CompanyName:null
		}


		HelperService.rationalizeObject(criteria,whereClause);
		console.log(criteria);
		whereClause=criteria;

		// HelperService.cleanObject(whereClause);



		if(o.checkData(whereClause.FirstName)) 
			whereClause.FirstName={$like:'%'+whereClause.FirstName+'%'};
		if(o.checkData(whereClause.LastName))
			whereClause.LastName={$like:'%'+whereClause.LastName+"%"};

		return UrgentRequest.findAll({
			where:{
				$and:[
					//----------
					//kiểu kiện cứng có thể nhập ở đây,
					//----------
					whereClause //điều kiện mềm client gửi lên
				]
			},
			limit:limit,
			offset:offset,
			attributes:attributes,
			order:order

		})

 	}
}