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

class LoginViewController: UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var usernameTextField: DesignableTextField!
    @IBOutlet weak var passwordTextField: DesignableTextField!
    @IBOutlet weak var buttonLogin: DesignableButton!
    @IBOutlet weak var viewModal: DesignableView!
    @IBOutlet weak var errorLoginLabel: UILabel!
    @IBOutlet weak var versionLabel: UILabel!
    
    let customUIViewController : CustomViewController = CustomViewController()
    let reachability = Reachability.reachabilityForInternetConnection()
    // declare loading indicator
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView(frame: CGRect(x:110.0, y:200, width:90, height:25))
    let userDefault = NSUserDefaults.standardUserDefaults()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        usernameTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        passwordTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        buttonLogin.backgroundColor = UIColor(hex: "FF1300").colorWithAlphaComponent(0.6)
        
        viewModal.animation = "squeezeDown"
        viewModal.animate()
        
        self.usernameTextField.delegate = self
        self.passwordTextField.delegate = self
//        self.usernameTextField.becomeFirstResponder()
        
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
        versionLabel.text = UIApplication.versionBuild()
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardDidShow:", name: UIKeyboardDidShowNotification, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "keyboardDidHide:", name: UIKeyboardDidHideNotification, object: nil)
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
    
    func keyboardDidShow(notification: NSNotification) {
        self.viewModal.frame.origin.y -= 100
    }
    
    func keyboardDidHide(notification: NSNotification) {
        self.viewModal.frame.origin.y = 215
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
        
        let paramester = ["username": username, "password": password]
        
        let headerLogin = [
            "systemtype": "IOS",
            "deviceId": (UIDevice.currentDevice().identifierForVendor?.UUIDString)! as String,
            "appid": NSBundle.mainBundle().bundleIdentifier! as String
        ]
        
        request(.POST, AUTHORIZATION, parameters: paramester, headers: headerLogin)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                self.loading.stopActivity(true)
                
                switch response.2 {
                case .Success:
                    let userJSON = JSON(response.2.value!["user"] as! NSDictionary)
                    var user = [String: String]()
                    
                    for (key, object) in userJSON {
                        user[key] = object.stringValue
                    }
                    
                    self.userDefault.setObject(user, forKey: "infoDoctor")
                    self.userDefault.setValue("Bearer \(response.2.value!["token"] as! String)", forKey: "authToken")
                    self.userDefault.setValue(response.2.value!["refreshCode"] as! String, forKey: "refCode")
                    
                    if let headerResponse = response.1?.allHeaderFields {
                        if let jsonRes: JSON = JSON(headerResponse) {
                            if let cookies: String = jsonRes["Set-Cookie"].stringValue {
                                if !cookies.isEmpty {
                                    self.userDefault.setValue(cookies, forKey: "Cookie")
                                }
                            }
                        }
                    }
                    
                    let initViewController : UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("navigation") as! UINavigationController
                    self.presentViewController(initViewController, animated: true, completion: nil)
                    break
                case .Failure(_, _):
                    
                    if let data = response.2.data {
                        do {
                            let json = try NSJSONSerialization.JSONObjectWithData(data, options: []) as! [String: AnyObject]
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
                            print("Failed to load: \(error.localizedDescription)")
                        }
                    }
                }
        }
    }
    
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
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