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
    var appointment = Appointment()
    var clinicalMedical = ClinicalMedical()
    var patient = PatientTabVC()
    var medicalImage = MedicalImage()
    var presentComplain = PresentComplain()
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
        loadXib(appointment)
        for button in btnCollectMenu {
            button.enabled = true
            if button.tag == 0 {
                animateButtonSelect(button)
            }
        }
        loading.stopActivity(false)
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
            loadXib(appointment)
            break;
        case 1:
            animateButtonSelect(sender)
            loadXib(clinicalMedical)
            break;
        case 2:
            animateButtonSelect(sender)
            loadXib(presentComplain)
            break;
        case 3:
            animateButtonSelect(sender)
            loadXib(medicalImage)
            break;
        case 4:
            animateButtonSelect(sender)
            loadXib(patient)
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
    
    func loadXib(nameXib: UIViewController) {
        xibVC = nameXib
        containerView.addSubview(xibVC.view)
    }
}
