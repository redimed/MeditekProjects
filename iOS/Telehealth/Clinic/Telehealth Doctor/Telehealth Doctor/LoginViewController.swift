//
//  ViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyen on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import Spring
import SwiftyJSON
import ReachabilitySwift

class LoginViewController: UIViewController {
    
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var buttonLogin: UIButton!
    @IBOutlet weak var viewModal: DesignableView!
    @IBOutlet weak var errorLoginLabel: UILabel!
    @IBOutlet weak var versionLabel: UILabel!
    
    let customUIViewController : CustomViewController = CustomViewController()
    let reachability = Reachability.reachabilityForInternetConnection()
    
    // declare loading indicator
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView(frame: CGRect(x:110.0, y:200, width:90, height:25))
    let userDefault = NSUserDefaults.standardUserDefaults()
    let deviceId = (UIDevice.currentDevice().identifierForVendor?.UUIDString)! as String
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewWillAppear(animated: Bool) {
        
        usernameTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        passwordTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        
        self.usernameTextField.becomeFirstResponder()
        
        buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(0.6)
        
        viewModal.animation = "squeezeDown"
        viewModal.animate()
        
        versionLabel.text = UIApplication.versionBuild()
        self.userDefault.setValue(deviceId, forKey: "deviceId")
        
    }
    
