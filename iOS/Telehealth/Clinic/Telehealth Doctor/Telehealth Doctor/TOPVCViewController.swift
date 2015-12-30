//
//  TOPVCViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/28/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
import Alamofire

class TOPVCViewController: UINavigationController, UIPopoverPresentationControllerDelegate {
    
    
    @IBOutlet weak var navigation: UINavigationBar!
    @IBOutlet weak var rightBarButton: UIBarButtonItem!
    let button = UIButton(type: .System)
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewWillAppear(animated: Bool) {
        let imageView = UIImageView(frame: CGRectMake(30, 5, 180, 35))
        imageView.image = UIImage(named: "logo.png")
        imageView.contentMode = UIViewContentMode.ScaleAspectFit
        navigation.addSubview(imageView)
    }
    
    override func viewDidAppear(animated: Bool) {
        get_full_name()
        let nsStr = SingleTon.nameLogin! as NSString
        let size: CGSize = nsStr.sizeWithAttributes([NSFontAttributeName: UIFont.systemFontOfSize(14.0)])
        button.frame = CGRectMake(self.view.frame.size.width - 250, 0, size.width > 300 ? size.width : 300 , 50)
        button.setTitle(SingleTon.nameLogin!, forState: .Normal)
        button.titleLabel?.font = UIFont.systemFontOfSize(20)
        button.setTitleColor(UIColor(hex: "898C90"), forState: UIControlState.Normal)
        button.titleLabel?.adjustsFontSizeToFitWidth = true
        button.addTarget(self, action: "viewDetailDoctor", forControlEvents: UIControlEvents.TouchDown)
        navigation.addSubview(button)
        if let teleDef = NSUserDefaults.standardUserDefaults().valueForKey("doctorInfo") {
            let parseJson = JSON(teleDef)
            let url = NSURL(string: "\(DOWNLOAD_IMAGE)\(parseJson["FileUID_img"])")
            request(.GET, url!, headers: SingleTon.headers)
                .validate(statusCode: 200..<300)
                .responseJSON() { response in
                    
                    guard response.2.value == nil else {
                        print("error download file: ", response)
                        return
                    }
                    
                    if let data: NSData! = response.2.data {
                        if data != nil {
                            let imgViewicon = UIImageView(frame: CGRectMake(self.button.frame.origin.x + 50, 5, 30, 30))
                            imgViewicon.image = UIImage(data: data!)
                            imgViewicon.contentMode = UIViewContentMode.ScaleAspectFit
                            self.navigation.addSubview(imgViewicon)
                        }
                    }
            }
        }
    }
    
    func viewDetailDoctor() {
        let optionMenu: UIAlertController = UIAlertController(title: nil, message: nil, preferredStyle: .ActionSheet)
        
        optionMenu.addAction(UIAlertAction(title: "Log out", style: UIAlertActionStyle.Destructive, handler: { (UIAlertAction) -> Void in
            
            NSUserDefaults.standardUserDefaults().removeObjectForKey("userInfo")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("teleUserInfo")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("doctorInfo")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("authToken")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("refCode")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("deviceId")
            
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if let loginVC = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("LoginView") as? LoginViewController {
                    self.presentViewController(loginVC, animated: true, completion: nil)
                }
            })
        }))
        
        let popover: UIPopoverPresentationController = optionMenu.popoverPresentationController!
        popover.sourceView = button
        popover.sourceRect = button.bounds
        optionMenu.view.layoutIfNeeded()
        self.presentViewController(optionMenu, animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
