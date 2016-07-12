//
//  SignatureUIView.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

struct Point {
    var location: CGPoint
    var magnitude: CGFloat
}

class SignatureUIView: UIView {
    var drawImage: UIImage?
    let path=UIBezierPath()
    
    var previousPoint:CGPoint = CGPoint.zero
    
    var strokeColor:UIColor?
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    override func drawRect(rect: CGRect) {
        
        strokeColor = UIColor.blackColor()
        strokeColor?.setStroke()
        path.lineWidth = 2
        path.stroke()
        
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        
        let touch: AnyObject? = touches.first
        let currentPoint = touch!.locationInView(self)
        
        path.moveToPoint(currentPoint)
        previousPoint=currentPoint
        self.setNeedsDisplay()
    }
    
    override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
        let touch: AnyObject? = touches.first
        let currentPoint = touch!.locationInView(self)
        let midPoint = self.midPoint(previousPoint, p1: currentPoint)
        
        path.addQuadCurveToPoint(midPoint,controlPoint: previousPoint)
        previousPoint=currentPoint
        
        self.setNeedsDisplay()
        
        path.moveToPoint(midPoint)
    }
    
    override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {
        UIGraphicsBeginImageContextWithOptions(bounds.size, false, 0)
        drawViewHierarchyInRect(bounds, afterScreenUpdates: true)
        drawImage = UIGraphicsGetImageFromCurrentImageContext()
        
        UIGraphicsEndImageContext()
        self.setNeedsDisplay()
    }
    
    override func touchesCancelled(touches: Set<UITouch>?, withEvent event: UIEvent?) {
        self.touchesEnded(touches!, withEvent: event)
    }
    func SaveImage()->UIImage{
        self.userInteractionEnabled = false
        setNeedsDisplay()
        return drawImage!
        
    }
    func CheckDrawImageNil()->Bool{
        if(drawImage != nil){
            return false
        }else{
            return true
        }
    }
    func Clear(){
        self.userInteractionEnabled = true
        drawImage = nil
        path.removeAllPoints()
        setNeedsDisplay()
    }
    
    func midPoint(p0:CGPoint,p1:CGPoint)->CGPoint
    {
        let x=(p0.x+p1.x)/2
        let y=(p0.y+p1.y)/2
        return CGPoint(x: x, y: y)
    }
    
}