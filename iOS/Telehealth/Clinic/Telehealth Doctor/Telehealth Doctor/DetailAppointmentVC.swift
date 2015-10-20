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
    
    var xibVC : UIViewController!
    var uidUser : Int?
    var appointment = Appointment()
    var clinicalMedical = ClinicalMedical()
    var patient = PatientTabVC()
    var medicalImage = MedicalImage()
    var presentComplain = PresentComplain()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let gradient :CAGradientLayer = CAGradientLayer()
        gradient.frame = gradientBackground.bounds;
        gradient.colors = [UIColor(hex: "FF5E3A").CGColor, UIColor(hex: "FF2A68").CGColor]
        gradientBackground.layer.insertSublayer(gradient, atIndex: 0)
    }
    
    override func viewWillAppear(animated: Bool) {
        let param = ["data": ["uid": SingleTon.onlineUser_Singleton[uidUser!].appointmentUID]]
        request(.POST, APPOINTMENT_DETAIL, headers: SingleTon.headers, parameters: param)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSON { response -> Void in
                if let data: JSON = JSON(response.2.value!)["data"] {
                    print("detail appointment: \(data)")
                    SingleTon.detailAppointMentObj = data
                    self.loadXib(self.appointment)
                }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func viewOption(sender: UIButton) {
        xibVC.view.removeFromSuperview()
        switch sender.tag {
        case 0:
            loadXib(appointment)
            break;
        case 1:
            loadXib(clinicalMedical)
            break;
        case 2:
            loadXib(presentComplain)
            break;
        case 3:
            loadXib(medicalImage)
            break;
        case 4:
            loadXib(patient)
            break;
        default:
            
            break;
        }
    }
    
    func loadXib(nameXib: UIViewController) {
        xibVC = nameXib
        containerView.addSubview(xibVC.view)
    }
}
