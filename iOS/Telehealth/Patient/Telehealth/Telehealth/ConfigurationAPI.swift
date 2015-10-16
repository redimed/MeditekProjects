//
//  ConfigurationAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit


//Giap: API verify phone number and send verifycode
struct UrlAPICheckPhoneNumber  {
    static let SendVerifyCodePhoneNumber = "/api/telehealth/user/requestActivationCode"
    static let CheckVerifyCode = "/api/telehealth/user/verifyActivationCode"
    
}
struct UrlInformationPatient  {
    static let getInformationPatientByUID = "/api/telehealth/user/details"
    static let getAppointmentList = "/api/telehealth/user/appointments"
    static let getAppointmentDetails = "/api/telehealth/user/appointmentDetails"
    static let uploadImage = "https://testapp.redimed.com.au:3010/api/UploadFile"
}

//Giap: API Socket
struct UrlAPISocket  {
    static let joinRoom = "/api/telehealth/socket/joinRoom?uid=%@"
    static let emitAnswer = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"
}
//Giap: Group Message in system
struct MessageString  {
    static let CallAnswer = "answer"
    static let CallEndCall = "end"
    static let Decline = "decline"
}

//Giap: Group Hash Value Number 0 - 9 and delete
struct numberHashValue  {
    static let number0 = 915
    static let number1 = 918
    static let number2 = 921
    static let number3 = 924
    static let number4 = 927
    static let number5 = 930
    static let number6 = 933
    static let number7 = 936
    static let number8 = 939
    static let number9 = 942
    static let delete = 0
}
struct FAIcon {
    static let volume_off = "\u{f026}"
    static let volume_up = "\u{f028}"
    static let pause = "\u{f04c}"
    static let play = "\u{f04b}"
}

