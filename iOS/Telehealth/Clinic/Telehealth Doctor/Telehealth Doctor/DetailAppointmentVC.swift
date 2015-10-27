//
//  DetailAppointmentVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/15/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import Spring

class DetailAppointmentVC: UIViewController {
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var gradientBackground: UIImageView!
    
    @IBOutlet var btnCollectMenu: [UIButton]!
    
    var xibVC : UIViewController!
    var uidUser : Int?
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView()
    var customUI: CustomViewController = CustomViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        customUI.BlurLayer(gradientBackground)
        let param = ["data": ["uid": SingleTon.onlineUser_Singleton[uidUser!].appointmentUID]]
        
        request(.POST, APPOINTMENT_DETAIL, headers: SingleTon.headers, parameters: param)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                if let responseJSON = response.2.value {
                    let data: JSON = JSON(responseJSON)["data"]
                    SingleTon.detailAppointMentObj = data
                }
        }
        
        loading.frame = CGRectMake(containerView.frame.size.width/2 - 20, containerView.frame.size.height/2 - 40, 80, 80)
        containerView.addSubview(loading)
        loading.indicatorColor = UIColor.cyanColor()
        loading.indicatorStyle = DTIIndicatorStyle.convInv(.doubleBounce)
        loading.startActivity()
        
        NSTimer.scheduledTimerWithTimeInterval(2, target: self, selector: "loadXibView", userInfo: nil, repeats: false)
    }
    
    func loadXibView() {
        
        for button in self.btnCollectMenu {
            button.enabled = true
            if button.tag == 0 {
                self.animateButtonSelect(button)
            }
        }
        
        dispatch_sync(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)) {
            var fileUploads = SingleTon.detailAppointMentObj["FileUploads"]
            let header = ["Authorization":"Bearer \(COREAUTH)"]
            SingleTon.imgDataMedical = []
            for var i = 0; i < fileUploads.count; ++i {
                let uid = fileUploads[i]["UID"].stringValue
                let url = NSURL(string: "\(DOWNLOAD_IMAGE_APPOINTMENT)\(uid)")
                request(.GET, url!, headers: header)
                    .validate(statusCode: 200..<300)
                    .response() { response in
                        if let res = response.1 {
                            if res.statusCode == 200 {
                                if let data: NSData? = response.2 {
                                    if data != nil {
                                        SingleTon.imgDataMedical.append(data!)
                                    }
                                }
                            }
                        }
                }
            }
        }
        
        self.xibVC = Appointment(nibName: "Appointment", bundle: nil)
        self.containerView.addSubview(self.xibVC.view)
        loading.stopActivity(true)
    }
    
    func hardProcessingWithString(data: NSData, completion: (result: Int) -> Void) {
        completion(result: 0)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func viewOption(sender: UIButton) {
        xibVC.view.removeFromSuperview()
        for button in btnCollectMenu {
            button.layer.sublayers = nil
        }
        switch sender.tag {
        case 0:
            animateButtonSelect(sender)
            xibVC = Appointment(nibName: "Appointment", bundle: nil)
            containerView.addSubview(xibVC.view)
            break;
        case 1:
            animateButtonSelect(sender)
            xibVC = ClinicalMedical(nibName: "ClinicalMedical", bundle: nil)
            containerView.addSubview(xibVC.view)
            break;
        case 2:
            animateButtonSelect(sender)
            xibVC = PresentComplain(nibName: "PresentComplain", bundle: nil)
            containerView.addSubview(xibVC.view)
            break;
        case 3:
            animateButtonSelect(sender)
            xibVC = MedicalImage(nibName: "MedicalImage", bundle: nil)
            containerView.addSubview(xibVC.view)
            break;
        case 4:
            animateButtonSelect(sender)
            xibVC = PatientTabVC(nibName: "PatientTabVC", bundle: nil)
            containerView.addSubview(xibVC.view)
            break;
        default:
            
            break;
        }
    }
    
    
    func animateButtonSelect(button: UIButton) {
        UIView.animateWithDuration(0.0, delay: 0.0, options: UIViewAnimationOptions.CurveEaseOut, animations: {
            
            button.alpha = 0.0
            
            }, completion: {
                (finished: Bool) -> Void in
                
                UIView.animateWithDuration(0.2, delay: 0.0, options: UIViewAnimationOptions.CurveEaseIn, animations: {
                    
                    
                    let layer = CAGradientLayer()
                    layer.frame = button.bounds
                    layer.colors = [UIColor(hex: "FF2A68").CGColor, UIColor(hex: "FF5E3A").CGColor]
                    button.layer.addSublayer(layer)
                    button.alpha = 0.8
                    
                    }, completion: nil)
        })
        
        for button in btnCollectMenu {
            let border = CALayer()
            let width = CGFloat(1.0)
            border.borderColor = UIColor(red: 255/255, green: 255/255, blue: 255/255, alpha: 0.5).CGColor
            border.frame = CGRect(x: 0, y: button.frame.size.height - width, width:  button.frame.size.width, height: width)
            border.borderWidth = 2.0
            button.layer.addSublayer(border)
            button.layer.masksToBounds = true
        }
    }
    
    func loadXib(controllerChange: UIViewController) {
        
    }
}
