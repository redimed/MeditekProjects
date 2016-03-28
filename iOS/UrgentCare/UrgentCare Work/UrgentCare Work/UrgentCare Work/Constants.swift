//
//  Contants.swift
//  VgoUserApp
//
//  Created by admin on 07/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import Foundation


struct Constants {
    struct Path {
        static let SERVICE_URL_3006                      = "https://testapp.redimed.com.au:3006"
    }

    struct User {
        static let URL_POST_LOGIN                = Path.SERVICE_URL_3006 + "/api/login";
    }
    
    struct String {
//        let deviceId = defaults.valueForKey("deviceID") as? String
//        static let APP_ID = UIDevice.currentDevice().identifierForVendor!.UUIDString
    }
}
