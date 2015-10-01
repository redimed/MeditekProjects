//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit


class VerifyViewController: UIViewController,UITextFieldDelegate {

    @IBOutlet weak var textFieldVerifyCode: DesignableTextField!
    //color red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    
    let api = VerifyPhoneNumberController()

    
    override func viewDidLoad() {
        super.viewDidLoad()

        textFieldVerifyCode.delegate = self
               
        
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

    //Handle verify code and check field is valid
    @IBAction func VerifyButtonAction(sender: UIButton) {
        if textFieldVerifyCode.text == ""  {
            //Start animation
                textFieldVerifyCode.animation = "shake"
                textFieldVerifyCode.curve = "easeIn"
                textFieldVerifyCode.force = 2.0
                textFieldVerifyCode.duration = 0.5
                textFieldVerifyCode.animate()
            //End Animation
            
            //change border textfield is red
            config.borderTextFieldValid(textFieldVerifyCode, color: colorCustom)

        } else {
             view.showLoading()
            api.CheckVerifyPhoneNumber(textFieldVerifyCode.text!,deviceID: config.deviceID!){
                response in
                print(response)
                if response["status"] == "success"{
                     self.view.hideLoading()
                    let defaults = NSUserDefaults.standardUserDefaults()
                    defaults.setValue("Verified", forKey: "verifyUser")
                    defaults.synchronize()
                    self.performSegueWithIdentifier("VerifyToHomeSegue", sender: self)
                }else {
                    self.view.hideLoading()
                    print("Err")
                }
            }
        }
        
    }
    
    //Check textfield maxlength == 6
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let length = ((textField.text?.length)! + string.length)
        if length > 6 {
            return false
        }else{
            return true
        }
     
    }
   
  
    

}
