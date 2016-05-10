//
//  PatientInformation.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/3/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class DataTeleheathUserDetail: BaseModel {
    var data = [TeleheathUserDetail]()
    dynamic var message = ""
    dynamic var status = 0
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
        message    <- map["message"]
        status    <- map["status"]
    }
    
}

class TeleheathUserDetail: Mappable {
    dynamic var Address1 = ""
    dynamic var Address2 = ""
    dynamic var CountryID1 = 0
    dynamic var CountryName = ""
    dynamic var DOB = ""
    dynamic var Education = ""
    dynamic var Email = ""
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
    dynamic var Occupation = ""
    dynamic var OtherSpecialNeed = ""
    dynamic var PhoneNumber = ""
    dynamic var Postcode = ""
    dynamic var PreferredName = ""
    dynamic var PreviousName = ""
    dynamic var ProfileImage = ""
    dynamic var Signature = ""
    dynamic var Suburb = ""
    dynamic var Title = ""
    dynamic var UID = ""
    dynamic var UserAccountID = 0
    dynamic var PinNumber = ""
    //dynamic var WorkPhoneNumber = ""
    
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        CountryID1    <- map["CountryID1"]
        CountryName    <- map["CountryName"]
        DOB    <- map["DOB"]
        Education    <- map["Education"]
        Email    <- map["Email"]
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
        Occupation    <- map["Occupation"]
        OtherSpecialNeed    <- map["OtherSpecialNeed"]
        PhoneNumber    <- map["PhoneNumber"]
        Postcode    <- map["Postcode"]
        PreferredName    <- map["PreferredName"]
        PreviousName    <- map["PreviousName"]
        ProfileImage    <- map["ProfileImage"]
        Signature    <- map["Signature"]
        Suburb    <- map["Suburb"]
        Title    <- map["Title"]
        UID    <- map["UID"]
        UserAccountID    <- map["UserAccountID"]
        PinNumber <- map["PinNumber"]
       // WorkPhoneNumber    <- map["WorkPhoneNumber"]
    }
    
}

class PatientInformation: BaseModel {
    dynamic var Address1 = ""
    dynamic var Address2 = ""
    dynamic var CountryID1 = 0
    dynamic var CountryName = ""
    dynamic var DOB = ""
    dynamic var Education = ""
    dynamic var Email = ""
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
    dynamic var Occupation = ""
    dynamic var OtherSpecialNeed = ""
    dynamic var PhoneNumber = ""
    dynamic var Postcode = ""
    dynamic var PreferredName = ""
    dynamic var PreviousName = ""
    dynamic var ProfileImage = ""
    dynamic var Signature = ""
    dynamic var Suburb = ""
    dynamic var Title = ""
    dynamic var UID = ""
    dynamic var UserAccountID = 0
    dynamic var PinNumber = ""
   // dynamic var WorkPhoneNumber = ""
    
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        CountryID1    <- map["CountryID1"]
        CountryName    <- map["CountryName"]
        DOB    <- map["DOB"]
        Education    <- map["Education"]
        Email    <- map["Email"]
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
        Occupation    <- map["Occupation"]
        OtherSpecialNeed    <- map["OtherSpecialNeed"]
        PhoneNumber    <- map["PhoneNumber"]
        Postcode    <- map["Postcode"]
        PreferredName    <- map["PreferredName"]
        PreviousName    <- map["PreviousName"]
        ProfileImage    <- map["ProfileImage"]
        Signature    <- map["Signature"]
        Suburb    <- map["Suburb"]
        Title    <- map["Title"]
        UID    <- map["UID"]
        UserAccountID    <- map["UserAccountID"]
        PinNumber <- map["PinNumber"]
     //   WorkPhoneNumber    <- map["WorkPhoneNumber"]
    }
    
}

class PostUpdatePatientInfo: BaseModel {
    dynamic var data : PatientInformation!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}