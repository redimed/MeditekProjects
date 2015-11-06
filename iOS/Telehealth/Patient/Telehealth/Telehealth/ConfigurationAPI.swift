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
    static let uploadImage =  "/api/uploadFile"
    static let updateImageToAppointment = "/api/telehealth/appointment/updateFile"
    static let downloadImage = "/api/downloadFile/400"
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
    static let Call = "call"
    static let Cancel = "cancel"
    static let VersionAndBuild = "© REDIMED 2015 \(UIApplication.sharedApplication().versionBuild()) – App Design by Meditek"
    static let QuestionCallPhone = "You want to contact us?"
}

struct ErrorMessage {
    static let NoData = "Can't get data"
    static let TimeOut = "Request Time Out"
    static let TimeOutToken = "jwt expired"
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
//Giap: Icon FontAwsome
struct FAIcon {
    static let volume_off = "\u{f026}"
    static let volume_up = "\u{f028}"
    static let pause = "\u{f04c}"
    static let play = "\u{f04b}"
    static let fa_close = "\u{f00d}"
}
struct formatTime {
    static let dateTime = "yyyy-MM-dd HH:mm:ss"
    static let dateTimeZone = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    static let formatDate = "dd/MM/yyyy"
    static let formatDateTime = "dd/MM/yyyy HH:mm"
    static let formatTime = "HH:mm"
}

