//
//  ChangePinNumberViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/9/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class ChangePinNumberViewController: BaseViewController {
    
    
    @IBOutlet weak var txtOldPinNumber: DesignableTextField!
    @IBOutlet weak var txtPinNumber: DesignableTextField!
    @IBOutlet weak var txtConfirmPinNumber: DesignableTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtOldPinNumber.delegate = self
        txtPinNumber.delegate = self
        txtConfirmPinNumber.delegate = self 
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let hashValue = string.hash
        let length = ((textField.text?.length)! + string.length)
        if Context.validateInputOnlyNumber(hashValue) == false || length > 6 {
            return false
        }else{
            return true
        }
    }
    @IBAction func ActionChangePinNumber(sender: AnyObject) {
        
        if(txtPinNumber.text == txtConfirmPinNumber.text && txtPinNumber.text != "" && txtPinNumber.text?.length <= 6 && txtConfirmPinNumber.text != "" && txtOldPinNumber.text != "" && txtOldPinNumber.text?.length <= 6 && txtConfirmPinNumber.text?.length <= 6 && Context.CheckRegex(txtPinNumber.text!,regex:Define.Regex.PinNumber) && Context.CheckRegex(txtOldPinNumber.text!,regex:Define.Regex.PinNumber) && Context.CheckRegex(txtConfirmPinNumber.text!,regex:Define.Regex.PinNumber)){
            
            let updatePinNumber : UpdatePinNumber = UpdatePinNumber()
            updatePinNumber.oldPin = txtOldPinNumber.text!
            updatePinNumber.newPin = txtPinNumber.text!
            
            UserService.postUpdatePinNumber(updatePinNumber) { [weak self] (response) in
                print(response)
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            if let dataTeleheathUserDetail = Mapper<DataPatientDetail>().map(response.result.value) {
                                if dataTeleheathUserDetail.message == "success"  {
                                    self!.alertView.alertMessage("Success", message: "Update Pin Number Success!")
                                    self!.navigationController?.popViewControllerAnimated(true)
                                }else{
                                    if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                        self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                    }
                                }
                            }
                        }
                    } else {
                        self?.showMessageNoNetwork()
                    }
                    
                }
            }
        }else{
            txtPinNumber.animation = "shake"
            txtPinNumber.curve = "easeIn"
            txtPinNumber.force = 2.0
            txtPinNumber.duration = 0.5
            txtPinNumber.animate()
        }
    }
}
