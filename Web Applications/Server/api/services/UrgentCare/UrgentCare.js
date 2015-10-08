module.exports={
	/**
	 * GetListUrgentRequests
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
		whereClause={
			$and:[
				criteria
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
	}
}