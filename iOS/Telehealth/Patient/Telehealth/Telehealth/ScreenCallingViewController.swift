//
//  ScreenCallingViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class ScreenCallingViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    //Event Send Image
    @IBAction func SendImageButtonAction(sender: UIButton) {
        let optionMenu = UIAlertController(title: nil, message: "Choose Option", preferredStyle: .ActionSheet)
        
        //Action open library
        let library = UIAlertAction(title: "Library", style: .Default, handler: {
            (alert: UIAlertAction!) -> Void in
            print("Select Image Library")
            
            
        })
        //Action open Camera
        let camera = UIAlertAction(title: "Camera", style: .Default, handler: {
            (alert: UIAlertAction!) -> Void in
            print("Select Image Camera")
            
        })
        
        // Cancel ActionSheet
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel, handler: {
            (alert: UIAlertAction!) -> Void in
            print("Cancelled")
        })
        
        
        // 4
        optionMenu.addAction(library)
        optionMenu.addAction(camera)
        optionMenu.addAction(cancelAction)
        
        // 5
        self.presentViewController(optionMenu, animated: true, completion: nil)
    }
    
    @IBAction func EndCallButtonAction(sender: UIButton) {
       performSegueWithIdentifier("EndCallSegue", sender: self)

    }
    

}
