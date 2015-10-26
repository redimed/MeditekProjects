//
//  ViewController.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/15/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import UIKit

class ViewController: UIViewController,patientDetailViewDelegate,NSXMLParserDelegate,patientDetailViewDelegateW {

    @IBOutlet weak var coverImageView: UIImageView!
    @IBOutlet weak var urgentCareLabel: UILabel!
    @IBOutlet weak var urgentButton: UIButton!
    
    var parser: NSXMLParser?
    var databasePath = NSString()
    var element = NSString()
    var elements = NSMutableDictionary()
    var value = NSMutableString()
    var posts : [String] = []
    var suburbs : NSArray = []
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        // UI settings
        //urgentButton.layer.cornerRadius = 0.5 * urgentButton.bounds.size.width
        //urgentCareLabel.font = UIFont(name: "HelveticaNeue-Bold", size: 20.0)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
        
        if let path = NSBundle.mainBundle().pathForResource("Suburb", ofType: "json")
        {
            if let jsonData = NSData(contentsOfFile: path, options: .DataReadingMappedIfSafe, error: nil)
            {
                if let jsonResult: NSDictionary = NSJSONSerialization.JSONObjectWithData(jsonData, options: NSJSONReadingOptions.MutableContainers, error: nil) as? NSDictionary
                {
                    let suburb : NSArray = (jsonResult["suburb"] as? NSArray)!
                        suburbs = suburb
//                    for var i = 0; i < suburb.count; ++i {
//                        let a = String(stringInterpolationSegment: suburb[i]["name"])
//                        posts.append(a)
//                    }
                }
            }
        }
    }
    override func viewWillDisappear(animated: Bool) {
       
    }
    @IBAction func callUsButton(sender: AnyObject) {
        if let phoneCallURL:NSURL = NSURL(string: "tel://\(RestApiManager.sharedInstance.phoneNumber)") {
            let application:UIApplication = UIApplication.sharedApplication()
            if (application.canOpenURL(phoneCallURL)) {
                application.openURL(phoneCallURL);
            }
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        
        if(segue.identifier == "workInjury"){
            var moreDetail  = segue.destinationViewController as! WorkInjuryViewController
            moreDetail.suburb  = suburbs
        }
        if(segue.identifier == "plasticinjury"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
            moreDetail.informationData["title"] = "Plastic Injury Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "Plasticinjury"
            moreDetail.suburb  = suburbs
        }
        if(segue.identifier == "orthopaedic"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
            moreDetail.informationData["title"] = "Orthopaedic Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "Orthopaedic"
            moreDetail.suburb  = suburbs
        }
        if(segue.identifier == "sportInjury"){
            var moreDetail  = segue.destinationViewController as! PatientDetailViewController
            moreDetail.informationData["title"] = "Sport Injury Clinic Booking"
            moreDetail.informationData["urgentRequestType"] = "SportInjury"
            moreDetail.suburb = suburbs
            //let contactDB = FMDatabase(path: databasePath as String)
        }
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    func tranferDataController(copntroller: PatientDetailViewController, moreData: Dictionary<String, String>){
        print(moreData)
    }

    func tranferDataController(copntroller: WorkInjuryViewController, moreDataW: Dictionary<String, String>){
    }

}
