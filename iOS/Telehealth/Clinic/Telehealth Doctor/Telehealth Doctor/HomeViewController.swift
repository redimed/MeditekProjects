//
//  HomeViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController {
    
    let customUIViewCtrl : CustomViewController = CustomViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    @IBAction func testEmit(sender: AnyObject) {
        customUIViewCtrl.HandlerSocket()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
