//
//  MyPopupViewController.swift
//  SLPopupViewControllerDemo
//
//  Created by Nguyen Duc Hoang on 9/13/15.
//  Copyright © 2015 Nguyen Duc Hoang. All rights reserved.
//

import UIKit

protocol MyPopupViewControllerDelegate {
    func pressOK(sender: MyPopupViewController)
    func pressCancel(sender: MyPopupViewController)
}
class MyPopupViewController: UIViewController , MAActivityIndicatorViewDelegate {
    var uuidFrom = String()
    var uuidTo = String()
    @IBOutlet weak var userCallingLabel: UILabel!
    var indicatorView1 : MAActivityIndicatorView!
    @IBOutlet weak var viewForActivity1: UIView!

    var delegate:MyPopupViewControllerDelegate?
    @IBAction func btnOK(sender:UIButton) {
        self.delegate?.pressOK(self)
    }
    @IBOutlet weak var answerBtn: UIButton!
    @IBOutlet weak var declineBtn: UIButton!
        @IBAction func btnCancel(sender:UIButton) {
        self.delegate?.pressCancel(self)
    }
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.view.layer.cornerRadius = 22
        self.view.layer.masksToBounds = true
        uuidTo = String(savedData.data[0]["from"])
        //Get uuid from in localstorage
        if let uuid = defaults.valueForKey("uid") as? String {
            uuidFrom = uuid
            
        }
        declineBtn.layer.cornerRadius = 10
        answerBtn.layer.cornerRadius = 10
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            
            self.indicatorView1 = MAActivityIndicatorView(frame: self.viewForActivity1.frame)
            self.indicatorView1.defaultColor = UIColor.redColor()
            self.indicatorView1.animationDuration    = 1
            self.indicatorView1.numberOfCircles      = 4
            self.indicatorView1.maxRadius            = 16
            self.indicatorView1.delegate = self
            // self.indicatorView1.backgroundColor = UIColor.lightGrayColor()
            self.indicatorView1.startAnimating()
            self.view.addSubview(self.indicatorView1)
            
        })
        
        userCallingLabel.text = savedData.fromName
        NSNotificationCenter.defaultCenter().removeObserver(self,name:"endCallAnswer",object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "cancelCall", name: "cancelCall", object: nil)
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func cancelCall() {
        self.delegate?.pressCancel(self)
    }
    func activityIndicatorView(activityIndicatorView: MAActivityIndicatorView, circleBackgroundColorAtIndex index: NSInteger) -> UIColor {
        
        let R = CGFloat(arc4random() % 256)/255
        let G = CGFloat(arc4random() % 256)/255
        let B = CGFloat(arc4random() % 256)/255
        
        return UIColor(red: R, green: G, blue: B, alpha: 1)
    }

    
    
    



}
