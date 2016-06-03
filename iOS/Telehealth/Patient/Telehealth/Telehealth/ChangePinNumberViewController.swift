//
//  ChangePinNumberViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/9/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper

class ChangePinNumberViewController: BaseViewController {
    
    
    @IBOutlet weak var txtPinNumber: DesignableTextField!
    @IBOutlet weak var txtConfirmPinNumber: DesignableTextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtPinNumber.delegate = self
        txtConfirmPinNumber.delegate = self 
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let hashValue = string.hash
        let length = ((textField.text?.length)! + string.length)
        if config.validateInputOnlyNumber(hashValue) == false || length > 6 {
            return false
        }else{
            return true
        }
    }
    @IBAction func ActionChangePinNumber(sender: AnyObject) {
        if(txtPinNumber.text == txtConfirmPinNumber.text && txtPinNumber.text != "" && txtPinNumber.text?.length <= 6 && txtConfirmPinNumber.text != ""){
            
            let updatePinNumber : UpdatePinNumber = UpdatePinNumber()
            updatePinNumber.oldPin = txtPinNumber.text!
            updatePinNumber.newPin = txtConfirmPinNumber.text!
            
            UserService.postUpdatePinNumber(updatePinNumber) { [weak self] (response) in
                print(response)
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            if let dataTeleheathUserDetail = Mapper<DataTeleheathUserDetail>().map(response.result.value) {
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
