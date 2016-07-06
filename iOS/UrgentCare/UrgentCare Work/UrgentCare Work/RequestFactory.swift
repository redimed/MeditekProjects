//
//  RequestFactory.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import Alamofire
import ObjectMapper

class RequestFactory {
    
    class func get(url:String, completion: Response <AnyObject, NSError> -> Void )-> Request {
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "GET"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.UserUID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.UserUID)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        request.setValue("1.0", forHTTPHeaderField: "Version")
        
        print(request.allHTTPHeaderFields)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
            }
        }
        return alamofireRequest
    }
    
    class func post(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {
        print(url)
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        print("jsonString",jsonString)
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.UserUID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.UserUID)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        
        let alamofireRequest = Alamofire.request(request)
        print(request.allHTTPHeaderFields)
        
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
            }
        }
        return alamofireRequest
    }
    
    class func postRequestAppoint(url:String, model:BaseModel, completion: Response <AnyObject, NSError> -> Void)-> Request {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        print("url",url)
        print("jsonString",jsonString)
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        print(request.allHTTPHeaderFields)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            Completion(request,response:response ){
                response in completion(response)
            }
        }
        return alamofireRequest
    }
    
    class func Completion(request:NSMutableURLRequest,response:Response <AnyObject, NSError>,completion: Response <AnyObject, NSError> -> Void) {
        if let requireupdatetoken = response.response?.allHeaderFields[Define.forHTTPHeaderField.Requireupdatetoken] {
            let refreshCode = RefreshCode()
            if(requireupdatetoken as! String == "true"){
                postGetNewToken(refreshCode) { response in
                    if let refreshCodeResponse = Mapper<RefreshCodeResponse>().map(response.result.value) {
                        Context.setDataDefaults(refreshCodeResponse.refreshCode, key: Define.keyNSDefaults.RefreshCode)
                        let token =  "Bearer \(refreshCodeResponse.token)"
                        Context.setDataDefaults(token, key: Define.keyNSDefaults.Authorization)
                        let alamofireRequest = Alamofire.request(request)
                        alamofireRequest.responseJSON{response in
                            print(response.response?.allHeaderFields)
                            completion(response)
                        }
                    }
                }
            }else{
                completion(response)
            }
        }else{
            completion(response)
        }
    }
    
    class func postGetNewToken(model:BaseModel,completion: Response <AnyObject, NSError> -> Void) {
        
        let jsonString = Mapper().toJSONString(model, prettyPrint: true)
        let request = NSMutableURLRequest(URL: NSURL(string: Constants.UserURL.GET_NEW_TOKEN)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        print("jsonString",jsonString)
        request.HTTPMethod = "POST"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        
        request.HTTPBody = jsonString?.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: true)
        
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseJSON{response in
            completion(response)
        }
        
    }
    class func getImage(url:String, completion: Response <NSData, NSError> -> Void )-> Request {
        let request = NSMutableURLRequest(URL: NSURL(string: url)!, cachePolicy: NSURLRequestCachePolicy.ReloadIgnoringLocalCacheData, timeoutInterval: 5)
        
        request.HTTPMethod = "GET"
        request.setValue(Define.forHTTPHeaderField.ApplicationJson, forHTTPHeaderField: Define.forHTTPHeaderField.ContentType)
        request.setValue(Define.forHTTPHeaderField.IOS, forHTTPHeaderField: Define.forHTTPHeaderField.SystemType)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Authorization)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.Cookie)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.DeviceId)
        request.setValue(Context.getDataDefasults(Define.keyNSDefaults.UserUID) as? String, forHTTPHeaderField: Define.forHTTPHeaderField.UserUID)
        request.setValue(Context.getAppID(), forHTTPHeaderField: Define.forHTTPHeaderField.Appid)
        request.setValue("1.0", forHTTPHeaderField: "Version")
        
        print(request.allHTTPHeaderFields)
        let alamofireRequest = Alamofire.request(request)
        alamofireRequest.responseData {
                response in completion(response)
        }
        return alamofireRequest
    }
    class func postWithMutipart(url : String, image:UIImage,uploadImage:UploadImage, completion: Response <AnyObject, NSError> -> Void) {
        let imageData = UIImageJPEGRepresentation(image,1.0)
        
        Context.setValueHeader(Define.forHTTPHeaderField.ApplicationJson,header: Define.forHTTPHeaderField.ContentType)
        Context.setValueHeader(Define.forHTTPHeaderField.IOS,header: Define.forHTTPHeaderField.SystemType)
        Context.setValueHeader((Context.getDataDefasults(Define.keyNSDefaults.Authorization) as? String)!,header: Define.forHTTPHeaderField.Authorization)
        Context.setValueHeader((Context.getDataDefasults(Define.keyNSDefaults.Cookie) as? String)!,header: Define.forHTTPHeaderField.Cookie)
        Context.setValueHeader((Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as? String)!,header: Define.forHTTPHeaderField.DeviceId)
        Context.setValueHeader(Context.getAppID(),header: Define.forHTTPHeaderField.Appid)
        Context.setValueHeader(Context.getAppID(),header: Define.forHTTPHeaderField.Appid)
        Context.setValueHeader(uploadImage.fileType,header: "fileType")
        Context.setValueHeader(uploadImage.userUID,header: "userUID")
        
        return  Alamofire.upload(Alamofire.Method.POST, url, headers: Context.headers, multipartFormData: { multipartFormData in
            
            multipartFormData.appendBodyPart(data: uploadImage.fileType.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "fileType")
            multipartFormData.appendBodyPart(data: uploadImage.userUID.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "userUID")
            multipartFormData.appendBodyPart(
                data: imageData!,
                name: "uploadFile",
                fileName: "AppointmentImg_\(image.hash).png",
                mimeType: "image/png"
            )
            }, encodingCompletion: {
                encodingResult in
                switch encodingResult {
                case .Success(let upload, _, _ ):
                    upload.responseJSON{response in completion(response)}
                    
                case .Failure( _): break
                    
                }
        })
    }
}

