//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit


class VerifyViewController: UIViewController,UITextFieldDelegate {
    @IBOutlet var textFieldVerifyCode1: DesignableTextField!
    @IBOutlet var textFieldVerifyCode2: DesignableTextField!
    @IBOutlet var textFieldVerifyCode3: DesignableTextField!
    @IBOutlet var textFieldVerifyCode4: DesignableTextField!
    @IBOutlet weak var verifyView: SpringView!
    //color red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    let config = ConfigurationSystem()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        textFieldVerifyCode1.delegate = self
        textFieldVerifyCode2.delegate = self
        textFieldVerifyCode3.delegate = self
        textFieldVerifyCode4.delegate = self
       
        
    }
    //close keyboard if out touch text field
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)

    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
 
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    @IBAction func textFieldAction1(sender: AnyObject) {
        if textFieldVerifyCode1.text?.length == 1 {
            textFieldVerifyCode1.layer.borderWidth = 0
             textFieldVerifyCode2.becomeFirstResponder()
        }
    }
    @IBAction func textFieldAction2(sender: AnyObject) {
        if textFieldVerifyCode2.text?.length == 1 {
            textFieldVerifyCode2.layer.borderWidth = 0
            textFieldVerifyCode3.becomeFirstResponder()
        }
    }
    @IBAction func textFieldAction3(sender: AnyObject) {
        if textFieldVerifyCode3.text?.length == 1 {
            textFieldVerifyCode3.layer.borderWidth = 0
            textFieldVerifyCode4.becomeFirstResponder()
        }
    }
    //Handle verify code and check field is valid
    @IBAction func VerifyButtonAction(sender: UIButton) {
        if textFieldVerifyCode1.text == "" || textFieldVerifyCode2.text == "" || textFieldVerifyCode3.text == "" || textFieldVerifyCode4.text == "" {
            //Start animation
                verifyView.animation = "shake"
                verifyView.curve = "easeIn"
                verifyView.force = 2.0
                verifyView.duration = 0.5
                verifyView.animate()
            //End Animation
            
            checkTextFieldInvalid()

        } else {
            performSegueWithIdentifier("VerifyToHomeSegue", sender: self)
        }
        
    }
    
    //Check textfield maxlength == 1
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let length = ((textField.text?.length)! + string.length)
        if length > 1 {
            return false
        }else{
            return true
        }
     
    }
    //check each textfield and change border color is red
    func checkTextFieldInvalid(){
        if textFieldVerifyCode1.text == "" {
            config.borderTextFieldValid(textFieldVerifyCode1, color: colorCustom)
        }else if textFieldVerifyCode2.text == "" {
            config.borderTextFieldValid(textFieldVerifyCode2, color: colorCustom)
            
        } else if textFieldVerifyCode3.text == "" {
            config.borderTextFieldValid(textFieldVerifyCode3, color: colorCustom)
        } else if textFieldVerifyCode4.text == "" {
            config.borderTextFieldValid(textFieldVerifyCode4, color: colorCustom)
        }

    }

    

}
