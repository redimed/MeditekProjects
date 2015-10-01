//
//  ViewController.swift
//  Telehealth Doctor
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class ViewController: UIViewController,UITextFieldDelegate {

    @IBOutlet var usernameTextField: DesignableTextField!
    @IBOutlet var passwordTextField: DesignableTextField!
    
    @IBOutlet var usernameImageView: SpringImageView!
    @IBOutlet var passwordImageView: SpringImageView!
    // declare 
    let color = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    // Array 
   
       override func viewDidLoad() {
        super.viewDidLoad()
        usernameTextField.delegate = self
        passwordTextField.delegate = self
        
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func LoginButtonAction(sender: UIButton) {
        performSegueWithIdentifier("LoginSegue", sender: self)
    }
    func textFieldDidBeginEditing(textField: UITextField) {
        if textField == usernameTextField {
            usernameImageView.image = UIImage(named: "Medical-Doctor-101")
            usernameImageView.animate()
        
        }else{
            usernameImageView.image = UIImage(named: "Medical-Doctor-100")
            
        }
        if textField == passwordTextField {
            passwordImageView.image = UIImage(named: "Lock Filled-100")
            passwordImageView.animate()
        }else {
            passwordImageView.image = UIImage(named: "Lock-100")
//            checkValid(passwordTextField)
           
        }
        
    }
    func textFieldDidEndEditing(textField: UITextField){
        usernameImageView.image = UIImage(named: "Medical-Doctor-100")
        passwordImageView.image = UIImage(named: "Lock-100")
      
        
    }
    
    @IBAction func userAction(sender: DesignableTextField) {
        checkValid(usernameTextField)
    }
 
    
    func checkValid(field:DesignableTextField){
        if (field.text == "") {
            field.layer.borderColor = color.CGColor
            field.layer.borderWidth = 1
            field.cornerRadius = 4
            
        } else {
             field.layer.borderWidth = 0
        }
    }

}

