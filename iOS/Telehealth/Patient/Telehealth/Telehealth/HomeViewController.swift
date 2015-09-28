//
//  HomeViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController,UIPopoverPresentationControllerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func OptionsAction(sender: UIBarButtonItem) {
              
    }
    
    func adaptivePresentationStyleForPresentationController(controller: UIPresentationController) -> UIModalPresentationStyle {
        return .None
    }
 

}
