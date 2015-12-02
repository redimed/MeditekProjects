//
//  HomeViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON
import MediaPlayer
import Alamofire

class HomeViewController: UIViewController {
    
    var moviePlayer : MPMoviePlayerController?
    let customUIViewController : CustomViewController = CustomViewController()
    let userDefaults = NSUserDefaults.standardUserDefaults()
    var userUID: String!
    
    @IBOutlet weak var buttonAppointment: UIButton!
    @IBOutlet weak var imageListIcon: UIImageView!
    @IBOutlet var labelDashboard: [UILabel]!
    @IBOutlet weak var WAButtonAppointment: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "expireToken", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "handleExToken:", name: "expireToken", object: nil)
        
        SingleTon.flagSegue = Bool()
        
        guard self.userDefaults.valueForKey("Cookie") != nil || self.userDefaults.valueForKey("authToken") != nil || self.userDefaults.valueForKey("teleUserInfo") != nil || self.userDefaults.valueForKey("userInfo") != nil || self.userDefaults.valueForKey("deviceId") != nil  else {
            
            print("info doctor: \(userDefaults.objectForKey("infoDoctor"))", "authToken: \(userDefaults.objectForKey("authToken"))", "cookie: \(userDefaults.objectForKey("Cookie"))")
            return
            
        }
        
        let dataUserDef = self.userDefaults.valueForKey("teleUserInfo") as? NSDictionary
        userUID = dataUserDef!["UID"] as! String
        
        SingleTon.headers = [
            "Cookie" : self.userDefaults.valueForKey("Cookie") as! String,
            "Authorization": self.userDefaults.valueForKey("authToken") as! String,
            "systemtype": "IOS",
            "deviceId": self.userDefaults.valueForKey("deviceId") as! String,
            "useruid": dataUserDef!["UID"] as! String,
            "appid": NSBundle.mainBundle().bundleIdentifier! as String
        ]
    }
    
    override func viewWillAppear(animated: Bool) {
        navigationController?.setNavigationBarHidden(true, animated: true)
    }
    
    override func viewDidAppear(animated: Bool) {
        
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            
            SingleTon.socket.onAny {
                if let event: String! = $0.event {
                    if event != "onlineUser" {
                        print("on any events: \($0.event) with items \($0.items)")
                    }
                }
            }
            
            SingleTon.socket.on("connect") { data, ack in
                print("SOCKET CONNECTED")
                
                guard self.userUID != nil && !self.userUID.isEmpty else {
                    print("Error JOINROOM Socket")
                    return
                }
                
                SingleTon.socket.emit("get", ["url": NSString(format: JOIN_ROOM, self.userUID!)])
            }
            
            SingleTon.socket.on("onlineUser") { data, ack in
                SingleTon.onlineUser_Singleton.removeAll()
                NSNotificationCenter.defaultCenter().postNotificationName("reloadDataTable", object: self)
            }
            
            
            SingleTon.socket.on("receiveMessage") { data, ack in
                let result = JSON(data[0])
                NSNotificationCenter.defaultCenter().postNotificationName("handleCallNotification", object: nil, userInfo: ["message": result["message"].stringValue])
            }
            
            SingleTon.socket.on("errorMsg") { data, ack in
                debugPrint("error event: ", data)
            }
            
        })
        SingleTon.socket.connect()
        
        request(.GET, GENERATESESSION, headers: SingleTon.headers)
            .responseJSONReToken() { response in
                
                guard response.2.error == nil else {
                    if let data = response.2.data {
                        JSSAlertView().warning(self, title: "Error", text: resJSONError(data))
                    }
                    print("error calling GET", response.2.error!)
                    return
                }
                
                if let data = response.2.value {
                    if let readableJSON: NSDictionary = data["data"] as? NSDictionary {
                        SingleTon.infoOpentok = JSON(readableJSON)
                    }
                }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        let trimSegueName = segue.identifier!.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        if trimSegueName == "TeleListAppointment" {
            _ = segue.destinationViewController as! AppointmentListViewController
            SingleTon.flagSegue = true
        } else if trimSegueName == "WAListAppointment" {
            _ = segue.destinationViewController as! AppointmentListViewController
            SingleTon.flagSegue = false
        }
    }
    
    //    Handle NotificationCenter Login again application
    func handleExToken(notice: NSNotification) {
        if notice.name == "expireToken" {
            let userInfo : Dictionary<String, String!> = notice.userInfo as! Dictionary<String,String!>
            let message : String! = userInfo["message"]
            switch message {
            case "RefreshLogin":
                guard let oldRefCode: String = userDefaults.valueForKey("refCode") as? String else {
                    print("NSUserDefault not set refCode when login success this is refCode : \(userDefaults.valueForKey("refCode"))")
                    return
                }
                
                print("---refreshCode send request new token--- \(oldRefCode)")
                let param = ["refreshCode": oldRefCode]
                
                request(.POST, GET_NEW_TOKEN, headers: SingleTon.headers, parameters: param).responseJSON { response in
                    
                    guard response.2.error == nil else {
                        if let data = response.2.data {
                            JSSAlertView().warning(self, title: "Error", text: resJSONError(data))
                        }
                        print("Error calling, server response -> ", response.2.error!)
                        return
                    }
                    
                    if let value: AnyObject = response.2.value {
                        let readableJSON = JSON(value)
                        if let newRefCode: String! = readableJSON["refreshCode"].stringValue {
                            if oldRefCode != newRefCode {
                                SingleTon.headers["Authorization"] = "Bearer \(readableJSON["token"].stringValue)"
                                self.userDefaults.setValue(readableJSON["refreshCode"].stringValue, forKey: "refCode")
                                self.userDefaults.setValue("Bearer \(readableJSON["token"].stringValue)", forKey: "authToken")
                                print("set new token and refresh code success!")
                            }
                        }
                    }
                }
            case "LoginAgain":
                NSUserDefaults.standardUserDefaults().removeObjectForKey("userInfo")
                NSUserDefaults.standardUserDefaults().removeObjectForKey("teleUserInfo")
                NSUserDefaults.standardUserDefaults().removeObjectForKey("authToken")
                NSUserDefaults.standardUserDefaults().removeObjectForKey("refCode")
                NSUserDefaults.standardUserDefaults().removeObjectForKey("deviceId")
                
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    let alert = UIAlertController(title: "Error", message: err_Mess_sessionExpired, preferredStyle: .Alert)
                    alert.addAction(UIAlertAction(title: "Ok", style: .Default, handler: { (UIAlertAction) -> Void in
                        if let loginVC = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("LoginView") as? LoginViewController {
                            self.presentViewController(loginVC, animated: true, completion: nil)
                        }
                    }))
                    self.presentViewController(alert, animated: true, completion: nil)
                })
            default:
                break;
            }
        }
    }
}

