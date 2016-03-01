//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import UIKit
import Alamofire
import SwiftyJSON

/// ***declare server for all application***

/// Server Australia
let URL_SERVER_3009 = "https://testapp.redimed.com.au:3009"
let URL_SERVER_3005 = "https://testapp.redimed.com.au:3005"
let URL_SERVER_3006 = "https://testapp.redimed.com.au:3006"

/// Server Việt Nam
//let URL_SERVER_3009 = "http://telehealthvietnam.com.vn:3009"
//let URL_SERVER_3005 = "http://telehealthvietnam.com.vn:3005"
//let URL_SERVER_3006 = "http://telehealthvietnam.com.vn:3006"

/// request url
let AUTHORIZATION = URL_SERVER_3006 + "/api/login"

let GET_INFO = URL_SERVER_3005 + "/api/doctor/get-doctor"

let GET_TELEUSER = URL_SERVER_3009 + "/api/telehealth/user/"

let GENERATESESSION = URL_SERVER_3009 + "/api/telehealth/socket/generateSession"

let TELEAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/telehealthAppointmentDetails/"

let WAAPPOINTMENT_DETAIL = URL_SERVER_3009 + "/api/telehealth/user/WAAppointmentDetails/"

let APPOINTMENTLIST = URL_SERVER_3009 + "/api/telehealth/appointment/list"

let APPOINTMENTLIST_TeleHealth = URL_SERVER_3009 + "/api/telehealth/appointment/list/TEL"

let DOWNLOAD_IMAGE = URL_SERVER_3005 + "/api/downloadFile/"

let GET_NEW_TOKEN = URL_SERVER_3006 + "/api/refresh-token/GetNewToken"

let UPDATE_TOKEN_PUSH = URL_SERVER_3009 + "/api/telehealth/user/updateToken"

let PUSH_ACTION = URL_SERVER_3009 + "/api/telehealth/user/pushNotification"

/// socket emit url
let TRANSFER_IN_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let MAKE_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@&sessionId=%@&fromName=%@"

let JOIN_ROOM = "/api/telehealth/socket/joinRoom?uid=%@"

var AUTHTOKEN = ""

/// alert message for UIAlertController
var err_Title_Network = "REDiMED Clinic Unavailable"
var err_Mess_Network = "The Internet connection appears to be offline"
var err_Mess_Connect = "Could not connect to server, please try again"

var err_Mess_sessionExpired = "Your session is expired. Please login again!"

/**
 *  check platform simulator or real device
 */
struct Platform {
    static let isSimulator: Bool = {
        var isSim = false
        #if arch(i386) || arch(x86_64)
            isSim = true
        #endif
        return isSim
    }()
}

/**
 function for format string to date with a format
 
 - parameter dateString: receive data from server
 
 - returns: A NSDate with format self regulation
 */
func FormatStrDate(dateString: String) -> String {
    let dateFormatter = NSDateFormatter()
    dateFormatter.timeZone = NSTimeZone(name: "UTC")
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
    if let datePublished = dateFormatter.dateFromString(dateString) {
        dateFormatter.dateFormat = "dd/MM/yyyy HH:mm"
        let dateFormated = dateFormatter.stringFromDate(datePublished)
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        return dateFormated
    }
    return ""
}

func getReFormat() -> (timeZone: String, filterFormat: String) {
    let date = NSDate()
    let dateFormatter = NSDateFormatter()
    dateFormatter.dateFormat = "yyyy-MM-dd ZZZ"
    let reFormatDate = dateFormatter.stringFromDate(date)
    let arrReFormatDate = reFormatDate.componentsSeparatedByString(" ")
    return (timeZone: arrReFormatDate[1], filterFormat: reFormatDate)
}

/**
 <#Description#>
 
 - parameter offset:      param for load more
 - parameter valueFilter: array string filter for JSON
 
 * valueFilter[0]: appointment 'from' date
 
 * valueFilter[1]: appointment 'to' date
 
 * valueFilter[2]: status a appointment
 */
func paramFilter(offset: Int, valueFilter: String...) {
    SingleTon.filterParam = [ "data":
        [
            "Limit": 20,
            "Offset": offset,
            "Order": ["Appointment": ["FromTime": "DESC"]],
            "Filter": [
                [
                    "Appointment":
                        [
                            "Status": valueFilter[2],
                            "Enable": "Y"
                            
                    ]
                ],
                [
                    "TelehealthAppointment": ["Type": "WAA"]
                ]
            ],
            "Range" : [
                [
                    "Appointment": [
                        "FromTime": [ valueFilter[0], valueFilter[1] ]
                    ]
                ]
            ]
        ]
    ]
}

