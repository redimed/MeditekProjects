//
//  GetPostAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire

class GetPostAPI {
    func GetAPI ()  {
        
        Alamofire.request(.GET, "http://httpbin.org/get")
            .responseJSON { response in
                debugPrint(response)
                print("\(response)")
        }
    }
}

