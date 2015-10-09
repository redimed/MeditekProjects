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
    
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var buttonLogin: UIButton!
    @IBOutlet weak var backgroundImage: UIImageView!
    @IBOutlet weak var lockImage: UIImageView!
    @IBOutlet weak var doctorImage: UIImageView!
    @IBOutlet weak var viewModal: DesignableView!
    @IBOutlet weak var logoImage: UIImageView!
    @IBOutlet weak var errorLoginLabel: UILabel!
    
    let customUIViewController : CustomViewController = CustomViewController()
    let appDelegate : AppDelegate = AppDelegate()
    let reachability = Reachability.reachabilityForInternetConnection()
    // declare loading indicator
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView(frame: CGRect(x:220.0, y:65.0, width:80.0, height:80.0))
    let userDefault = NSUserDefaults.standardUserDefaults()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        customUIViewController.TextFieldLogin(usernameTextField, active: false, imageTextField: doctorImage)
        customUIViewController.TextFieldLogin(passwordTextField, active: false, imageTextField: lockImage)
        customUIViewController.BlurLayer(backgroundImage)
        usernameTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        passwordTextField.clearButtonMode = UITextFieldViewMode.WhileEditing
        viewModal.layer.cornerRadius = 15
        viewModal.animation = "squeezeDown"
        viewModal.animate()
        
        self.usernameTextField.delegate = self
        self.passwordTextField.delegate = self
        
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
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        usernameTextField.resignFirstResponder()
        passwordTextField.resignFirstResponder()
        performAction()
        return true
    }
    
    func performAction() {
        if(!usernameTextField.text!.isEmpty && !passwordTextField.text!.isEmpty){
            LoginButtonAction(buttonLogin)
        } else {
            print("No go func Login")
        }
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
        loading.indicatorColor = UIColor.redColor()
        loading.indicatorStyle = DTIIndicatorStyle.convInv(.chasingDots)
        loading.startActivity()
        
        if let reachability = reachability {
            if reachability.isReachable() {
                NSTimer.scheduledTimerWithTimeInterval(2.0, target: self, selector: "LoginMain", userInfo: nil, repeats: false)
                if reachability.isReachableViaWiFi() {
                    print("Reachable via Wifi")
                } else {
                    print("Reachable via Celluar")
                }
            } else {
                AlertWarningNetwork()
                self.loading.stopActivity(true)
                self.logoImage.hidden = false
            }
        }
    }
    
    func LoginMain() {
        let username : String = usernameTextField.text!
        let password : String = passwordTextField.text!
        let paramester = ["username": username, "password": password]
        
        Alamofire.request(.POST, AUTHORIZATION, parameters: paramester)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { data -> Void in
                self.loading.stopActivity(true)
                self.logoImage.hidden = false
                print("\(data.0) ----- \(data.1) ----- \(data.2)")
                if(String(data.2) == "SUCCESS") {
                    let response = JSON(data.2.value!) as JSON
                    let user = data.2.value!["user"] as! NSDictionary
                    let dictionNary = [ "ID" : String(user["ID"]),
                        "UID" : String(user["UID"]),
                        "activated" : String(user["activated"]),
                        "email" : String(user["email"]),
                        "phoneNumber" : String(user["phoneNumber"]),
                        "userName" : String(user["userName"]),
                        "userType" : String(user["userType"])] as NSDictionary
                    self.userDefault.setObject(dictionNary, forKey: "infoDoctor")
                    self.userDefault.setValue(String(response["token"]), forKey: "token")
                    let initViewController : UIViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("navigation") as! UINavigationController
                    self.presentViewController(initViewController, animated: true, completion: nil)
                } else {
                    if(data.1 == nil) {
                        self.errorLogin("Could not connect to server!")
                    }else {
                        self.errorLogin("Wrong username or password. Please try again!")
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
        self.buttonLogin.backgroundColor = UIColor(hex: "003366").colorWithAlphaComponent(0.6)
    }
    
    func AlertWarningNetwork() {
        JSSAlertView().warning(self, title: "No Connection", text: "Unable to connect to the Internet")
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
