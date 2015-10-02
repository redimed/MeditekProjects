//
//  ViewController.swift
//  Telehealth Doctor
//
//  Created by Giap Vo Duc on 9/22/15.
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
    
    let customUIViewController : CustomViewController = CustomViewController()
    let appDelegate : AppDelegate = AppDelegate()
    let reachability = Reachability.reachabilityForInternetConnection()
    
    
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
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        usernameTextField.resignFirstResponder()
        passwordTextField.resignFirstResponder()
        performAction()
        return true
    }
    
    func performAction() {
        if(!usernameTextField.text!.isEmpty && !passwordTextField.text!.isEmpty){
            print("Go func Login")
        } else {
            print("No go func Login")
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
    
    override func viewWillAppear(animated: Bool) {
        
        reachability!.whenReachable = { reachability in
            dispatch_async(dispatch_get_main_queue()) {
                if reachability.isReachableViaWiFi() {
                    print("Reachable via WiFi")
                } else {
                    print("Reachable via Cellular")
                }
            }
        }
        reachability!.whenUnreachable = { reachability in
            dispatch_async(dispatch_get_main_queue()) {
                print("Not reachable")
            }
        }
        
        reachability!.startNotifier()
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
        //        var flag = false
        //        if let reachability = reachability {
        //            if reachability.isReachable() {
        //                flag = true
        //                if reachability.isReachableViaWiFi() {
        //                    print("Reachable via Wifi")
        //                } else {
        //                    print("Reachable via Celluar")
        //                }
        //            } else {
        //                AlertWarningNetwork()
        //            }
        //        }
        //
        //        if (flag == true) {
        let username : String = usernameTextField.text!
        let password : String = passwordTextField.text!
        let paramester = ["username": username, "password": password]
        
        Alamofire.request(.POST, AUTHORIZATION, parameters: paramester).responseJSON() { data in
            let response = JSON(data.2.value!) as JSON
            print("response - ", data)
            if(response["status"] != "error") {
                let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                let initViewController : UIViewController = storyBoard.instantiateViewControllerWithIdentifier("navigation") as! UINavigationController
                self.presentViewController(initViewController, animated: true, completion: nil)
                
                
            }
        }
        //        }
        //
        // viewModal.animation = "pop"
        // viewModal.duration = 1
        // viewModal.animate()
        //
        
    }
    
    func AlertWarningNetwork() {
        JSSAlertView().warning(self, title: "No Connection", text: "Unable to connect to the Internet")
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

