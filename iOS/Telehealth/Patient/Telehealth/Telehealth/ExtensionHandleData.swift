//
//  ExtensionHandleData.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/12/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SystemConfiguration
import SwiftyJSON
import Alamofire
//Extension Handle
extension String
{
    func toDateTimeZone(time:String,format:String) -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = time//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        if date != nil {
            dateFormatter.dateFormat = format///this is you want to convert format
            dateFormatter.timeZone = NSTimeZone(name: "UTC")
            let timeStamp = dateFormatter.stringFromDate(date!)
            return String(timeStamp)
        }else {
            return String(self)
        }
        //Return Parsed Date
    }
    //Change format Male or Female
    func toGender() -> String
    {
        var gender = String()
        if self == "F" {
            gender = "Female"
        }else {
            gender = "Male"
        }
        return gender
    }
    
    var capitalizeFirst:String {
        var result = self
        result.replaceRange(startIndex...startIndex, with: String(self[startIndex]).capitalizedString)
        return result
    }
}

extension UIApplication {
    //get version info
    func applicationVersion() -> String {
        
        return NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString") as! String
    }
    //get build info
    func applicationBuild() -> String {
        
        return NSBundle.mainBundle().objectForInfoDictionaryKey(kCFBundleVersionKey as String) as! String
    }
    //Get version and buid
    func versionBuild() -> String {
        
        let version = self.applicationVersion()
        let build = self.applicationBuild()
        return "v\(version)(\(build))"
    }
    func bundleID() -> String{
        let bundleIdentifier = NSBundle.mainBundle().bundleIdentifier
        return bundleIdentifier!
    }
    
    
    func isConnectedToNetwork() -> Bool {
        var zeroAddress = sockaddr_in()
        zeroAddress.sin_len = UInt8(sizeofValue(zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        let defaultRouteReachability = withUnsafePointer(&zeroAddress) {
            SCNetworkReachabilityCreateWithAddress(nil, UnsafePointer($0))
        }
        var flags = SCNetworkReachabilityFlags()
        if !SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) {
            return false
        }
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        return (isReachable && !needsConnection)
    }
    

}



extension UIColor {
    //Return RGB value color
    static func colorRBGValue(redValue redValue:CGFloat,greenValue:CGFloat,blueValue:CGFloat,alphaValue:CGFloat) -> UIColor {
        return UIColor(red: redValue/255.0, green: greenValue/255.0, blue: blueValue/255.0, alpha: alphaValue)
    }
}
//comprestion Image data
extension UIImage {
    var uncompressedPNGData: NSData      { return UIImagePNGRepresentation(self)!        }
    var highestQualityJPEGNSData: NSData { return UIImageJPEGRepresentation(self, 1.0)!  }
    var highQualityJPEGNSData: NSData    { return UIImageJPEGRepresentation(self, 0.75)! }
    var mediumQualityJPEGNSData: NSData  { return UIImageJPEGRepresentation(self, 0.5)!  }
    var lowQualityJPEGNSData: NSData     { return UIImageJPEGRepresentation(self, 0.25)! }
    var lowestQualityJPEGNSData:NSData   { return UIImageJPEGRepresentation(self, 0.0)!  }
}


extension UIImage {
    //Rotate Image
    public func imageRotatedByDegrees(degrees: CGFloat, flip: Bool) -> UIImage {
        let radiansToDegrees: (CGFloat) -> CGFloat = {
            return $0 * (180.0 / CGFloat(M_PI))
        }
        let degreesToRadians: (CGFloat) -> CGFloat = {
            return $0 / 180.0 * CGFloat(M_PI)
        }
        
        // calculate the size of the rotated view's containing box for our drawing space
        let rotatedViewBox = UIView(frame: CGRect(origin: CGPointZero, size: size))
        let t = CGAffineTransformMakeRotation(degreesToRadians(degrees));
        rotatedViewBox.transform = t
        let rotatedSize = rotatedViewBox.frame.size
        
        // Create the bitmap context
        UIGraphicsBeginImageContext(rotatedSize)
        let bitmap = UIGraphicsGetCurrentContext()
        
        // Move the origin to the middle of the image so we will rotate and scale around the center.
        CGContextTranslateCTM(bitmap, rotatedSize.width / 2.0, rotatedSize.height / 2.0);
        
        //   // Rotate the image context
        CGContextRotateCTM(bitmap, degreesToRadians(degrees));
        
        // Now, draw the rotated/scaled image into the context
        var yFlip: CGFloat
        
        if(flip){
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

extension ConfigurationSystem {
    //Giap: Check input only number
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case numberHashValue.number0 :
            return true
        case numberHashValue.number1 :
            return true
        case numberHashValue.number2 :
            return true
        case numberHashValue.number3 :
            return true
        case numberHashValue.number4 :
            return true
        case numberHashValue.number5 :
            return true
        case numberHashValue.number6 :
            return true
        case numberHashValue.number7 :
            return true
        case numberHashValue.number8 :
            return true
        case numberHashValue.number9 :
            return true
        case numberHashValue.delete :
            return true
        default:
            return false
        }
    }

    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    
    //Giap: Regex check valid phone number
    func validateRegex(value: String,regex:String) -> Bool {
       
        let REGEX = regex
        
        let checkRegex = NSPredicate(format: "SELF MATCHES %@", REGEX)
        
        let result =  checkRegex.evaluateWithObject(value)
        
        return result
    }
    
    func setLabelAttribute(message:String) -> NSMutableAttributedString{
        var myMutableString = NSMutableAttributedString()
        myMutableString = NSMutableAttributedString(string: message as String, attributes: [NSFontAttributeName:UIFont(name: "Georgia", size: 18.0)!])
        myMutableString.addAttribute(NSForegroundColorAttributeName, value: UIColor.redColor(), range: NSRange(location:27,length:6))
        myMutableString.addAttribute(NSForegroundColorAttributeName, value: UIColor.colorRBGValue(redValue: 0, greenValue: 148, blueValue: 250, alphaValue: 1), range: NSRange(location:33,length:4))

        return myMutableString
        
    }
    
    func invalidSertificate(){
        manager.delegate.sessionDidReceiveChallenge = { session, challenge in
            var disposition: NSURLSessionAuthChallengeDisposition = .PerformDefaultHandling
            var credential: NSURLCredential?
            
            if challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust {
                disposition = NSURLSessionAuthChallengeDisposition.UseCredential
                credential = NSURLCredential(forTrust: challenge.protectionSpace.serverTrust!)
            } else {
                if challenge.previousFailureCount > 0 {
                    disposition = .CancelAuthenticationChallenge
                } else {
                    credential = manager.session.configuration.URLCredentialStorage?.defaultCredentialForProtectionSpace(challenge.protectionSpace)
                    
                    if credential != nil {
                        disposition = .UseCredential
                    }
                }
            }
            
            return (disposition, credential)
        }
    }
    
  
    
    mutating func setHeader(){
        if let token = defaults.valueForKey("token") as? String {
            headers["Authorization"] =  "Bearer \(token)"
        }
        if let userUIDs = defaults.valueForKey("userUID") as? String{
            headers["useruid"] = "\(userUIDs ?? "")"
        }
        if let cookie = defaults.valueForKey("Set-Cookie") as? String{
            
            headers["Cookie"] = cookie as String
        }
        if let deviceId = defaults.valueForKey("deviceID") as? String{
            
            headers["deviceId"] = deviceId as String
        }
        
    }
    
    
 

}

extension UIAlertView {
    func alertMessage(title:String,message:String){
        let alert = UIAlertView()
        alert.title = title
        alert.message = message
        alert.addButtonWithTitle("OK")
        alert.show()
    }
}

extension UIViewController {
    func showloading(message:String){
        let alert = UIAlertController(title: nil, message : message , preferredStyle: .Alert)
        
        alert.view.tintColor = UIColor.blackColor()
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(10, 5, 50, 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
        loadingIndicator.startAnimating();
        
        alert.view.addSubview(loadingIndicator)
        presentViewController(alert, animated: true, completion: nil)
    }
    func hideLoading(){
         dismissViewControllerAnimated(false, completion: nil)
    }

}


