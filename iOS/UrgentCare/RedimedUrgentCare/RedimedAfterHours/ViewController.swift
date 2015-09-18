//
//  ViewController.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/15/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var coverImageView: UIImageView!
    @IBOutlet weak var urgentCareLabel: UILabel!
    override func viewDidLoad() {
        super.viewDidLoad()
        urgentCareLabel.font = UIFont(name: "HelveticaNeue-Bold", size: 20.0)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
       
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    
}
