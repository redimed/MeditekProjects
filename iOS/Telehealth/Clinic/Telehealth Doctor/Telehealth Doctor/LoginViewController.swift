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
import ResponseDetective

class LoginViewController: UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var buttonLogin: DesignableButton!
    @IBOutlet weak var lockImage: UIImageView!
    @IBOutlet weak var doctorImage: UIImageView!
    @IBOutlet weak var viewModal: DesignableView!
    @IBOutlet weak var logoImage: UIImageView!
    @IBOutlet weak var errorLoginLabel: UILabel!
    @IBOutlet weak var versionLabel: UILabel!
    
    let customUIViewController : CustomViewController = CustomViewController()
    let reachability = Reachability.reachabilityForInternetConnection()
    // declare loading indicator
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView(frame: CGRect(x:210.0, y:65.0, width:80.0, height:80.0))
    let userDefault = NSUserDefaults.standardUserDefaults()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        customUIViewController.TextFieldLogin(usernameTextField, active: false, imageTextField: doctorImage)
        customUIViewController.TextFieldLogin(passwordTextField, active: false, imageTextField: lockImage)
        usernameTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        passwordTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        viewModal.layer.cornerRadius = 15
        viewModal.animation = "squeezeDown"
        viewModal.animate()
        
        self.usernameTextField.delegate = self
        self.passwordTextField.delegate = self
        self.usernameTextField.becomeFirstResponder()
        
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
        if(!usernameTextField.text!.isEmpty && !passwordTextField.text!.isEmpty){
            buttonLogin.enabled = true
            buttonLogin.backgroundColor = UIColor(hex: "003366").colorWithAlphaComponent(1)
        } else {
            buttonLogin.enabled = false
            buttonLogin.backgroundColor = UIColor(hex: "003366").colorWithAlphaComponent(0.6)
        }
    }
    
    @IBAction func textFieldEditingDidBegin(sender: AnyObject) {
        errorLoginLabel.text = ""
        if(sender.tag == 1) {
            customUIViewController.TextFieldLogin(usernameTextField, active: true, imageTextField: doctorImage)
        } else {
            customUIViewController.TextFieldLogin(passwordTextField, active: true, imageTextField: lockImage)
        }
    }
    
    @IBAction func textFieldEditingDidEnd(sender: AnyObject) {
        if(sender.tag == 1) {
            customUIViewController.TextFieldLogin(usernameTextField, active: false, imageTextField: doctorImage)
        } else {
            customUIViewController.TextFieldLogin(passwordTextField, active: false, imageTextField: lockImage)
        }
    }
    
    
    @IBAction func LoginButtonAction(sender: UIButton) {
        self.buttonLogin.enabled = false
        self.buttonLogin.backgroundColor = UIColor(hex: "003366").colorWithAlphaComponent(0.6)
        usernameTextField.resignFirstResponder()
        passwordTextField.resignFirstResponder()
        logoImage.hidden = true
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
                self.logoImage.hidden = false
                self.buttonLogin.enabled = true
            }
        }
    }
    
    func LoginMain() {
        let username : String = usernameTextField.text!
        let password : String = passwordTextField.text!
        let paramester = ["username": username, "password": password]
        
        let headerLogin = [
            "systemtype": "iOS",
            "deviceId": (UIDevice.currentDevice().identifierForVendor?.UUIDString)! as String
        ]
        
        request(.POST, AUTHORIZATION, parameters: paramester, headers: headerLogin)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                self.loading.stopActivity(true)
                //                print(response.2.debugDescription)
                //                let splitFirst = response.2.debugDescription.componentsSeparatedByString("{")
                //                let splitSecond = splitFirst[2].componentsSeparatedByString(",")
                //                let splitThird = splitSecond[0].componentsSeparatedByString(":")
                //                print(splitThird[1])
                //                if splitThird[1] == " \"User.notFound\"" {
                //                    print("User not found")
                //                } else if splitThird[1] == " \"Password.Invalid\"" {
                //                    print("Wrong pass")
                //                }
                switch response.2 {
                case .Success:
                    let userJSON = JSON(response.2.value!["user"] as! NSDictionary)
                    var user = [String: String]()
                    for (key, object) in userJSON {
                        user[key] = object.stringValue
                    }
                    let token = response.2.value!["token"] as! String
                    AUTHTOKEN = token
                    self.userDefault.setObject(user, forKey: "infoDoctor")
                    self.userDefault.setValue(token, forKey: "token")
                    
                    SingleTon.headers = [
                        "Authorization": "Bearer \(token)",
                        "systemtype": "iOS",
                        "deviceId": (UIDevice.currentDevice().identifierForVendor?.UUIDString)! as String,
                        "useruid": userJSON["UID"].stringValue
                    ]
                    
                    let initViewController : UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("navigation") as! UINavigationController
                    self.presentViewController(initViewController, animated: true, completion: nil)
                    break
                case .Failure(_, let error):
                    self.logoImage.hidden = false
                    if let codeErr: Int = response.1?.statusCode {
                        switch codeErr{
                        case 401:
                            self.errorLogin("Username or password invalid")
                            break;
                        default:
                            self.errorLogin("\((error as NSError).code) - \((error as NSError).localizedDescription)")
                            break
                        }
                    } else {
                        if let err : Int = (error as NSError).code {
                            switch err {
                            default:
                                self.errorLogin("\((error as NSError).code) - \((error as NSError).localizedDescription)")
                                break
                            }
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
        self.buttonLogin.backgroundColor = UIColor(hex: "003366").colorWithAlphaComponent(0.6)
        print(message)
        
    }
    
    func AlertWarningNetwork() {
        JSSAlertView().warning(self, title: warning_Network.title, text: warning_Network.mess)
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