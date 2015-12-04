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
    var imageSelect : UIImage!
    let api = GetAndPostDataController()
    var appointmentID = String()
    @IBOutlet var myGestureRecognizer: UITapGestureRecognizer!
    @IBOutlet weak var image: UIImageView!
    var delegate : reloadCollectionDelegate?
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
        view.showLoading()
        if let userUID = defaults.valueForKey("userUID") as? String {
            api.uploadImage(image.image!,userUID: userUID){
                response in
                
                if response["status"] == "success"{
                    self.api.updateImageToAppointment(response["fileUID"].string!, apptID: self.appointmentID){
                        response in
                        if response["status"] == "success"{
                            self.view.hideLoading()
                            if self.delegate != nil {
                                self.delegate?.reloadCollectionView(self, sender: self.image.image!)
                            }
                            self.dismissViewControllerAnimated(true, completion: nil)
                        }else {
                            print("upload faild")
                             self.view.hideLoading()
                        }
                    }
                }else {
                    self.view.hideLoading()
                    print("error",response)
                }
                
            }
        }
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
