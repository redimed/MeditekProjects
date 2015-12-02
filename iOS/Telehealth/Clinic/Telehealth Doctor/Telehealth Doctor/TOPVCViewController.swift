//
//  TOPVCViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/28/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

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
        
        
        button.frame = CGRectMake(self.view.frame.size.width - 250, 0, 300, 50)
        button.setTitle(JSON(NSUserDefaults.standardUserDefaults().valueForKey("userInfo")!)["UserName"].stringValue, forState: .Normal)
        button.titleLabel?.font = UIFont.systemFontOfSize(20)
        button.setTitleColor(UIColor(hex: "898C90"), forState: UIControlState.Normal)
        button.titleLabel?.adjustsFontSizeToFitWidth = true
        button.addTarget(self, action: "viewDetailDoctor", forControlEvents: UIControlEvents.TouchDown)
        navigation.addSubview(button)
        
        let imgViewicon = UIImageView(frame: CGRectMake(button.frame.origin.x + 50, 5, 30, 30))
        imgViewicon.image = UIImage(named: "doctor-active.png")
        imgViewicon.contentMode = UIViewContentMode.ScaleAspectFit
        navigation.addSubview(imgViewicon)
    }
    
    func viewDetailDoctor() {
        let optionMenu: UIAlertController = UIAlertController(title: nil, message: nil, preferredStyle: .ActionSheet)
        
        optionMenu.addAction(UIAlertAction(title: "Log out", style: UIAlertActionStyle.Destructive, handler: { (UIAlertAction) -> Void in
            
            NSUserDefaults.standardUserDefaults().removeObjectForKey("userInfo")
            NSUserDefaults.standardUserDefaults().removeObjectForKey("teleUserInfo")
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
