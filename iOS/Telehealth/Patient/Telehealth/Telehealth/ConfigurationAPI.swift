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
    static let apiLogin : String = "/api/login"
    static let SendVerifyCodePhoneNumber : String = "/api/telehealth/user/requestActivationCode"
    static let CheckVerifyCode : String = "/api/telehealth/user/verifyActivationCode"
    
}
struct UrlInformationPatient  {
    static let getUserInfo : String = "/api/telehealth/user/"
    static let getInformationPatientByUID : String = "/api/telehealth/user/details/"
    static let getAppointmentList : String = "/api/telehealth/user/appointments"
    static let getAppointmentDetails : String = "/api/telehealth/user/telehealthAppointmentDetails/"
    static let getWAADetails : String = "/api/telehealth/user/WAAppointmentDetails/"
    static let uploadImage : String =  "/api/uploadFile"
    static let uploadImageNotLogin : String = "/api/uploadFileWithoutLogin"
    static let updateImageToAppointment : String = "/api/telehealth/appointment/updateFile"
    static let downloadImage : String = "/api/downloadFile/400"
    static let getNewToken : String = "/api/refresh-token/GetNewToken"
    static let updateTokenPush : String = "/api/telehealth/user/updateToken"
    static let pushNotify : String = "/api/telehealth/user/pushNotification"
    static let logOut : String = "/api/telehealth/user/logout"
    static let updateProfile : String = "/api/telehealth/user/update"
    static let updateAvatar : String = "/api/telehealth/user/enableFile"
}

struct UrlTelehealth {
    static let requestTelehealth : String = "/api/telehealth/appointment/request"
}

struct httpUrl{
    static let httpTestApp :String = "https://testapp.redimed.com.au"
    static let httpMeditek :String = "https://meditek.redimed.com.au"
    static let httpChien : String = "http://192.168.1.235"
}

//Giap: API Socket
struct UrlAPISocket  {
    static let joinRoom : String = "/api/telehealth/socket/joinRoom?uid=%@"
    static let emitAnswer : String = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"
}



//Giap: Group Hash Value Number 0 - 9 and delete
struct numberHashValue  {
    static let number0 : Int = 915
    static let number1 : Int = 918
    static let number2 : Int = 921
    static let number3 : Int = 924
    static let number4 : Int = 927
    static let number5 : Int = 930
    static let number6 : Int = 933
    static let number7 : Int = 936
    static let number8 : Int = 939
    static let number9 : Int = 942
    static let delete : Int = 0
}
//Giap: Icon FontAwsome
struct FAIcon {
    static let volume_off : String = "\u{f026}"
    static let volume_up : String = "\u{f028}"
    static let pause : String = "\u{f04c}"
    static let play : String = "\u{f04b}"
    static let fa_close : String = "\u{f00d}"
    static let microphone_on : String = "\u{f130}"
    static let microphone_off : String = "\u{f131}"

}
struct formatTime {
    static let dateTime : String = "yyyy-MM-dd HH:mm:ss"
    static let dateTimeZone : String = "yyyy-MM-dd'T'HH:mm:ss.000Z"
    
    static let formatDate : String = "dd/MM/yyyy"
    static let formatDateTime : String = "dd/MM/yyyy HH:mm"
    static let formatTime : String = "HH:mm"
    static let confirmDate : String = "eee, d MMM yyyy 'at' hh:mm a"
}


struct colorStatusAppointment{
    static let colorAttended = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    static let colorWaitlist = "Waitlist"
    static let colorPending = "Pending"
    static let colorReceived = UIColor(red: 72/255, green: 191/255, blue: 226/255, alpha: 1.0)
    static let colorApproved = "Approved"
    static let colorFinished = "Finished"
}

struct Regex{
     //EX: 04 245 544 45 || 4 564 242 45
   static let PHONE_REGEX = "^0?4[0-9]{8}$"
    static let PhoneNumber = "[0-9]{8,10}$"
    static let MobileNumber = "^(\\+61|0061|0)?4[0-9]{8}$"
    static let Email = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"
    static let PostCodeLength = "[0-9]{4,6}"
}
struct DKOption {
    static let types: [DKImagePickerControllerAssetType] = [.AllAssets, .AllPhotos, .AllVideos, .AllAssets]
}



