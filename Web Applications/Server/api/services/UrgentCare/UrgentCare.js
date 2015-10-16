var o=require("../HelperService");
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

 	}
}