//
//  DTAlertView.swift
//  VgoUserApp
//
//  Created by admin on 30/01/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit

let HEIGHT: CGFloat = 70.0
let HEIGT_IMAGE_ICON: CGFloat =  30.0
let WIDH_IMAGE_ICON: CGFloat = 30.0


let messageDefault = "This is message"
let titleDefault = "Notification"



enum DTAlertStyle: Int{
    case DTAlertStyleError = 0
    case DTAlertStyleSuccess
    case DTAlertStyleInfo
}
enum DTAlertErrorStyle: Int{
    case DTAlertStyleErrorDefault = 0
    case DTAlertStyleErrorNetwork
}
@objc protocol  DTAlertViewDelegate: NSObjectProtocol
{
    optional func willPresentDTAlertView(alertView: DTAlertView)
    optional func didPresentDTAlertView(alertView: DTAlertView)
    optional func DTAlertViewWillDismiss(alertView: DTAlertView)
    optional func DTAlertViewDidDismiss(alertView: DTAlertView)
    
}

class DTAlertView: UIView {
    
    var delegate: DTAlertViewDelegate!
    var message: String!
    var title: String!
    var alertViewStyle: DTAlertStyle!
    var isPresenting : Bool = false
    
    var lbTitle: UILabel!;
    var lbMessage: UILabel!;
    var imgIcon: UIImageView?
    
    var imgShadow: UIImageView!;
    var animationDuration: NSTimeInterval!
    var alertDuration: NSTimeInterval!
    
    var backgroundBlackView: UIView!
    var backgroundView : UIImageView!
    var buttonShadow: UIImageView!
    var MARGIN_TOP:CGFloat!
    
    init(alertStyle: DTAlertStyle, message: String, title: String, object: protocol<DTAlertViewDelegate>)
    {
        super.init(frame: CGRectMake(0, 0, Define.ScreenSize.SCREEN_WIDTH, HEIGHT))
        self.initDefault()
        setUpStyleView(alertStyle)
        self.message = message
        self.title = title
        self.delegate = object
        
        
    }
    init(alertStyle: DTAlertErrorStyle, message: String, title: String, object: protocol<DTAlertViewDelegate>)
    {
        super.init(frame: CGRectMake(0, 0, Define.ScreenSize.SCREEN_WIDTH, HEIGHT))
        self.initDefault()
        setUpStyleView(DTAlertStyle.DTAlertStyleError)
        self.message = message
        self.title = title
        self.delegate = object
        self.tag = 400
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        
    }
    override init(frame: CGRect) {
        super.init(frame: frame)
        
    }
    func initDefault()
    {
        self.alertViewStyle = DTAlertStyle.DTAlertStyleSuccess
        self.message = messageDefault
        self.title = titleDefault
        self.animationDuration = 0.6
        self.alertDuration = 10.0
        
        self.backgroundColor = UIColor.colorBackgroundAlert()
        if originY() == 0{
            MARGIN_TOP = 15.0
        } else {
            MARGIN_TOP = 35.0
        }
        self.translatesAutoresizingMaskIntoConstraints = true
        
        let gesture: UITapGestureRecognizer! = UITapGestureRecognizer(target: self, action: Selector("hide"))
        self.addGestureRecognizer(gesture)
        
        
        self.imgIcon = UIImageView(frame: CGRectMake(MARGIN_TOP, MARGIN_TOP, HEIGT_IMAGE_ICON, WIDH_IMAGE_ICON))
        self.addSubview(self.imgIcon!)
        
        
        let frame:CGRect =  CGRectMake(MARGIN_TOP * 6 + HEIGT_IMAGE_ICON, MARGIN_TOP, Define.ScreenSize.SCREEN_WIDTH - HEIGT_IMAGE_ICON - 3 * MARGIN_TOP, 21)
        self.lbTitle = UILabel(frame: frame)
        self.lbTitle.numberOfLines = 0
        self.lbTitle.font = UIFont(name: "Helvetica", size: 14)
        self.addSubview(self.lbTitle)
        
        let frm: CGRect = CGRectMake(MARGIN_TOP * 2 + HEIGT_IMAGE_ICON, MARGIN_TOP + frame.size.height + 5, Define.ScreenSize.SCREEN_WIDTH - HEIGT_IMAGE_ICON - 3 * MARGIN_TOP, 21)
        self.lbMessage = UILabel(frame: frm)
        self.lbMessage.numberOfLines = 0;
        self.lbMessage.font = UIFont(name: "Helvetica", size: 14)
        self.addSubview(self.lbMessage)
        
        buttonShadow = UIImageView(frame: CGRectMake(0, self.frame.height - 10, self.frame.width,2.0))
        buttonShadow.image = UIImage(named: "BottomShadow")
        self.addSubview(buttonShadow)
        
        
    }
    func setUpStyleView(alertVS: DTAlertStyle)
    {
        
        var color: UIColor!;
        self.alertViewStyle = alertVS
        var image: UIImage!
        
        switch (alertVS) {
        case .DTAlertStyleError:
            
            image = UIImage(named: "AlertViewErrorIcon")
            color = UIColor.colorAlertError()
            break
        case .DTAlertStyleInfo:
            image = UIImage(named: "AlertViewInfoIcon")
            color = UIColor.colorAlertInfo()
            break
        case .DTAlertStyleSuccess:
            image = UIImage(named: "AlertViewSucessIcon")
            color = UIColor.colorAlertSuccess()
            break
        }
        
        self.imgIcon!.image = image
        self.lbTitle.textColor = color;
        self.lbMessage.textColor = color;
    }
    func hide()
    {
        if (self.delegate .respondsToSelector(Selector("DTAlertViewWillDismiss:")))
        {
            self.delegate.DTAlertViewWillDismiss!(self)
        }
        var frame: CGRect = self.frame
        frame.origin.y = -(CGRectGetHeight(self.frame) + self.originY())
        
        UIView.animateWithDuration(animationDuration, animations: { () -> Void in
            self.frame = frame
            self.alpha = 0;
            
            }) { (isFinished:Bool) -> Void in
                if (isFinished)
                {
                    self.isPresenting = false
                    self.removeFromSuperview()
                    if (self.delegate .respondsToSelector(Selector("DTAlertViewDidDismiss:")))
                    {
                        self.delegate.DTAlertViewDidDismiss!(self)
                    }
                    
                }
        }
    }
    
