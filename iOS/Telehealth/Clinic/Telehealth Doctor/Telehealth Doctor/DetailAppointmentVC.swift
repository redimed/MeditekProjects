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

class DetailAppointmentVC: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet var btnCollectMenu: [UIButton]!
    @IBOutlet weak var viewButton: UIView!
    @IBOutlet var navigaButton: [UIButton]!
    @IBOutlet weak var tableView: UITableView!
    
    var xibVC : UIViewController!
    var uidUser : Int?
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView()
    var customUI: CustomViewController = CustomViewController()
    var URL: String?
    var oldTitle: String?
    
    //    Declare for WA Appointment
    var arrayForMainDetail : NSMutableArray = NSMutableArray()
    var mainDetail : NSMutableArray = NSMutableArray()
    var contentDict : NSMutableDictionary = NSMutableDictionary()
    var mainImageMenu : NSMutableArray = NSMutableArray()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.self.loading.frame = CGRectMake((self.view.frame.width/4) - 60 , (self.view.frame.height/2) - 60, 80, 80)
        self.containerView.addSubview(self.loading)
        self.loading.indicatorColor = UIColor.cyanColor()
        self.loading.indicatorStyle = DTIIndicatorStyle.convInv(.doubleBounce)
        self.loading.startActivity()
        
        guard let numberArrOnlineUser: Int = SingleTon.onlineUser_Singleton.count where numberArrOnlineUser > 0 else {
            print("DetailViewController - user detail fatal error optional value")
            return
        }
        
        if SingleTon.flagSegue == true {
            URL = TELEAPPOINTMENT_DETAIL + SingleTon.onlineUser_Singleton[uidUser!].UID
        } else {
            URL = WAAPPOINTMENT_DETAIL + SingleTon.onlineUser_Singleton[uidUser!].UID
            
            let imgView = UIImageView(image: UIImage(named: "BG-DetailApt"))
            imgView.contentMode = UIViewContentMode.ScaleAspectFill
            tableView.backgroundView = imgView
            tableView.estimatedRowHeight = 130
            tableView.rowHeight = UITableViewAutomaticDimension
            
            // Declare value of table menu
            arrayForMainDetail = ["0","0","0","0","0","0"]
            mainDetail = ["Appointment", "Clinical Details & Relevant Medical History", "Present Complain & Allergy", "Medical Images", "Patient", "Referral"]
            mainImageMenu = [ UIImage(named: "basic-info")!, UIImage(named: "clinical-detail")!, UIImage(named: "present-complain")!, UIImage(named: "medical-image")!, UIImage(named: "patient")!, UIImage(named: "handshake-100")! ]
            
            let clinic: NSArray = ["Relevant Past Medical History", "Relevant Social Factors", "Allegiers", "Current Medication", "Relevant Investigation & Test", "Pathology & Radiology"]
            
            let patient: NSArray = ["Basic Information", "Contact Information", "Kin/Guardian", "Medicare Information"]
            
            let referral: NSArray = ["Referral Information", "Reason for referral/Presenting Problem", "History of Previous Skin cancers/ hand surgery"]
            
            var strParse = mainDetail.objectAtIndex(4) as? String
            contentDict.setValue(patient, forKey: strParse!)
            
            strParse = mainDetail.objectAtIndex(5) as? String
            contentDict.setValue(referral, forKey: strParse!)
            
            strParse = mainDetail.objectAtIndex(1) as? String
            contentDict.setValue(clinic, forKey: strParse!)
        }
        
        request(.GET, URL!, headers: SingleTon.headers)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSONReToken { response -> Void in
                
                guard response.2.error == nil else {
                    if let data = response.2.data {
                        print("Error calling server response ->", resJSONError(data))
                    }
                    return
                }
                if let value: AnyObject = response.2.value {
                    let readableJSON = JSON(value)
                    SingleTon.detailAppointMentObj = readableJSON["data"]
                    if let clinicCal: JSON = readableJSON["data"]["TelehealthAppointment"]["ClinicalDetails"] {
                        
                        for var i = 0; i < clinicCal.count; ++i {
                            if let fileUpload: JSON = clinicCal[i]["FileUploads"] {
                                if fileUpload.count > 0 {
                                    for var i = 0; i < fileUpload.count; ++i {

                                        if fileUpload[i]["FileType"].isEmpty && fileUpload[i]["FileType"].stringValue.lowercaseString == "medicalimage" {
                                            
                                            SingleTon.imgDataMedical.removeAll()
                                            let uid = fileUpload[i]["UID"].stringValue
                                            let url = NSURL(string: "\(DOWNLOAD_IMAGE_APPOINTMENT)\(uid)")
                                            
                                            request(.GET, url!, headers: SingleTon.headers)
                                                .validate(statusCode: 200..<300)
                                                .responseJSONReToken() { response in
                                                    
                                                    guard response.2.value == nil else {
                                                        print("error download file: ", response)
                                                        return
                                                    }
                                                    
                                                    if let data: NSData? = response.2.data {
                                                        if data != nil {
                                                            SingleTon.imgDataMedical.append(data!)
                                                        }
                                                    }
                                                    
                                                    
                                                    
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                    NSTimer.scheduledTimerWithTimeInterval(2, target: self, selector: "loadXibView", userInfo: nil, repeats: false)
                }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        self.navigationItem.setHidesBackButton(true, animated: true)
        for button in navigaButton {
            switch button.tag {
            case 50:
                button.setTitle(oldTitle, forState: UIControlState.Normal)
            default:
                button.setTitle(SingleTon.onlineUser_Singleton[uidUser!].fullNamePatient == nil ? "Detail Appointment" : SingleTon.onlineUser_Singleton[uidUser!].fullNamePatient, forState: UIControlState.Normal)
                break;
            }
        }
    }
    
    func loadXibView() {
        for button in self.btnCollectMenu {
            button.enabled = true
            if button.tag == 0 {
                self.animateButtonSelect(button)
            }
        }
        
        self.xibVC = Appointment(nibName: "Appointment", bundle: nil)
        self.containerView.addSubview(self.xibVC.view)
        
        if SingleTon.flagSegue == false {
            tableView.hidden = false
        } else {
            viewButton.hidden = false
        }
        
        loading.stopActivity(true)
        
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
                    layer.frame = CGRectMake(0, button.frame.size.height / 4, button.frame.size.width + 2, button.frame.size.height - 60)
                    layer.contents = UIImage(named: "main-menu-choose")?.CGImage
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
    
    func animateUIViewSelect(view: UIView) {
        UIView.animateWithDuration(0.0, delay: 0.0, options: UIViewAnimationOptions.CurveEaseOut, animations: {
            
            view.alpha = 0.0
            
            }, completion: {
                (finished: Bool) -> Void in
                
                UIView.animateWithDuration(0.2, delay: 0.0, options: UIViewAnimationOptions.CurveEaseIn, animations: {
                    
                    UIGraphicsBeginImageContext(self.view.frame.size)
                    UIImage(named: "main-menu-choose")?.drawInRect(CGRect(x: 0,y: (view.frame.size.height / 6) + 5, width: view.frame.size.width + 3, height: view.frame.size.height / 2))
                    let image: UIImage = UIGraphicsGetImageFromCurrentImageContext()
                    UIGraphicsEndImageContext()
                    view.backgroundColor = UIColor(patternImage: image)
                    view.alpha = 0.8
                    
                    }, completion: nil)
        })
    }
    
    
    //    Function for TableView Load for WA Appointment
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return mainDetail.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if arrayForMainDetail.objectAtIndex(section).boolValue == true {
            let subArrMain = mainDetail.objectAtIndex(section) as! String
            if contentDict.valueForKey(subArrMain) != nil {
                let subRow = (contentDict.valueForKey(subArrMain)) as! NSArray
                return subRow.count
            }
        }
        return 0
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "ABC"
    }
    
    func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 113.5
    }
    
    func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 1
    }
    
    var headerView2 = UIView()
    
    func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = UIView(frame: CGRectMake(0, 0, tableView.frame.size.width, 113.5))
        headerView2 = headerView
        headerView.backgroundColor = UIColor.clearColor()
        headerView.tag = section
        
        let headerString = UILabel(frame: CGRectMake(74, headerView.frame.size.height / 4 - 10, 195, 70)) as UILabel
        headerString.textColor = UIColor.whiteColor()
        headerString.numberOfLines = 2
        headerString.text = mainDetail.objectAtIndex(section) as? String
        headerView2.addSubview(headerString)
        
        let imageView = UIImageView(frame: CGRectMake(8, headerView.frame.size.height / 4, 50, 50)) as UIImageView
        imageView.image = mainImageMenu.objectAtIndex(section) as? UIImage
        headerView2.addSubview(imageView)
        
        let headerTapped = UITapGestureRecognizer(target: self, action: "sectionHeaderTapped:")
        headerView.addGestureRecognizer(headerTapped)
        
        return headerView
    }
    
    func sectionHeaderTapped(recognizer: UITapGestureRecognizer) {
        let indexPath: NSIndexPath = NSIndexPath(forRow: 0, inSection: (recognizer.view?.tag)! as Int)
        if indexPath.row == 0 {
            var collapsed = arrayForMainDetail.objectAtIndex(indexPath.row).boolValue
            collapsed = !collapsed
            
            for var i = 0; i < arrayForMainDetail.count; ++i {
                arrayForMainDetail.replaceObjectAtIndex(i, withObject: false)
                let range = NSMakeRange(i, 1)
                let sectionToReload = NSIndexSet(indexesInRange: range)
                self.tableView.reloadSections(sectionToReload, withRowAnimation: .None)
            }
            
            arrayForMainDetail.replaceObjectAtIndex(indexPath.section, withObject: collapsed)
            
            let range = NSMakeRange(indexPath.section, 1)
            let sectionToReload = NSIndexSet(indexesInRange: range)
            self.tableView.reloadSections(sectionToReload, withRowAnimation: .Fade)
            
            xibVC.view.removeFromSuperview()
            switch indexPath.section {
            case 0: // Appointment
                animateUIViewSelect(headerView2)
                xibVC = Appointment(nibName: "Appointment", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 1: // Clinical Details & Relevant Medical History
                animateUIViewSelect(headerView2)
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = "Relevant Past Medical History"
                containerView.addSubview(xibVC.view)
            case 2: // Present Complain & Allergy
                animateUIViewSelect(headerView2)
                xibVC = PresentComplain(nibName: "PresentComplain", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 3: // Medical Images
                animateUIViewSelect(headerView2)
                xibVC = MedicalImage(nibName: "MedicalImage", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 4: // Patient
                animateUIViewSelect(headerView2)
                xibVC = BasicInfoWAPatient(nibName: "BasicInfoWAPatient", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 5: // Referral
                animateUIViewSelect(headerView2)
                xibVC = Referral_InformationVC(nibName: "Referral InformationVC", bundle: nil)
                containerView.addSubview(xibVC.view)
            default:
                break;
            }
            
        }
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        tableView.rowHeight = 70
        self.tableView.separatorColor = UIColor.whiteColor()
        let cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as UITableViewCell
        let manyCells: Bool = arrayForMainDetail.objectAtIndex(indexPath.section).boolValue
        if manyCells {
            let content = contentDict.valueForKey(mainDetail.objectAtIndex(indexPath.section) as! String) as! NSArray
            cell.textLabel?.text = content.objectAtIndex(indexPath.row) as? String
            cell.backgroundColor = UIColor(hex: "1ac6ff")
            
            //            UIGraphicsBeginImageContext(cell.frame.size)
            //            UIImage(named: "main-menu-choose")?.drawInRect(CGRect(x: 0, y: (cell.frame.size.height / 6) - 10, width: cell.frame.size.width, height: (cell.frame.size.height / 2) - 10))
            
            //            let image: UIImage = UIGraphicsGetImageFromCurrentImageContext()
            //
            //            UIGraphicsEndImageContext()
            //
            let bgColorView = UIView()
            bgColorView.backgroundColor = UIColor(hex: "34AADC")
            cell.selectedBackgroundView = bgColorView
        }
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        xibVC.view.removeFromSuperview()
        switch indexPath.section {
        case 1: // Clinical Details & Relevant Medical History
            let index = mainDetail[indexPath.section] as! String
            switch indexPath.row {
            case 0:
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = JSON(contentDict[index]!)[indexPath.row].stringValue
                containerView.addSubview(xibVC.view)
            case 1:
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = JSON(contentDict[index]!)[indexPath.row].stringValue
                containerView.addSubview(xibVC.view)
            case 2:
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = JSON(contentDict[index]!)[indexPath.row].stringValue
                containerView.addSubview(xibVC.view)
            case 3:
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = JSON(contentDict[index]!)[indexPath.row].stringValue
                containerView.addSubview(xibVC.view)
            case 4:
                xibVC = Relevant_Allergy_CurrentVC(nibName: "Relevant_Allergy_CurrentVC", bundle: nil)
                xibVC.title = JSON(contentDict[index]!)[indexPath.row].stringValue
                containerView.addSubview(xibVC.view)
            case 5:
                xibVC = PathologyProviderVC(nibName: "PathologyProviderVC", bundle: nil)
                containerView.addSubview(xibVC.view)
            default:
                break;
            }
        case 4: // Patient
            switch indexPath.row {
            case 0:
                xibVC = BasicInfoWAPatient(nibName: "BasicInfoWAPatient", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 1:
                xibVC = ContactInfoWAPatient(nibName: "ContactInfoWAPatient", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 2:
                xibVC = Kin_Guardian(nibName: "Kin_Guardian", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 3:
                xibVC = Medi_Infomation(nibName: "Medi_Infomation", bundle: nil)
                containerView.addSubview(xibVC.view)
            default:
                break;
            }
        case 5: // Referral
            switch indexPath.row {
            case 0:
                xibVC = Referral_InformationVC(nibName: "Referral InformationVC", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 1:
                xibVC = ReasonforPresentingVC(nibName: "ReasonforPresentingVC", bundle: nil)
                containerView.addSubview(xibVC.view)
            case 2:
                xibVC = HistorySkinHandVC(nibName: "HistorySkinHandVC", bundle: nil)
                containerView.addSubview(xibVC.view)
            default:
                break;
            }
        default:
            break;
        }
    }
}
