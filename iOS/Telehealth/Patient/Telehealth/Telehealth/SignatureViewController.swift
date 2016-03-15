//
//  SignatureViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 3/2/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

protocol signatureDelegate {
    func updateSignature(controller:SignatureViewController,sender:UIImage,imageUID:String)
}

class SignatureViewController: UIViewController {
    @IBOutlet weak var mainImageView: UIImageView!
    @IBOutlet weak var tempImageView: UIImageView!
    let appointmentService = AppointmentService()
    let patientService = PatientService()
    var delegate : signatureDelegate?
    var alertView : UIAlertView!
    var patientInformation : PatientContainer!
    var patientUID : String!
    var checkConfimRequest : String = ""
    
    @IBOutlet weak var viewSig: UIView!
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
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        print("bb",patientUID)
        // Do any additional setup after loading the view.
    }
    
    @IBAction func reset(sender: AnyObject) {
        mainImageView.image = nil
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        swiped = false
        if let touch = touches.first {
            lastPoint = touch.locationInView(self.viewSig)
        }
    }
    
    func drawLineFrom(fromPoint: CGPoint, toPoint: CGPoint) {
        
        // 1
        UIGraphicsBeginImageContext(viewSig.frame.size)
        let context = UIGraphicsGetCurrentContext()
        tempImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: viewSig.frame.size.width, height: viewSig.frame.size.height))
        
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
            let currentPoint = touch.locationInView(viewSig)
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
        mainImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: viewSig.frame.size.width, height: viewSig.frame.size.height), blendMode: CGBlendMode.Normal, alpha: 1.0)
        tempImageView.image?.drawInRect(CGRect(x: 0, y: 0, width: viewSig.frame.size.width, height: viewSig.frame.size.height), blendMode: CGBlendMode.Normal, alpha: opacity)
        mainImageView.image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        tempImageView.image = nil
    }
    
    @IBAction func doneButton(sender: AnyObject) {
        print(defaults.valueForKey("userUID") as? String)
        if let uuid = defaults.valueForKey("userUID") as? String {
            if(checkConfimRequest == "true"){
                self.uploadImageNotLogin(self.mainImageView.image!, userUID: uuid)
            }else{
            self.uploadImage(self.mainImageView.image!, userUID: uuid)
            }
        }else{
            self.uploadImageNotLogin(self.mainImageView.image!, userUID: ConfigurationSystem.uploadfileID)
        }
    }
    
    //Upload image to user
    func uploadImage(image:UIImage,userUID:String){
        self.view.showLoading()
        appointmentService.uploadImage(image, userUID: userUID,fileType:"Signature" , compailer: {
            response in
            if response["message"] == "success"{
                self.view.hideLoading()
                let  data = response["data"].string
                
                
                self.delegate?.updateSignature(self, sender: self.mainImageView.image!,imageUID:data!)
                self.patientService.updateSignature(data!, patientUID: self.patientUID, completionHandler: {
                    response in
                    print("update success",response)
                    self.performSegueWithIdentifier("unwindToProfileSegue", sender: self)
                })
                
            }else {
                self.view.hideLoading()
                print("error",response["ErrorType"])
                let error = response["ErrorType"].string
                self.alertView.alertMessage("Error", message: error!)
            }
        })
        
    }
    
    func uploadImageNotLogin(image:UIImage,userUID:String){
        self.view.showLoading()
        appointmentService.uploadImageNotLogin(image, userUID: userUID,fileType:"Signature" , compailer: {
            response in
            if response["message"] == "success"{
                self.view.hideLoading()
        
                let  fileUID = response["data"].string
                //let fileUID =  response["fileUID"].string!
                self.delegate?.updateSignature(self, sender: self.mainImageView.image!,imageUID:fileUID!)
                self.navigationController!.popViewControllerAnimated(true)
            }else {
                self.view.hideLoading()
                print("error",response["ErrorType"])
                let error = response["ErrorType"].string
                self.alertView.alertMessage("Error", message: error!)
            }
        })
        
    }

}
