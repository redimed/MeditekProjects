//
//  BodyUploadViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

protocol reloadCollectionDelegate{
    func reloadCollectionView(controller:BodyUploadViewController,sender:UIImage)
}

class BodyUploadViewController: UIViewController {
    
    @IBOutlet var myGestureRecognizer: UITapGestureRecognizer!
    @IBOutlet weak var image: UIImageView!
    
    var imageSelect : UIImage!
    var appointmentID = String()
    var delegate : reloadCollectionDelegate?
    
    let appointmentService = AppointmentService()
    let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        image.image = imageSelect
        image.addGestureRecognizer(UITapGestureRecognizer(target: self, action: "didTapImage:"))
        image.userInteractionEnabled = true
    }
    
    func didTapImage(gesture: UIGestureRecognizer) {
        let point = gesture.locationInView(gesture.view)
        print(point)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //click button upload image
    @IBAction func UploadImageButton(sender: AnyObject) {

        showloading("Please wait...")
        if let userUID = defaults.valueForKey("userUID") as? String {
          
            uploadImage(image.image!, userUID: userUID)
        }
    }
    
    //Upload image to user
    func uploadImage(image:UIImage,userUID:String){
        appointmentService.uploadImage(image, userUID: userUID, compailer: {
            response in
            if response["message"] == "success"{
                let  data = response["data"].string
                self.updateImageToAppointment(data!, appointmentID: self.appointmentID)
            }else {
                self.hideLoading()
                print("error",response["ErrorType"])
                let error = response["ErrorType"].string
                self.alertView.alertMessage("Error", message: error!)
            }
        })

    }
    
    //update image to appointment
    func updateImageToAppointment(data:String,appointmentID:String){
        self.appointmentService.updateImageToAppointment(data, appointmentID: appointmentID, compailer: {
            response in
            if response["message"] == "success"{
                self.hideLoading()
                if self.delegate != nil {
                    self.delegate?.reloadCollectionView(self, sender: self.image.image!)
                    
                }
                self.dismissViewControllerAnimated(true, completion: nil)
            }else {
                print("upload faild")
                self.hideLoading()
            }
        })
    }
    
    @IBAction func RotateAction(sender: AnyObject) {
        let imageRotate : UIImage =  image.image!.imageRotatedByDegrees(90, flip: false)
        image.image = imageRotate
        
    }
    
    
    //set portrait
    override func shouldAutorotate() -> Bool {
        if (UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeLeft ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeRight ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.Unknown) {
                return false
        }
        else {
            return true
        }
    }
    
    
    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return [UIInterfaceOrientationMask.Portrait ,UIInterfaceOrientationMask.PortraitUpsideDown]
    }
    
    
    
    
    
    
}
