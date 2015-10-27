//
//  DetailImageVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class DetailImageVC: UIViewController, UIScrollViewDelegate {
    
    @IBOutlet var imageView: UIImageView!
    @IBOutlet var scrollViewImg: UIScrollView!
    var indexSelect: Int!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let imgSrc: NSData = SingleTon.imgDataMedical[indexSelect]
        imageView.image = UIImage(data: imgSrc)
        
        scrollViewImg.minimumZoomScale = 1.0
        scrollViewImg.maximumZoomScale = 6.0
        
    }
    
    func viewForZoomingInScrollView(scrollView: UIScrollView) -> UIView? {
        return self.imageView
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func backPopController(sender: AnyObject) {
        self.presentingViewController!.dismissViewControllerAnimated(true, completion: nil)
    }
}
