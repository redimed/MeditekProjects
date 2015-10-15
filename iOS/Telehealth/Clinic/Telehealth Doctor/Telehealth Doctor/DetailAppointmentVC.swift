//
//  DetailAppointmentVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/15/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class DetailAppointmentVC: UIViewController {
    
    @IBOutlet weak var containerView: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func viewOption(sender: UIButton) {
        
        
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
        let xibView = UINib(nibName: nameXib, bundle: NSBundle(forClass: self.dynamicType)).instantiateWithOwner(self, options: nil)[0] as! UIView
        containerView.addSubview(xibView)
    }
    
    /*
    // MARK: - Navigation
    
    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    // Get the new view controller using segue.destinationViewController.
    // Pass the selected object to the new view controller.
    }
    */
    
}

extension UIView {
    class func loadFromNibNamed(nibNamed: String, bundle : NSBundle? = nil) -> UIView? {
        return UINib(
            nibName: nibNamed,
            bundle: bundle
            ).instantiateWithOwner(nil, options: nil)[0] as? UIView
    }
}
