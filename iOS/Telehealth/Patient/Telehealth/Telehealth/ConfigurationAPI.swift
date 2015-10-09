//
//  ConfigurationAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit


//Giap: API verify phone number and send verifycode
enum UrlAPICheckPhoneNumber : String {
    case SendVerifyCodePhoneNumber =  "/telehealth/user/requestActivationCode"
    case CheckVerifyCode = "/telehealth/user/verifyActivationCode"
    
}
enum UrlInformationPatient : String {
    case getInformationPatientByUID = "/telehealth/user/details"
}

//Giap: API Socket
enum UrlAPISocket : String {
    case joinRoom = "/telehealth/socket/joinRoom?uid=%@"
    case emitAnswer = "/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"
}
//Giap: Group Message in system
enum MessageString : String {
    case CallAnswer = "answer"
    case CallEndCall = "endcall"
}
//Giap: Group Hash Value Number 0 - 9 and delete
enum numberHashValue : Int {
    case number0 = 915
    case number1 = 918
    case number2 = 921
    case number3 = 924
    case number4 = 927
    case number5 = 930
    case number6 = 933
    case number7 = 936
    case number8 = 939
    case number9 = 942
    case delete = 0
}
