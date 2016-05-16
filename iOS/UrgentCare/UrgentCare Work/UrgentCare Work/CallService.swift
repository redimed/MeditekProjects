//
//  CallService.swift
//  Telehealth
//
//  Created by Nguyen Duc Manh on 1/14/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import SwiftyJSON
class CallService{
    
    func setDataCalling(userInfo:  AnyObject){
        let userInfo = JSON(userInfo)
        let apiKey  =  userInfo[0]["apiKey"].string! as String ?? ""
        let message = userInfo[0]["message"].string! as String ?? ""
        let from = userInfo[0]["from"].string! as String ?? ""
        let sessionId  =  userInfo[0]["sessionId"].string! as String ?? ""
        let token  = userInfo[0]["token"].string! as String ?? ""
        let fromName  = userInfo[0]["fromName"].string! as String ?? ""
        savedData = CallContainer(apiKey: apiKey, message: message, fromName: fromName, sessionId: sessionId, token: token, from: from)
        
    }

}