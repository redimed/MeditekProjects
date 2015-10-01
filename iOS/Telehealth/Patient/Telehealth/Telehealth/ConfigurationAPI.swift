//
//  ConfigurationAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit



enum UrlAPICheckPhoneNumber : String {
    case SendVerifyCodePhoneNumber =  "/telehealth/user/requestActivationCode"
    case CheckVerifyCode = "/telehealth/user/verifyActivationCode"
}

