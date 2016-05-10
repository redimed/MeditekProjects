//
//  ConfirmRequestTelehealthViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/20/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
class ConfirmRequestTelehealthViewController: UIViewController ,signatureDelegate {
    var telehealthData = TelehealthContainer!()
    let requestTelehealthService = RequestTelehealthService()
    let appointmentService  = AppointmentService()
    var patientInformation =  PatientContainer()
    let patientService = PatientService()
    let alertView = UIAlertView()
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var surburbLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var fullNameLabel: UILabel!
    @IBOutlet weak var dateTime: UILabel!
    @IBOutlet weak var imageSignature: UIImageView!
    
    @IBOutlet weak var btn1: UIButton!
    @IBOutlet weak var btn2: UIButton!
    @IBOutlet weak var btn3: UIButton!
    var b1  = false
    var b2  = false
    var b3  = false
    
    var imageOn = UIImage(named: "check on.png")
    var imageOff = UIImage(named: "check off.png")
    
    var dateText : String?
    var fileUpload = [[String:String]]()
    var countImage = 0
    var UserUID = String()
    var AppointmentSignatureUID :String = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        dateText = requestTelehealthService.NowDate()
        dateTime.text = dateText?.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.confirmDate)
        fullNameLabel.text = "\(telehealthData.FirstName) \(telehealthData.LastName)"
        phoneNumberLabel.text = "Phone: " + telehealthData.PhoneNumber
        surburbLabel.text = "Suburb: " + telehealthData.Suburb
        dobLabel.text = "DOB: " + telehealthData.DOB
        emailLabel.text = "Email: " + telehealthData.Email
        
    }
    override func viewWillAppear(animated: Bool) {
        if let _ = defaults.valueForKey("uid") as? String {
            if(AppointmentSignatureUID != ""){
                self.patientService.getImage((AppointmentSignatureUID), completionHandler: { image in
                    self.imageSignature.image = image
                })
            }
        }else{
           print("not login")
        }
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "FAQConfirmSegue" {
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "FAQs"
        }else if segue.identifier == "SignatureSegue"{
            let updateSignature = segue.destinationViewController as! SignatureViewController
            updateSignature.delegate = self
            updateSignature.checkConfimRequest = "true"
            updateSignature.patientUID = ConfigurationSystem.uploadfileID
        }
    }
    func updateSignature(controller: SignatureViewController, sender: UIImage,imageUID:String) {
        AppointmentSignatureUID = imageUID
        imageSignature.image = sender
        
    }
    
    @IBAction func completeRequestAction(sender: AnyObject) {
        if b1 == false || b2 == false ||  b3 == false {
            alertView.alertMessage("", message: "Please accept consent and submit booking request")
        }else{
            print("AppointmentSignatureUID",AppointmentSignatureUID)
            if(AppointmentSignatureUID == ""){
                alertView.alertMessage("", message: "Please sign concents form before booking an appoinment with Redimed")
            }else{
                self.view.showLoading()
                uploadImage()
            }
        }
    }
    
    //Checkupload Image
    
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
                    self.fileUpload.append(["UID":fileUID])
                    self.countImage++
                    self.uploadImageReq(self.UserUID)
                    if self.countImage >= self.telehealthData.imageTelehealth.count{
                        self.view.hideLoading()
                        self.requestTelehealth()
                    }
                }else {
                    
                    self.view.hideLoading()
                    let error = response["ErrorType"].string
                    self.alertView.alertMessage("Error", message: error!)
                }
            })
        }
    }
    
    func requestTelehealth(){
        
        requestTelehealthService.requestTelehealth(dateText!, Type: telehealthData.typeTelehealth, Description: telehealthData.description, FirstName: telehealthData.FirstName, LastName: telehealthData.LastName, PhoneNumber: telehealthData.PhoneNumber, HomePhoneNumber: telehealthData.HomePhoneNumber, Suburd: telehealthData.Suburb, DOB: telehealthData.DOB, Email: telehealthData.Email,FileUploads:fileUpload,AppointmentSignatureUID:AppointmentSignatureUID,handler: {
            response in
            if response["status"] == "success"{
                self.view.hideLoading()
                self.alertView.alertMessage("Success", message: "Request Appointment Success!")
                self.performSegueWithIdentifier("unwindToHomeSegue", sender: self)
            }else {
                self.view.hideLoading()
                self.alertView.alertMessage("Error", message: "\(response["ErrorType"])")
            }
        })
        
        
        
        
    }
    
    @IBAction func buttonAction(sender: AnyObject) {
        if sender.tag == 0 {
            if b1 == false {
                btn1.setImage(imageOn , forState: .Normal)
                b1 = true
            }else {
                btn1.setImage(imageOff , forState: .Normal)
                b1 = false
            }
        }else if sender.tag == 1 {
            if b2 == false {
                btn2.setImage(imageOn , forState: .Normal)
                b2 = true
            }else {
                btn2.setImage(imageOff , forState: .Normal)
                b2 = false
            }
            
        }else {
            if b3 == false {
                btn3.setImage(imageOn , forState: .Normal)
                b3 = true
            }else {
                btn3.setImage(imageOff , forState: .Normal)
                b3 = false
            }
            
        }
        
        
    }
    
    func checkRadiobtn(index:Int){
        var arr = [btn1,btn2,btn3]
        var check =  [b1,b2,b3]
        for var i = 0 ; i < arr.count; i++ {
            if i == index {
                arr[i].setImage(imageOn , forState: .Normal)
                check[i] = true
                print( check[i])
                print("please check",b1 )
                print("please check",b2 )
                print("please check",b3 )
            }else {
                arr[i].setImage(imageOff , forState: .Normal)
                check[i] = false
            }
        }
        
    }
    
}
