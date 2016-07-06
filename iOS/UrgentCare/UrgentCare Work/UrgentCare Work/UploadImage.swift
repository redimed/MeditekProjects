//
//  UploadImage.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/23/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class UploadImage: BaseModel {
    dynamic var fileType = ""
    dynamic var userUID = ""
    dynamic var fileUID = ""
    dynamic var status = ""
    dynamic var apptUID = ""
    var fileInfo : FileInfoUpload!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        fileType    <- map["fileType"]
        userUID    <- map["userUID"]
        fileUID    <- map["fileUID"]
        status    <- map["status"]
        apptUID    <- map["apptUID"]
        fileInfo    <- map["fileInfo"]
    }
    
}
class FileInfoUpload: BaseModel {
    dynamic var CreatedDate = ""
    dynamic var Description = ""
    dynamic var Enable = ""
    dynamic var FileExtension = ""
    dynamic var FileLocation = ""
    dynamic var FileName = ""
    dynamic var FileType = ""
    dynamic var ID = 0
    dynamic var ModifiedDate = ""
    dynamic var UID = ""
    dynamic var UserAccountID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        CreatedDate    <- map["CreatedDate"]
        Description    <- map["Description"]
        Enable    <- map["Enable"]
        FileLocation    <- map["FileLocation"]
        FileName    <- map["FileName"]
        FileType    <- map["FileType"]
        ID    <- map["ID"]
        ModifiedDate    <- map["ModifiedDate"]
        UID    <- map["UID"]
        UserAccountID    <- map["UserAccountID"]
    }
    
}
class UploadImageRequest: BaseModel {
    dynamic var data : UploadImage!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

