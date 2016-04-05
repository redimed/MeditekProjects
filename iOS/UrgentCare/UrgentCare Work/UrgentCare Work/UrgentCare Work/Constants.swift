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
        static let SERVICE_URL_3006                              = "https://testapp.redimed.com.au:3006"
        static let SERVICE_URL_3005                              = "https://testapp.redimed.com.au:3005"
    }

    struct User {
        static let URL_POST_LOGIN                                = Path.SERVICE_URL_3006 + "/api/login";
        static let URL_GET_DETAIL_COMPANY_BY_USER                = Path.SERVICE_URL_3005 + "/api/company/detail-company-by-user";
    }
    
    struct String {
//        let deviceId = defaults.valueForKey("deviceID") as? String
//        static let APP_ID = UIDevice.currentDevice().identifierForVendor!.UUIDString
    }
}
