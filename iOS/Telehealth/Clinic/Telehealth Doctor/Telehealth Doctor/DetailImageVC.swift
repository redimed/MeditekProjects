//
//  DetailImageVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class DetailImageVC: UIViewController {
    
    @IBOutlet var imageView: UIImageView!
    var indexSelect: Int!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let imgSrc: NSData = SingleTon.imgDataMedical[indexSelect]
        imageView.image = UIImage(data: imgSrc)
        imageView.contentMode = UIViewContentMode.ScaleAspectFill
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func backPopController(sender: AnyObject) {
        self.dismissViewControllerAnimated(false, completion: nil)
    }
}
