
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
		var whereClause={};
		if(criteria.UID) whereClause.UID=criteria.UID;
		if(criteria.FirstName) whereClause.FirstName={$like:'%'+criteria.FirstName+'%'};
		if(criteria.LastName) whereClause.LastName={$like:'%'+criteria.LastName+'%'};
		if(criteria.PhoneNumber) whereClause.PhoneNumber=criteria.PhoneNumber;
		if(criteria.Gender) whereClause.Gender=criteria.Gender;
		if(criteria.Email) whereClause.Email=criteria.Email;
		if(criteria.DOB) whereClause.DOB=criteria.DOB;
		if(criteria.Suburb) whereClause.Suburb=criteria.Suburb;
		// if(criteria.	)
 	}
}