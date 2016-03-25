//
//  HomeViewController.swift
//  UrgentCare Work
//
//  Created by DucManh on 2/29/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class HomeViewController: BaseViewController {
    
    @IBOutlet var button: [UIButton]!
    @IBOutlet var textField: [UITextField]!
    override func viewDidLoad() {
        super.viewDidLoad()
        for text : UITextField in textField {
            text.addDoneButton(text)
        }
        for text : UITextField in textField {
            text.attributedPlaceholder = NSAttributedString(string: text.placeholder!, attributes:[ NSForegroundColorAttributeName: UIColor.whiteColor()])
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    @IBAction func actionLogin(sender: AnyObject) {
        LoadingAnimation.showLoading()
        let login :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewController") as! ViewController
        self.navigationController?.pushViewController(login, animated: true)
    }
    
}
