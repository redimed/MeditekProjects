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

class DetailAppointmentVC: UIViewController {
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var gradientBackground: UIImageView!
    
    var xibView : UIView!
    var uidUser : Int?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let gradient :CAGradientLayer = CAGradientLayer()
        gradient.frame = gradientBackground.bounds;
        gradient.colors = [UIColor(hex: "FF5E3A").CGColor, UIColor(hex: "FF2A68").CGColor]
        gradientBackground.layer.insertSublayer(gradient, atIndex: 0)
        
        loadXib("demoViewController")
    }
    
    override func viewWillAppear(animated: Bool) {
        let param = ["data": ["uid": SingleTon.onlineUser_Singleton[uidUser!].appointmentUID]]
        request(.POST, APPOINTMENT_DETAIL, headers: SingleTon.headers, parameters: param)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                
                print(response)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func viewOption(sender: UIButton) {
        xibView.removeFromSuperview()
        switch sender.tag {
        case 0:
            loadXib("BasicInfomation")
            break;
        case 1:
            loadXib("ClinicalMedical")
            break;
        case 2:
            loadXib("PresentComplain")
            break;
        case 3:
            loadXib("MedicalImage")
            break;
        case 4:
            loadXib("Patient")
            break;
        default:
            
            break;
        }
    }
    
    func loadXib(nameXib: String) {
        xibView = UINib(nibName: nameXib, bundle: NSBundle(forClass: self.dynamicType)).instantiateWithOwner(self, options: nil)[0] as! UIView
        containerView.addSubview(xibView)
    }
}
