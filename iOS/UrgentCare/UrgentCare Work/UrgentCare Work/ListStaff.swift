//
//  ListStaffModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/8/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class ListStaff: Mappable {
    dynamic var data =  [Staff]()
    dynamic var message =  ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        data    <- map["data"]
        message <- map["message"]
    }
    
}

class Staff: BaseModel {
    dynamic var Address1 = ""
    dynamic var Address2 = ""
    dynamic var CountryID1 = 0
    dynamic var CountryID2 = 0
    dynamic var CreatedBy = ""
    dynamic var CreatedDate = ""
    dynamic var DOB = ""
    dynamic var Education = ""
    dynamic var Email1 = ""
    dynamic var Email2 = ""
    dynamic var Enable = ""
    dynamic var FaxNumber = ""
    dynamic var FirstName = ""
    dynamic var Gender = ""
    dynamic var HomePhoneNumber = ""
    dynamic var ID = 0
    dynamic var Indigenous = ""
    dynamic var InterperterLanguage = ""
    dynamic var InterpreterRequired = ""
    dynamic var LastName = ""
    dynamic var MaritalStatus = ""
    dynamic var MiddleName = ""
    dynamic var ModifiedBy = ""
    dynamic var ModifiedDate = ""
    dynamic var Occupation = ""
    dynamic var OtherSpecialNeed = ""
    dynamic var Postcode = ""
    dynamic var PreferredName = ""
    dynamic var PreviousName = ""
    dynamic var Signature = ""
    dynamic var Suburb = ""
    dynamic var Title = ""
    dynamic var UID = ""
    dynamic var UserAccountID = 0
    dynamic var WorkPhoneNumber = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        CountryID1    <- map["CountryID1"]
        CountryID2    <- map["CountryID2"]
        CreatedBy    <- map["CreatedBy"]
        CreatedDate    <- map["CreatedDate"]
        DOB    <- map["DOB"]
        Education    <- map["Education"]
        Email1    <- map["Email1"]
        Email2    <- map["Email2"]
        Enable    <- map["Enable"]
        FaxNumber    <- map["FaxNumber"]
        FirstName    <- map["FirstName"]
        Gender    <- map["Gender"]
        HomePhoneNumber    <- map["HomePhoneNumber"]
        ID    <- map["ID"]
        Indigenous    <- map["Indigenous"]
        InterperterLanguage    <- map["InterperterLanguage"]
        InterpreterRequired    <- map["InterpreterRequired"]
        LastName    <- map["LastName"]
        MaritalStatus    <- map["MaritalStatus"]
        MiddleName    <- map["MiddleName"]
        ModifiedBy    <- map["ModifiedBy"]
        ModifiedDate    <- map["ModifiedDate"]
        Occupation    <- map["Occupation"]
        OtherSpecialNeed    <- map["OtherSpecialNeed"]
        Postcode    <- map["Postcode"]
        PreferredName    <- map["PreferredName"]
        PreviousName    <- map["PreviousName"]
        Signature    <- map["Signature"]
        Suburb    <- map["Suburb"]
        Title    <- map["Title"]
        UID    <- map["UID"]
        UserAccountID    <- map["UserAccountID"]
        WorkPhoneNumber    <- map["WorkPhoneNumber"]
    }
    
}