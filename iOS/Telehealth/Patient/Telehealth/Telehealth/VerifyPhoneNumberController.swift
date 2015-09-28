//
//  VerifyPhoneNumberController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON


class VerifyPhoneNumberController {
    var returnData = String()
    func GetDataAPI (url:String,completionHandler: (JSON) -> Void)  {
         
        Alamofire.request(.GET, url)
            .responseJSON { response in
                completionHandler(JSON(response.2.value!) )
//                self.returnData =  String(response.2.value!)

        }
        
    }
    
}
