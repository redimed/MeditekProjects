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
    let WaitTimeCall = 120 * Double(NSEC_PER_SEC)
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
        let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self.WaitTimeCall))
        dispatch_after(time, dispatch_get_main_queue(), {
             self.cancelCall()
        })
        super.viewDidLoad()
        UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: UIStatusBarAnimation.Fade)
        view.frame = CGRect(x: 0.0, y: 0, width: UIScreen.mainScreen().bounds.width, height: UIScreen.mainScreen().bounds.height)

        self.view.layer.masksToBounds = true
        uuidTo = receiveMessageData.from
        uuidFrom = Context.getDataDefasults(Define.keyNSDefaults.TelehealthUserUID) as! String
        declineBtn.layer.cornerRadius = 25
        answerBtn.layer.cornerRadius = 25
        
        userCallingLabel.text = receiveMessageData.fromName
        NSNotificationCenter.defaultCenter().removeObserver(self,name:"endCallAnswer",object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(MyPopupViewController.cancelCall), name: "cancelCall", object: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
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