    override func viewDidAppear(animated: Bool) {
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reachabilityChanged:", name: ReachabilityChangedNotification, object: reachability)
        reachability?.startNotifier()
        if let reachability = reachability {
            if reachability.isReachable() {
                if reachability.isReachableViaWiFi() {
                    print("Reachable via Wifi")
                } else {
                    print("Reachable via Celluar")
                }
            } else {
                NSTimer.scheduledTimerWithTimeInterval(2, target: self, selector: "AlertWarningNetwork", userInfo: nil, repeats: false)
            }
        }
        
        /**
        *  Test first connection to server
        *
        *  @param .GET            .GET method
        *  @param URL_SERVER_3006 server for authorization
        *
        */
        request(.GET, URL_SERVER_3006)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                
                if let headerRes = response.1?.allHeaderFields {
                    let jsonRes: JSON = JSON(headerRes)
                    if let cookies: String = jsonRes["Set-Cookie"].stringValue {
                        if !cookies.isEmpty {
                            self.userDefault.setValue(cookies, forKey: "Cookie")
                            print("Successful connect to server")
                        }
                    }
                }
        }
    }
    
    func reachabilityChanged(note: NSNotification) {
        let reachability = note.object as! Reachability
        
        if reachability.isReachable() {
            if reachability.isReachableViaWiFi() {
                print("Reachable via Wifi")
            } else {
                print("Reachable via Celluar")
            }
        } else {
            print("No network")
        }
    }
    
    func performAction() {
        if(!usernameTextField.text!.isEmpty && !passwordTextField.text!.isEmpty){
            LoginButtonAction(buttonLogin)
        } else {
            print("No go func Login")
        }
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        usernameTextField.resignFirstResponder()
        passwordTextField.resignFirstResponder()
        performAction()
        return true
    }
    
    @IBAction func textFieldEditingChange(sender: AnyObject) {
        errorLoginLabel.text = ""
        if(!usernameTextField.text!.isEmpty && !passwordTextField.text!.isEmpty){
            buttonLogin.enabled = true
            buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(1)
        } else {
            buttonLogin.enabled = false
            buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(0.6)
        }
    }
    
    @IBAction func LoginButtonAction(sender: UIButton) {
        self.buttonLogin.enabled = false
        self.buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(0.6)
        usernameTextField.resignFirstResponder()
        passwordTextField.resignFirstResponder()
        self.viewModal.addSubview(self.loading)
        loading.indicatorColor = UIColor(hex: "34AADC")
        loading.indicatorStyle = DTIIndicatorStyle.convInv(.spotify)
        loading.startActivity()
        
        if let reachability = reachability {
            if reachability.isReachable() {
                NSTimer.scheduledTimerWithTimeInterval(2.0, target: self, selector: "LoginMain", userInfo: nil, repeats: false)
                
            } else {
                AlertWarningNetwork()
                self.loading.stopActivity(true)
                self.buttonLogin.enabled = true
            }
        }
    }
    
    func LoginMain() {
        
        let username : String = usernameTextField.text!
        let password : String = passwordTextField.text!
        
        let paramester = ["UserName": username, "Password": password]
        
        let headerLogin = [
            "systemtype": "IOS",
            "deviceId": self.userDefault.valueForKey("deviceId") as! String,
            "appid": NSBundle.mainBundle().bundleIdentifier! as String
        ]
        
        request(.POST, AUTHORIZATION, parameters: paramester, headers: headerLogin)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                switch response.2 {
                case .Success:
                    
                    let userJSON = JSON(response.2.value!["user"] as! NSDictionary)
                    
                    var user = [String: String]()
                    for (key, object) in userJSON {
                        user[key] = object.stringValue
                    }
                    
                    self.userDefault.setObject(user, forKey: "userInfo")
                    self.userDefault.setValue("Bearer \(response.2.value!["token"] as! String)", forKey: "authToken")
                    self.userDefault.setValue(response.2.value!["refreshCode"] as! String, forKey: "refCode")
                    
                    let headergetUser = [
                        "Cookie" : NSUserDefaults.standardUserDefaults().valueForKey("Cookie") as! String,
                        "Authorization": NSUserDefaults.standardUserDefaults().valueForKey("authToken") as! String,
                        "systemtype": "IOS",
                        "deviceId": self.userDefault.valueForKey("deviceId") as! String,
                        "useruid": userJSON["UID"].stringValue,
                        "appid": NSBundle.mainBundle().bundleIdentifier! as String
                    ]
                    
                    request(.GET, GET_TELEUSER+userJSON["UID"].stringValue, headers: headergetUser)
                        .validate(statusCode: 200..<300)
                        .validate(contentType: ["application/json"])
                        .responseJSON { response -> Void in
                            
                            guard response.2.error == nil else {
                                print("error get data tele user info", response.2.error!)
                                return
                            }
                            
                            if let value: AnyObject = response.2.value {
                                let readableJSON = JSON(value)
                                
                                var user = [String: String]()
                                for (key, object) in readableJSON {
                                    user[key] = object.stringValue
                                }
                                self.userDefault.setObject(user, forKey: "teleUserInfo")
                                let initViewController : UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("navigation") as! UINavigationController
                                self.presentViewController(initViewController, animated: true, completion: nil)
                                self.loading.stopActivity(true)
                            }
                    }
                    break
                case .Failure(_, _):
                    self.loading.stopActivity(true)
                    if let data = response.2.data {
                        do {
                            let json = try NSJSONSerialization.JSONObjectWithData(data, options: []) as! [String: AnyObject]
                            print(json)
                            if let errorType = json["ErrorType"] as? String {
                                if let codeErr: Int = response.1?.statusCode {
                                    switch codeErr{
                                    case 401:
                                        self.errorLogin("Username or password invalid")
                                        break;
                                    default:
                                        self.errorLogin("\(errorType)")
                                        break
                                    }
                                }
                            }
                        } catch let error as NSError {
                            self.errorLogin("\(error.localizedDescription)")
                        }
                    }
                }
        }
    }
    
    func errorLogin(message: String) {
        self.viewModal.animation = "pop"
        self.viewModal.duration = 1
        self.viewModal.animate()
        self.errorLoginLabel.text = message
        self.passwordTextField.text = ""
        self.buttonLogin.enabled = false
        self.buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(0.6)
    }
    
    func AlertWarningNetwork() {
        JSSAlertView().show(self, title: err_Mess_Network)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}


extension UIApplication {
    class func appVersion() -> String {
        return NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString") as! String
    }
    
    class func appBuild() -> String {
        return NSBundle.mainBundle().objectForInfoDictionaryKey(kCFBundleVersionKey as String) as! String
    }
    
    class func versionBuild() -> String {
        let version = appVersion(), build = appBuild()
        
        return version == build ? "© REDIMED 2015 Clinic App v\(version)" : "© REDIMED 2015 Clinic App v\(version)(\(build))"
    }
}