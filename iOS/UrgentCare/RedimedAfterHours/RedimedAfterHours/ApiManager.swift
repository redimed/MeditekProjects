//
//  ApiManager.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/18/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import Foundation

class RestApiManager: NSObject {
    static let sharedInstance = RestApiManager()
    
    let baseURL = "http://192.168.1.70:3000/api/"
    
    
    func makeHTTPPostRequest(path: String, dictData: AnyObject,postCompleted : (succeeded: Bool) -> ()) {
        
        var request = NSMutableURLRequest(URL: NSURL(string: "http://192.168.1.70:8080/api/urgent-care/urgent-request")!)
        var session = NSURLSession.sharedSession()
        request.HTTPMethod = "POST"
        var checkSuccess:NSString = "true"
        let dictionary = dictData
        print(dictionary)
        let theJSONData = NSJSONSerialization.dataWithJSONObject(dictionary ,options: NSJSONWritingOptions(0),error: nil)
        let theJSONText = NSString(data: theJSONData!,encoding: NSASCIIStringEncoding)
        
        
        var params: Dictionary<String, String> = [:]
        params["data"] = theJSONText as? String
        
        var err: NSError?
        request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        
        var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
            println("Response: \(response)")
            var strData = NSString(data: data, encoding: NSUTF8StringEncoding)
            println("Body: \(strData)")
            var err: NSError?
            var json = NSJSONSerialization.JSONObjectWithData(data, options: .MutableLeaves, error: &err) as? NSDictionary
            
            // Did the JSONObjectWithData constructor return an error? If so, log the error to the console
            if(err != nil) {
                println(err!.localizedDescription)
                let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                println("Error could not parse JSON: '\(jsonStr)'")
                checkSuccess = "false"
            }
            else {
                // The JSONObjectWithData constructor didn't return an error. But, we should still
                // check and make sure that json has a value using optional binding.
                if let parseJSON = json {
                    // Okay, the parsedJSON is here, let's get the value for 'success' out of it
                    var success = parseJSON["success"] as? Int
                    checkSuccess = "false"
                    println("Succes: \(success)")
                }
                else {
                    // Woa, okay the json object was nil, something went worng. Maybe the server isn't running?
                    let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                    println("Error could not parse JSON: \(jsonStr)")
                    checkSuccess = "false"
                }
            }
        })
        
        task.resume()
//        var request = NSMutableURLRequest(URL: NSURL(string: "http://192.168.1.70:8080/api/urgent-care/urgent-request")!)
//        var session = NSURLSession.sharedSession()
//        request.HTTPMethod = "POST"
//        var checkSuccess:NSString = "true"
//        let dictionary: AnyObject = dictData
//        let theJSONData = NSJSONSerialization.dataWithJSONObject(dictionary ,options: NSJSONWritingOptions(0),error: nil)
//        let theJSONText = NSString(data: theJSONData!,encoding: NSASCIIStringEncoding)
//        
//        
//        var params: Dictionary<String, String> = [:]
//        params["data"] = theJSONText as? String
//        var err: NSError?
//        request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
//        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
//        request.addValue("application/json", forHTTPHeaderField: "Accept")
//        
//        var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
//            
//            var strData = NSString(data: data, encoding: NSUTF8StringEncoding)
//            
//            var err: NSError?
//            var json = NSJSONSerialization.JSONObjectWithData(data, options: .MutableLeaves, error: &err) as? NSDictionary
//            
//            // Did the JSONObjectWithData constructor return an error? If so, log the error to the console
//            if(err != nil) {
//                println(err!.localizedDescription)
//                let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
//                postCompleted(succeeded: false)
//                println("Error could not parse JSON: '\(jsonStr)'")
//                return
//                
//            }
//            else {
//                // The JSONObjectWithData constructor didn't return an error. But, we should still
//                // check and make sure that json has a value using optional binding.
//                if let parseJSON = json {
//                    // Okay, the parsedJSON is here, let's get the value for 'success' out of it
//                    if let success = parseJSON["success"] as? Bool{
//                        postCompleted(succeeded: true)
//                        println("Succes: \(success)")
//                    }
//                    return
//                }
//                else {
//                    // Woa, okay the json object was nil, something went worng. Maybe the server isn't running?
//                    let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
//                    postCompleted(succeeded: false)
//                    println("Error could not parse JSON: \(jsonStr)")
//                    return
//                }
//            }
//        })
//        task.resume()
//        print(task.resume())
    }
}