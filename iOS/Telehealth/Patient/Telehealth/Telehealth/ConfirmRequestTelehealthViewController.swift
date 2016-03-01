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
//    ----------------------Signiture-----------------
    @IBOutlet weak var mainImageView: UIImageView!
    @IBOutlet weak var tempImageView: UIImageView!
    
    @IBOutlet weak var signitureView: UIView!
    var lastPoint = CGPoint.zero
    var red: CGFloat = 0.0
    var green: CGFloat = 0.0
    var blue: CGFloat = 0.0
    var brushWidth: CGFloat = 1.0
    var opacity: CGFloat = 1.0
    var swiped = false
    
    
    let colors: [(CGFloat, CGFloat, CGFloat)] = [
        (0, 0, 0),
        (105.0 / 255.0, 105.0 / 255.0, 105.0 / 255.0),
        (1.0, 0, 0),
        (0, 0, 1.0),
        (51.0 / 255.0, 204.0 / 255.0, 1.0),
        (102.0 / 255.0, 204.0 / 255.0, 0),
        (102.0 / 255.0, 1.0, 0),
        (160.0 / 255.0, 82.0 / 255.0, 45.0 / 255.0),
        (1.0, 102.0 / 255.0, 0),
        (1.0, 1.0, 0),
        (1.0, 1.0, 1.0),
    ]

   //-----------------------------------------
    
    var dateText : String?
    var fileUpload = [[String:String]]()
    var countImage = 0
    var UserUID = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        dateText = requestTelehealthService.NowDate()
        dateTime.text = dateText?.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.confirmDate)
        fullNameLabel.text = "\(telehealthData.FirstName) \(telehealthData.LastName)"
        phoneNumberLabel.text = "Phone: " + telehealthData.PhoneNumber
        surburbLabel.text = "Suburb: " + telehealthData.Suburb
        dobLabel.text = "DOB: " + telehealthData.DOB
        emailLabel.text = "Email: " + telehealthData.Email1
        
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "FAQConfirmSegue" {
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "FAQs"
        }
    }
    
    
    @IBAction func completeRequestAction(sender: AnyObject) {

        showloading("Please wait...")
        uploadImage()
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

                    self.hideLoading()
                    let error = response["ErrorType"].string
                    self.alertView.alertMessage("Error", message: error!)
                }
            })
        }
    }
    
    func requestTelehealth(){
      
        requestTelehealthService.requestTelehealth(dateText!, Type: telehealthData.typeTelehealth, Description: telehealthData.description, FirstName: telehealthData.FirstName, LastName: telehealthData.LastName, PhoneNumber: telehealthData.PhoneNumber, HomePhoneNumber: telehealthData.HomePhoneNumber, Suburd: telehealthData.Suburb, DOB: telehealthData.DOB, Email: telehealthData.Email1,FileUploads:fileUpload,handler: {
            response in
            if response["status"] == "success"{

               self.hideLoading()
                self.alertView.alertMessage("Success", message: "Request Telehealth Success!")
                self.performSegueWithIdentifier("unwindToHomeSegue", sender: self)
            }else {
                self.hideLoading()
                self.alertView.alertMessage("Error", message: "\(response["ErrorType"])")
            }
        })
        
    }
    
    
    //------------Signiture
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        swiped = false
        if let touch = touches.first {
            lastPoint = touch.locationInView(self.signitureView)
        }
    }
    
    func drawLineFrom(fromPoint: CGPoint, toPoint: CGPoint) {
        
        // 1
        UIGraphicsBeginImageContext(signitureView.frame.size)
        let context = UIGraphicsGetCurrentContext()
        tempImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: signitureView.frame.size.width, height: signitureView.frame.size.height))
        
        // 2
        CGContextMoveToPoint(context, fromPoint.x, fromPoint.y)
        CGContextAddLineToPoint(context, toPoint.x, toPoint.y)
        
        // 3
        CGContextSetLineCap(context, CGLineCap.Round)
        CGContextSetLineWidth(context, brushWidth)
        CGContextSetRGBStrokeColor(context, red, green, blue, 1.0)
        CGContextSetBlendMode(context, CGBlendMode.Normal)
        
        // 4
        CGContextStrokePath(context)
        
        // 5
        tempImageView.image = UIGraphicsGetImageFromCurrentImageContext()
        tempImageView.alpha = opacity
        UIGraphicsEndImageContext()
        
    }
    
    override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
        // 6
        swiped = true
        if let touch = touches.first {
            let currentPoint = touch.locationInView(signitureView)
            drawLineFrom(lastPoint, toPoint: currentPoint)
            
            // 7
            lastPoint = currentPoint
        }
    }
    
    override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {
        
        if !swiped {
            // draw a single point
            drawLineFrom(lastPoint, toPoint: lastPoint)
        }
        
        // Merge tempImageView into mainImageView
        UIGraphicsBeginImageContext(mainImageView.frame.size)
        mainImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: signitureView.frame.size.width, height: signitureView.frame.size.height), blendMode: CGBlendMode.Normal, alpha: 1.0)
        tempImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: signitureView.frame.size.width, height: signitureView.frame.size.height), blendMode: CGBlendMode.Normal, alpha: opacity)
        mainImageView.image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        tempImageView.image = nil
        print(mainImageView.image)
        print(tempImageView.image)
    }
    
 
    
    @IBAction func resetSignature(sender: AnyObject) {
        mainImageView.image = nil
    }
    
}
