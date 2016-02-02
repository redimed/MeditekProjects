//
//  DetailImageVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Spring

class DetailImageVC: UIViewController, UIScrollViewDelegate {
    
    @IBOutlet var imageView: UIImageView!
    @IBOutlet var scrollViewImg: UIScrollView!
    @IBOutlet var btnCtrlImage: [UIButton]!
    
    var indexSelect: Int!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let imgSrc: NSData = SingleTon.imgDataMedical[indexSelect]
        imageView.image = UIImage(data: imgSrc)
        
        let gestureRecognizer = UITapGestureRecognizer(target: self, action: "hanldeImageView:")
        imageView.userInteractionEnabled = true
        imageView.addGestureRecognizer(gestureRecognizer)
        
        scrollViewImg.minimumZoomScale = 1.0
        scrollViewImg.maximumZoomScale = 6.0
        
    }
    
    func hanldeImageView(img: AnyObject) {
        for button in btnCtrlImage {
            button.hidden = !button.hidden
            if button.hidden {
                UIView.animateWithDuration(0.5, delay: 0.0, options: .TransitionNone, animations: { () -> Void in
                    button.alpha = 0
                    UIApplication.sharedApplication().statusBarHidden = true
                    }, completion: { (finished: Bool) -> Void in
                })
            } else {
                UIView.animateWithDuration(0.3, delay: 0.0, options: .TransitionNone, animations: { () -> Void in
                    button.alpha = 1
                    UIApplication.sharedApplication().statusBarHidden = false
                    }, completion: { (finished: Bool) -> Void in
                        
                })
            }
        }
    }
    
    func viewForZoomingInScrollView(scrollView: UIScrollView) -> UIView? {
        return self.imageView
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func backPopController(sender: AnyObject) {
        dismissViewControllerAnimated(true, completion: nil)
    }
    @IBAction func rotateLeft(sender: AnyObject) {
        imageView.image = imageView.image?.imageRotateByDegrees(-90, flip: false)
    }
    
    @IBAction func rotateRight(sender: AnyObject) {
        imageView.image = imageView.image?.imageRotateByDegrees(90, flip: false)
    }
}

extension UIImage {
    public func imageRotateByDegrees(degrees: CGFloat, flip: Bool) -> UIImage {
        let _: (CGFloat) -> CGFloat = {
            return $0 * (180.0 / CGFloat(M_PI))
        }
        let degreesToRadians: (CGFloat) -> CGFloat = {
            return $0 / 180.0 * CGFloat(M_PI)
        }
        
        let rotatedViewBox = UIView(frame: CGRect(origin: CGPointZero, size: size))
        
        let t  = CGAffineTransformMakeRotation(degreesToRadians(degrees))
        rotatedViewBox.transform = t
        
        let rotatedSize = rotatedViewBox.frame.size
        
        UIGraphicsBeginImageContext(rotatedSize)
        let bitmap = UIGraphicsGetCurrentContext()
        
        CGContextTranslateCTM(bitmap, rotatedSize.width / 2.0, rotatedSize.height / 2.0)
        CGContextRotateCTM(bitmap, degreesToRadians(degrees))
        
        var yFlip: CGFloat
        
        if flip {
            yFlip = CGFloat(-1.0)
        } else {
            yFlip = CGFloat(1.0)
        }
        
        CGContextScaleCTM(bitmap, yFlip, -1.0)
        CGContextDrawImage(bitmap, CGRectMake(-size.width / 2, -size.height / 2, size.width, size.height), CGImage)
        
        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return newImage
    }
}























