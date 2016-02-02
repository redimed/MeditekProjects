//
//  ConfirmRequestTelehealthViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/20/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
class ConfirmRequestTelehealthViewController: UIViewController {
    var telehealthData = TelehealthContainer!()
    let requestTelehealthService = RequestTelehealthService()
    let appointmentService  = AppointmentService()
    let alertView = UIAlertView()
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var surburbLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var fullNameLabel: UILabel!
    @IBOutlet weak var dateTime: UILabel!
    
    var fileUpload = [String]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        dateTime.text = requestTelehealthService.NowDate()
        
        fullNameLabel.text = "\(telehealthData.FirstName) \(telehealthData.LastName)"
        phoneNumberLabel.text = "Phone: " + telehealthData.PhoneNumber
        surburbLabel.text = "Suburb: " + telehealthData.Suburb
        dobLabel.text = "Date of Birth: " + telehealthData.DOB
        emailLabel.text = "Email: " + telehealthData.Email1
        
    }
    
    
    @IBAction func completeRequestAction(sender: AnyObject) {
        uploadImage()
    }
    
    var countImage = 0
    var UserUID = String()
    func uploadImage(){
        if let userUID = defaults.valueForKey("userUID") as? String {
            UserUID = userUID
            if telehealthData.imageTelehealth.count == 0 {
                requestTelehealth()
            }else {
                uploadImageReq(UserUID)
            }
            
        }else {
            requestTelehealth()
        }
        
    }
    
    //Upload image to user
    func uploadImageReq(userUID:String){
        if countImage < telehealthData.imageTelehealth.count  {
            let img : UIImage = telehealthData.imageTelehealth[countImage]
            appointmentService.uploadImage(img, userUID: userUID, compailer: {
                response in
                if response["message"] == "success"{
                    let  fileUID = response["data"].string! as String
                    self.fileUpload.append(fileUID)
                    self.countImage++
                    self.uploadImageReq(self.UserUID)
                    print(self.fileUpload)
                    if self.countImage >= self.telehealthData.imageTelehealth.count{
                        self.requestTelehealth()
                    }
                }else {
                    self.view.hideLoading()
                    print("error",response["ErrorType"])
                    let error = response["ErrorType"].string
                    self.alertView.alertMessage("Error", message: error!)
                }
            })
        }
        
        
    }
    
    func requestTelehealth(){
        requestTelehealthService.requestTelehealth(dateTime.text!, Type: telehealthData.typeTelehealth, Description: telehealthData.description, FirstName: telehealthData.FirstName, LastName: telehealthData.LastName, PhoneNumber: telehealthData.PhoneNumber, HomePhoneNumber: telehealthData.HomePhoneNumber, Suburd: telehealthData.Suburb, DOB: telehealthData.DOB, Email: telehealthData.Email1,FileUploads:fileUpload,handler: {
            response in
            if response["status"] == "success"{
                self.alertView.alertMessage("Success", message: "Request Telehealth Success!")
                self.performSegueWithIdentifier("unwindToHomeSegue", sender: self)
            }else {
                self.alertView.alertMessage("Error", message: "\(response["ErrorType"])")
            }
        })
        
    }
    
    
}
