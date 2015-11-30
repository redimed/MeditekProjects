//
//  Relevant_Allergy_CurrentVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class Relevant_Allergy_CurrentVC: UIViewController, UIScrollViewDelegate {
    
    var cliniCalDetails: JSON!
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var textViewMain: UITextView!
    @IBOutlet weak var scrollView: UIScrollView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        cliniCalDetails = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
        let arrKey = ["MedicalHistory", "SocialFactors", "Allergies", "Medication", "InvestigationTests"]
        
        switch self.title! {
        case "Relevant Past Medical History":
            lblTitle.text = self.title!
            loadData(arrKey[0])
        case  "Relevant Social Factors":
            lblTitle.text = self.title!
            loadData(arrKey[1])
        case  "Allegiers":
            lblTitle.text = "Allergy"
            loadData(arrKey[2])
        case "Current Medication":
            lblTitle.text = self.title!
            loadData(arrKey[3])
        case "Relevant Investigation & Test":
            lblTitle.text = "Relevant Investigation and Tests (Please Attach Results)"
            loadData(arrKey[4])
        default:
            break
        }
    }
    
    func loadData(key: String) {
        for var i = 0; i < cliniCalDetails.count; ++i {
            if let nameClinic: String = cliniCalDetails[i]["Name"].stringValue {
                if nameClinic == key {
                    textViewMain.text = cliniCalDetails[i]["Value"].stringValue
                }
            }
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func scrollViewDidScroll(scrollView: UIScrollView) {
        scrollView.setContentOffset(CGPointMake(0, scrollView.contentOffset.y), animated: true)
    }
}
