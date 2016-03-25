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
        static let SERVICE_URL                      = "https://api.parse.com"
        static let PARSE_APPLICATION_ID             = "MlR6vYpYvLRxfibxE5cg0e73jXojL6jWFqXU6F8L"
        static let PARSE_REST_API_TOKEN             = "7BTXVX1qUXKUCnsngL8LxhpEHKQ8KKd798kKpD9W"
        
        
    }
    
    struct Brand {
        static let URL_GET_PRODUCT_LIST             = Path.SERVICE_URL + "/1/classes/Product";
        static let URL_GET_BRAND_LIST               = Path.SERVICE_URL + "/1/classes/Brand";
        static let URL_GET_REVIEW_LIST              = Path.SERVICE_URL + "/1/classes/Review";
        
    }
    struct User {
        static let URL_GET_USER_LIST                = Path.SERVICE_URL + "/1/classes/User";
    }
    struct Review {
        static let URL_GET_REVIEW_LIST              = Path.SERVICE_URL + "/1/classes/Review";
        static let URL_POST_REVIEW                  = Path.SERVICE_URL + "/1/classes/Review";
    }
    
    struct SpeechKit {
        static let App_Id_Speech_Kit = "NMDPTRIAL_francisdinhtrung_gmail_com20160220192709"
        static let ServerHost_Speech_Kit = "sslsandbox.nmdp.nuancemobility.net"
        static let ServerPort_Speech_Kit = "443"
        static let App_Key_Speech_Kit = "1b76e68d0d358c554fd39b10087efa1b3fa875f5377d35e8d0700b8a3b3eed56b4d4e3c20970175843b3684b316266700bdb6642599b2b290b36b34674a19d28"
        static let App_ServerUrl = "nmsps://" + App_Id_Speech_Kit + "@" + ServerHost_Speech_Kit + ":" + ServerPort_Speech_Kit
    }
    
}