func get_full_name() -> String {
    if let teleDef = NSUserDefaults.standardUserDefaults().valueForKey("doctorInfo") {
        let parseJson = JSON(teleDef)
        SingleTon.nameLogin = "\(parseJson["FirstName"].stringValue) \(parseJson["LastName"].stringValue)"
    }
    return SingleTon.nameLogin ?? ""
}



func get_value_Fund(fundKey: String!) -> String? {
    
    var reDataFund: String!
    
    switch fundKey {
    case "ACA": reDataFund = "ACA Health Benefits Fund"
    case "AHM": reDataFund = "ahm Health Insurance"
    case "AUF": reDataFund = "Australian Unity Health Limited"
    case "BUP": reDataFund = "Bupa Australia Pty Ltd"
    case "CBH": reDataFund = "CBHS Health Fund Limited"
    case "CDH": reDataFund = "CDH Benefits Fund"
    case "CPS": reDataFund = "CUA Health Limited"
    case "AHB": reDataFund = "Defence Health Limited"
    case "AMA": reDataFund = "Doctors' Health Fund"
    case "GMF": reDataFund = "GMF Health"
    case "GMH": reDataFund = "GMHBA Limited"
    case "FAI": reDataFund = "Grand United Corporate Health"
    case "HBF": reDataFund = "HBF Health Limited"
    case "HCF": reDataFund = "HCF"
    case "HCI": reDataFund = "Health Care Insurance Limited"
    case "HIF": reDataFund = "Health Insurance Fund of Australia Limited"
    case "SPS": reDataFund = "Health Partners"
    case "HEA": reDataFund = "health.com.au"
    case "LHS": reDataFund = "Latrobe Health Services"
    case "MBP": reDataFund = "Medibank Private Limited"
    case "MDH": reDataFund = "Mildura Health Fund"
    case "OMF": reDataFund = "National Health Benefits Australia Pty Ltd (onemedifund)"
    case "NHB": reDataFund = "Navy Health Ltd"
    case "NIB": reDataFund = "NIB Health Funds Ltd"
    case "LHM": reDataFund = "Peoplecare Health Insurance"
    case "PWA": reDataFund = "Phoenix Health Fund Limited"
    case "SPE": reDataFund = "Police Health"
    case "QCH": reDataFund = "Queensland Country Health Fund Ltd"
    case "RTE": reDataFund = "Railway and Transport Health Fund Limited"
    case "RBH": reDataFund = "Reserve Bank Health Society Ltd"
    case "SLM": reDataFund = "St.Lukes Health"
    case "NTF": reDataFund = "Teachers Health Fund"
    case "TFS": reDataFund = "Transport Health Pty Ltd"
    case "QTU": reDataFund = "TUH"
    case "WFD": reDataFund = "Westfund Limited"
    default: break
    }
    
    return reDataFund ?? ""
}

func get_value_DoR(param: Int!) -> String {
    var result: String!
    switch param {
    case 03:
        result = "3 months"
    case 00:
        result = "Indefinite"
    default:
        result = "12 months"
    }
    
    return result ?? ""
}

func get_val_State(param: String!) -> String {
    var result: String!
    switch param {
    case "WA":  result = "Western Australia"
    case "VIC": result = "Victoria"
    case "TAS": result = "Tasmania"
    case "QLD": result = "Queensland"
    case "NSW": result = "New South Wales"
    case "NT":  result = "Northern Territory"
    case "ACT": result = "Australian Capital Territory"
    default:
        break
    }
    return result ?? ""
}

/**
 *  Send request generate info for Opentok calling
 *
 *  @param .GET              method .GET
 *  @param GENERATESESSION   URL in global constranst file
 *  @param SingleTon.headers class singleton
 *
 */
func get_info_Opentok(completion:(() -> Void)) {
    request(.GET, GENERATESESSION, headers: SingleTon.headers)
        .validate(statusCode: 200..<300)
        .validate(contentType: ["application/json"])
        .responseJSONReToken() { response in
            guard response.2.error == nil else {
                print("error calling GET", response.2.error!)
                return
            }
            
            if let data = response.2.value {
                if let readableJSON: NSDictionary = data["data"] as? NSDictionary {
                    SingleTon.infoOpentok = JSON(readableJSON)
                    completion()
                }
            }
    }
}






