//
//  ViewController.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/15/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import UIKit

class ViewController: UIViewController,patientDetailViewDelegate {

    @IBOutlet weak var coverImageView: UIImageView!
    @IBOutlet weak var urgentCareLabel: UILabel!
    @IBOutlet weak var urgentButton: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        // UI settings
        //urgentButton.layer.cornerRadius = 0.5 * urgentButton.bounds.size.width
        urgentCareLabel.font = UIFont(name: "HelveticaNeue-Bold", size: 20.0)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
        
       
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        
        if(segue.identifier == "workInjury"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
           moreDetail.informationData["title"] = "Work Injury Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "Work Injury"
        }
        if(segue.identifier == "urgentCare"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
            moreDetail.informationData["title"] = "Urgent Care Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "UrgentCare"
        }
        if(segue.identifier == "sportInjury"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
            moreDetail.informationData["title"] = "Sport Injury Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "Sport Injury"

        }
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    func tranferDataController(copntroller: PatientDetailViewController, moreData: Dictionary<String, String>) {
        print(moreData)
    }

    
}
