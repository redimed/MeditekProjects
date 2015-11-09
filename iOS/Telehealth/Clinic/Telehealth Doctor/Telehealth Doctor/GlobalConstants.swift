//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON

let STRING_URL_SERVER = "http://192.168.1.130:3009"

/// temp for download image
let URL_DOWNLOAD_IMAGE = "http://192.168.1.130:3005"

let AUTHORIZATION = STRING_URL_SERVER + "/api/telehealth/user/login"

let GENERATESESSION = STRING_URL_SERVER + "/api/telehealth/socket/generateSession"

let APPOINTMENT_DETAIL = STRING_URL_SERVER + "/api/telehealth/user/appointmentDetails/"

let APPOINTMENTLIST_WA = STRING_URL_SERVER + "/api/telehealth/appointment/listWA"

let APPOINTMENTLIST_TeleHealth = STRING_URL_SERVER + "/api/telehealth/appointment/listTelehealth"

let DOWNLOAD_IMAGE_APPOINTMENT = URL_DOWNLOAD_IMAGE + "/api/downloadFile/"

/// Socket Emit

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

/**
*  Alert Title and Message for JSSAlertView
*/

var warning_Network = (title: "No Connection", mess: "Unable to connect to the Internet")
var connection_Server = (title: "Error")


// custom response reset token for all reuqest
extension Request {
    public static func JSONResponseSerializer(
        options options: NSJSONReadingOptions = .AllowFragments)
        -> GenericResponseSerializer<AnyObject>
    {
        return GenericResponseSerializer { req, res, data in
            
            guard let validData = data else {
                let failureReason = "JSON could not be serialized because input data was nil."
                let error = Error.errorWithCode(.JSONSerializationFailed, failureReason: failureReason)
                return .Failure(data, error)
            }
            // Reset token in header for all request
            let dataJSON: JSON = JSON((res?.allHeaderFields)!)
            do {
                if dataJSON["newtoken"] != nil {
                    SingleTon.headers["Authorization"] = ""
                    SingleTon.headers["Authorization"] = "Bearer \(dataJSON["newtoken"].stringValue)"
                }
                let JSON = try NSJSONSerialization.JSONObjectWithData(validData, options: options)
                return .Success(JSON)
            } catch {
                print(data, error as NSError)
                return .Failure(data, error as NSError)
            }
            
            
        }
    }
    
    public func responseJSONReToken (
        options options: NSJSONReadingOptions = .AllowFragments,
        completionHandler: (NSURLRequest?, NSHTTPURLResponse?, Result<AnyObject>) -> Void)
        -> Self
    {
        return response(
            responseSerializer: Request.JSONResponseSerializer(options: options),
            completionHandler: completionHandler
        )
    }
}

