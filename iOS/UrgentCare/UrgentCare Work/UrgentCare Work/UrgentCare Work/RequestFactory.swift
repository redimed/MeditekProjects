//
//  RequestFactory.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import ObjectMapper

class RequestFactory {

    class func get(url:String, completion: Response <AnyObject, NSError> -> Void )-> Request {
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        request.HTTPMethod = "GET"

        request.setValue("application/json", forHTTPHeaderField: "Content-type")
        request.setValue("IOS", forHTTPHeaderField: "systemType")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: "Authorization")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: "Cookie")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.deviceID) as? String, forHTTPHeaderField: "deviceId")
        request.setValue(Context.getAppID(), forHTTPHeaderField: "appid")

        print(request)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in completion(response)}
        print(alamofireRequest.response?.allHeaderFields)
        if let requireupdatetoken = alamofireRequest.response?.allHeaderFields["requireupdatetoken"] {
            print(requireupdatetoken)
            if requireupdatetoken as! String == "true" {
                let refreshCode = RefreshCode()
                print(refreshCode)
                return postGetNewToken(refreshCode)
            }else{
                return alamofireRequest
            }
        }else{
            return alamofireRequest
        }

    }

    class func post(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {

        let jsonString = Mapper().toJSONString(model, prettyPrint: true)

        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)

        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-type")
        request.setValue("IOS", forHTTPHeaderField: "systemType")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: "Authorization")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: "Cookie")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.deviceID) as? String, forHTTPHeaderField: "deviceId")
        request.setValue(Context.getAppID(), forHTTPHeaderField: "appid")

        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)

        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in completion(response)}

        print(alamofireRequest.response?.allHeaderFields)
        if let requireupdatetoken = alamofireRequest.response?.allHeaderFields["requireupdatetoken"] {
            print(requireupdatetoken)
            if requireupdatetoken as! String == "true" {
                let refreshCode = RefreshCode()
                print(refreshCode)
                return postGetNewToken(refreshCode)
            }else{
                return alamofireRequest
            }
        }else{
            return alamofireRequest
        }
    }
    
    class func postRequestAppoint(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        print(jsonString)
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-type")
        request.setValue("IOS", forHTTPHeaderField: "systemType")
        request.setValue(Context.getAppID(), forHTTPHeaderField: "appid")
        
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in completion(response)}
        
        print(alamofireRequest.response?.allHeaderFields)
        if let requireupdatetoken = alamofireRequest.response?.allHeaderFields["requireupdatetoken"] {
            print(requireupdatetoken)
            if requireupdatetoken as! String == "true" {
                let refreshCode = RefreshCode()
                print(refreshCode)
                return postGetNewToken(refreshCode)
            }else{
                return alamofireRequest
            }
        }else{
            return alamofireRequest
        }
    }


    class func postGetNewToken(model:BaseModel)-> Request {

        let jsonString = Mapper().toJSONString(model, prettyPrint: true)

        let request = NSMutableURLRequest(URL: NSURL(string: Constants.UserURL.GET_NEW_TOKEN)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)

        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-type")
        request.setValue("IOS", forHTTPHeaderField: "systemType")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: "Authorization")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: "Cookie")
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.deviceID) as? String, forHTTPHeaderField: "deviceId")
        request.setValue(Context.getAppID(), forHTTPHeaderField: "appid")

        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        print(request)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in}
        print(alamofireRequest.response)
        return alamofireRequest


    }
}

