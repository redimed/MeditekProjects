//
//  config.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

let headers = [
    "Version" : "1.0",
    "systemtype": "ios"
]
struct RegexString  {
    //EX: 04 245 544 45 || 4 564 242 45
    static let PhoneNumber = "^0?4[0-9]{8}$"
    
    static let Email = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"
}

struct api{
    static let submitInjury = "http://testapp.redimed.com.au:3001/api/urgent-care/urgent-request"
}

struct model{
    static let firstName = "firstName"
    static let lastName = "lastName"
    static let phonenumber = "phonenumber"
    static let email = "email"
    static let DOB = "DOB"
    static let suburb = "suburb"
}

struct messageString {
    static let SubmitInjurySuccess = "Please be informed that your enquiry has been received and our Redimed staff will contact you shortly."
}

