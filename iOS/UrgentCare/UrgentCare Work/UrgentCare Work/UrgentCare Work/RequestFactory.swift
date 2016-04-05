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
        
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in completion(response)}
        return alamofireRequest
        
    }
    
    class func post(url:String, completion: Response <AnyObject, NSError> -> Void)-> Request {
        
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        request.HTTPMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-type")
        request.setValue(Context.getToken(), forHTTPHeaderField: "token")
        let almofireRequest = Alamofire.request(request)
        almofireRequest.responseJSON{response in completion(response)}
        return almofireRequest
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
        print(request)
        let almofireRequest = Alamofire.request(request)
        almofireRequest.responseJSON{response in completion(response)}
        return almofireRequest
        
    }
    
}

