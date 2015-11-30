//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

let URL_SERVER_3009 = "http://testapp.redimed.com.au:3009"
let URL_SERVER_3005 = "http://testapp.redimed.com.au:3005"

struct Platform {
    static let isSimulator: Bool = {
        var isSim = false
        #if arch(i386) || arch(x86_64)
            isSim = true
        #endif
        return isSim
    }()
}

// URL Request API
let AUTHORIZATION = URL_SERVER_3005 + "/api/login"
let GET_TELEUSER = URL_SERVER_3009 + "/api/telehealth/user/"

let GENERATESESSION = URL_SERVER_3009 + "/api/telehealth/socket/generateSession"

let TELEAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/telehealthAppointmentDetails/"

let WAAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/WAAppointmentDetails/"

let APPOINTMENTLIST_WA = URL_SERVER_3009 + "/api/telehealth/appointment/list/WAA"

let APPOINTMENTLIST_TeleHealth = URL_SERVER_3009 + "/api/telehealth/appointment/list/TEL"

let DOWNLOAD_IMAGE_APPOINTMENT = URL_SERVER_3005 + "/api/downloadFile/"

let GET_NEW_TOKEN = URL_SERVER_3005 + "/api/refresh-token/GetNewToken"




// Socket Emit
let TRANSFER_IN_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let MAKE_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@&sessionId=%@&fromName=%@"

let JOIN_ROOM = "/api/telehealth/socket/joinRoom?uid=%@"

var AUTHTOKEN = ""

func formatString(dateString: String) -> String {
    let dateFormatter = NSDateFormatter()
    dateFormatter.timeZone = NSTimeZone(name: "UTC")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
    if let datePublished = dateFormatter.dateFromString(dateString) {
        dateFormatter.dateFormat = "MMM dd, yyyy 'at' h:mm a"
        let dateFormated = dateFormatter.stringFromDate(datePublished)
        return dateFormated
    }
    return ""
}

func formatforList(dateString: String) -> String {
    let dateFormatter = NSDateFormatter()
    dateFormatter.timeZone = NSTimeZone(name: "UTC")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
    if let datePublished = dateFormatter.dateFromString(dateString) {
        dateFormatter.dateFormat = "dd/MM/yyyy HH:mm"
        let dateFormated = dateFormatter.stringFromDate(datePublished)
        return dateFormated
    }
    return ""
}

/**
*  Alert Title and Message for JSSAlertView
*/
var err_Mess_Network = "The Internet connection appears to be offline"
var err_Mess_sessionExpired = "Your session is expired. Please login again!"