    func show()
    {
        if (isPresenting){
            return;
        }
        isPresenting = true
        
        self.lbTitle.text = self.title
        self.lbMessage.text = self.message
        self.adjustLayout()
        
        
        if (self.delegate .respondsToSelector(Selector("willPresentNZAlertView:")))
        {
            self.delegate.willPresentDTAlertView!(self)
        }
        
        
        let application: UIApplication = UIApplication.sharedApplication()
        let index: NSInteger! = application.keyWindow?.subviews.count
        var isHas = false
        if self.alertViewStyle == DTAlertStyle.DTAlertStyleError {
            for var i = 0; i < application.keyWindow?.subviews.count; i++ {
                let view: UIView = (application.keyWindow?.subviews[i])!
                if view.tag == 400 {
                    isHas = true
                }
            }
        }
        if isHas == false {
            application.keyWindow?.insertSubview(self, atIndex: index)
        }
        
        var frame: CGRect = self.frame
        frame.origin.y = -(self.originY() + CGRectGetHeight(self.frame))
        self.frame = frame
        
        self.alpha = 0
        
        var viewFrame: CGRect = self.frame
        viewFrame.origin.y = self.originY()
        
        
        UIView.animateWithDuration(0.6, animations: {
            self.frame = viewFrame
            self.alpha = 1
            }, completion: {
                (value: Bool) in
                if (self.delegate .respondsToSelector(Selector("didPresentDTAlertView:")))
                {
                    self.delegate.didPresentDTAlertView!(self)
                }
                self.performSelector(Selector("hide"), withObject: self, afterDelay: 10.0)
        })
        
        
    }
    
    func adjustLayout() {
        
        let heightTitle: CGFloat = (self.lbTitle.text?.heightWithConstrainedWidth(self.lbTitle.frame.size.width, font: self.lbTitle.font))!
        let heightMessage: CGFloat = (self.lbMessage.text?.heightWithConstrainedWidth(self.lbMessage.frame.size.width, font: self.lbMessage.font))!
        var frmMessage: CGRect = self.lbMessage.frame
        frmMessage.size.height = heightMessage
        self.lbMessage.frame = frmMessage
        
        let heightView : CGFloat = heightTitle + heightMessage + MARGIN_TOP + 5 + MARGIN_TOP
        
        let heightImage: CGFloat = self.imgIcon!.frame.origin.y + HEIGT_IMAGE_ICON
        let heighFrame: CGFloat
        if heightImage >= heightView
        {
            heighFrame = heightImage + MARGIN_TOP
        } else {
            heighFrame = heightView
        }
        
        var frame: CGRect = self.frame
        frame.size.height = heighFrame
        self.frame = frame
        
        var frmBottomBorder: CGRect = self.buttonShadow.frame
        frmBottomBorder.origin.y = self.frame.height
        self.buttonShadow.frame = frmBottomBorder
        
    }
    
    func originY() -> CGFloat
    {
        var originY:CGFloat = 0;
        let application: UIApplication = UIApplication.sharedApplication()
        if (application.statusBarHidden)
        {
            originY = application.statusBarFrame.size.height
        }
        return originY;
    }
}
