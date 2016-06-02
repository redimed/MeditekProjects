//
//  BodyUploadViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
protocol reloadCollectionDelegate{
    func reloadCollectionView(controller:BodyUploadViewController,sender:UIImage)
}

class BodyUploadViewController: BaseViewController {
    
    @IBOutlet var myGestureRecognizer: UITapGestureRecognizer!
    @IBOutlet weak var image: UIImageView!
    
    var imageSelect : UIImage!
    var appointmentID = String()
    var delegate : reloadCollectionDelegate?
    
   // let appointmentService = AppointmentService()
   // let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        image.image = imageSelect
        image.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(BodyUploadViewController.didTapImage(_:))))
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
        uploadImage(image.image!, userUID: Context.getDataDefasults(Define.keyNSDefaults.UserUID) as! String)
    }
    
    //Upload image to user
    func uploadImage(image:UIImage,userUID:String){
        let upload:UploadImage = UploadImage()
        upload.userUID = userUID
        upload.fileType = "MedicalImage"
        
        UserService.uploadImage(image, uploadImage: upload) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        print(response.result.value!)
                        if let uploadImage = Mapper<UploadImage>().map(response.result.value) {
                            if(uploadImage.status == "success"){
                                self!.updateImageToAppointment(uploadImage.fileUID, appointmentID: (self?.appointmentID)!)
                                self!.hideLoading()
                            }else{
                                self!.hideLoading()
                            }
                           
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
            }
        }

    }
    func updateImageToAppointment(fileUID:String,appointmentID:String){
        let uploadImageRequest:UploadImageRequest = UploadImageRequest()
        let upload:UploadImage = UploadImage()
        upload.fileUID = fileUID
        upload.apptUID = appointmentID
        
        uploadImageRequest.data = upload
        
        UserService.upDateImageToAppointment(uploadImageRequest) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        print(response.result.value!)
                        if let uploadImage = Mapper<UploadImage>().map(response.result.value) {
                            if(uploadImage.status == "success"){
                                self!.delegate?.reloadCollectionView(self!, sender: self!.image.image!)
                                self!.hideLoading()
                                self!.navigationController?.popViewControllerAnimated(true)
                            }else{
                                self!.hideLoading()
                               self!.navigationController?.popViewControllerAnimated(true)
                            }
                            
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
            }
        }

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
