//
//  ImageDetailViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class ImageDetailViewController: UIViewController , UIScrollViewDelegate {
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var scrollViewImage: UIScrollView!
    var imageDetail : UIImage!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        imageView.image = imageDetail
        self.scrollViewImage.maximumZoomScale = 3.0
        self.scrollViewImage.minimumZoomScale = 0.5
        self.scrollViewImage.delegate = self
    }
    func viewForZoomingInScrollView(scrollView: UIScrollView) -> UIView? {
        return imageView
        
    }
   
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func RotateImageAction(sender: AnyObject) {
        let imageRotate : UIImage =  imageView.image!.imageRotatedByDegrees(90, flip: false)
        imageView.image = imageRotate
    }
    
}