// Custom Response Reset Token For All Reuqest
extension Request {
    public static func ResponseJSONReToken(options options: NSJSONReadingOptions = .AllowFragments) -> GenericResponseSerializer<AnyObject> {
        return GenericResponseSerializer { req, res, data in
            
            guard let validData = data, let resHeaderAll = res, let oldCookie: String = NSUserDefaults.standardUserDefaults().valueForKey("Cookie") as? String else {
                let failureReason = "JSON could not be serialized because input data was nil."
                let error = Error.errorWithCode(.JSONSerializationFailed, failureReason: failureReason)
                return .Failure(data, error)
            }
            
            if let valueHeader: AnyObject = resHeaderAll.allHeaderFields {
                let readJSON = JSON(valueHeader)
                if let newCookie: String! = readJSON["Set-Cookie"].stringValue {
                    if !newCookie.isEmpty && oldCookie != newCookie {
                        NSUserDefaults.standardUserDefaults().setValue(newCookie, forKey: "Cookie")
                    }
                }
            }
            //  Logic reset token
            if resHeaderAll.statusCode != 200 {
                switch resHeaderAll.statusCode {
                case 202:
                    if let jsonHeader: JSON = JSON(resHeaderAll.allHeaderFields) {
                        if let requireToken: Bool = jsonHeader["requireupdatetoken"].boolValue {
                            if requireToken {
                                NSNotificationCenter.defaultCenter().postNotificationName("expireToken", object: nil, userInfo: ["message": "RefreshLogin"])
                            }
                        }
                    }
                case 401:
                    print("extension Request func ResponseJSONReToken --- \(resHeaderAll.statusCode)")
                    do {
                        let json = try NSJSONSerialization.JSONObjectWithData(validData, options: options)
                        print("extension Request func ResponseJSONReToken --- \(json)")
                        if let errList = json["ErrorsList"]!!.description {
                            if errList.lowercaseString.rangeOfString("notauthenticated") != nil {
                                NSNotificationCenter.defaultCenter().postNotificationName("expireToken", object: nil, userInfo: ["message": "LoginAgain"])
                            } else {
                                print("not exist notAuthenticated")
                            }
                        }
                    } catch let error as NSError {
                        print("Failed to load: \(error.localizedDescription)")
                    }
                default:
                    print("extension Request func ResponseJSONReToken --- \(resHeaderAll.statusCode)")
                    do {
                        let json = try NSJSONSerialization.JSONObjectWithData(validData, options: options)
                        print("extension Request func ResponseJSONReToken --- \(json)")
                        NSNotificationCenter.defaultCenter().postNotificationName("expireToken", object: nil, userInfo: ["message": "RefreshLogin"])
                    } catch let error as NSError {
                        print("Failed to load: \(error.localizedDescription)")
                    }
                }
            }
            
            do {
                let JSON = try NSJSONSerialization.JSONObjectWithData(validData, options: options)
                return .Success(JSON)
            } catch {
                return .Failure(data, error as NSError)
            }
        }
    }
    
    public func responseJSONReToken(options options: NSJSONReadingOptions = .AllowFragments,completionHandler: (NSURLRequest?, NSHTTPURLResponse?, Result<AnyObject>) -> Void)-> Self {
        return response(responseSerializer: Request.ResponseJSONReToken(options: options), completionHandler: completionHandler)
    }
    
}

func resJSONError(debugDesc: AnyObject?) -> String {
    do {
        let json = try NSJSONSerialization.JSONObjectWithData(debugDesc as! NSData, options: []) as! [String: AnyObject]
        return (json["ErrorType"]?.stringValue)!
    } catch let error as NSError {
        print("Failed to load: \(error.localizedDescription)")
        return "Failed to load data"
    }
}

