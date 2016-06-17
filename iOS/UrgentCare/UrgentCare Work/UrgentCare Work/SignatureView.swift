
import UIKit

@available(iOS 9.0, *)
class SignatureUIView : UIView {
    
    var drawImage : UIImage?
    var samplePoints = [CGPoint]()
    var path = UIBezierPath()
    var shouldClear = false
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        backgroundColor = .whiteColor()
        path.lineCapStyle = .Round
        path.lineJoinStyle = .Round
        path.lineWidth = 3
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        //fatalError("init(coder:) has not been implemented")
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        let touch = touches.first
        samplePoints.append((touch?.locationInView(self))!)
    }
    override func touchesMoved(touches: Set<UITouch>, withEvent event: UIEvent?) {
        let touch = touches.first!
        
        for coalesedTouch in event!.coalescedTouchesForTouch(touch)!{
            samplePoints.append(coalesedTouch.locationInView(self))
        }
        setNeedsLayout()
    }
    override func touchesEnded(touches: Set<UITouch>, withEvent event: UIEvent?) {
        UIGraphicsBeginImageContextWithOptions(bounds.size, false, 0)
        drawViewHierarchyInRect(bounds, afterScreenUpdates: true)
        drawImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        samplePoints.removeAll()
    }
    override func touchesCancelled(touches: Set<UITouch>?, withEvent event: UIEvent?) {
        touchesEnded(touches!, withEvent: event)
    }
    
    func getMidPointFromPointA(a:CGPoint, andB b : CGPoint)-> CGPoint{
        return CGPoint(x: (a.x + b.x)/2, y: (a.y + b.y)/2)
    }
    
    override func drawRect(rect: CGRect) {
        let ctx = UIGraphicsGetCurrentContext()
        CGContextSetAllowsAntialiasing(ctx, true)
        CGContextSetShouldAntialias(ctx, true)
        
        UIColor.blueColor().setStroke()
        path.removeAllPoints()
        
        drawImage?.drawInRect(rect)
        
        if !samplePoints.isEmpty{
            path.moveToPoint(samplePoints.first!)
            path.addLineToPoint(getMidPointFromPointA(samplePoints.first!, andB: samplePoints[1]))
            for idx in 1..<samplePoints.count - 1{
                let midPoint = getMidPointFromPointA(samplePoints[idx], andB: samplePoints[idx+1])
                path.addQuadCurveToPoint(midPoint, controlPoint: samplePoints[idx])
            }
            path.addLineToPoint(samplePoints.last!)
            path.stroke()
        }
    }
}
