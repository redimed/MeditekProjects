//
//  AnswerCallViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/5/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class AnswerCallViewController: UIViewController {
    var uuidFrom = String()
    var uuidTo = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //get UUID to
        uuidTo = String(savedData.data[0]["from"])
        //Get uuid from in localstorage
        if let uuid = defaults.valueForKey("UserInformation") as? String {
            uuidFrom = uuid
            
        }
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    //Giap: Action handle Answer
    @IBAction func btnAnswerAction(sender: AnyObject) {
        
        emitDataToServer(MessageString.CallAnswer.rawValue)
        
        performSegueWithIdentifier("CallingSegue", sender: self)
        
    }
    //Giap: Action handle Cancel Call
    @IBAction func btnEndCallAction(sender: AnyObject) {
        
        emitDataToServer(MessageString.CallEndCall.rawValue)
        
        //Change to home view
        let HomeController = storyboard?.instantiateViewControllerWithIdentifier("NavigationHomeStoryboard") as! NavigationHomeViewController
        presentViewController(HomeController, animated: true, completion: nil)
        
    }
    
    //Giap: Func handle emit socket to server 2 message : Answer or EndCall
    func emitDataToServer(message:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer.rawValue,self.uuidFrom,self.uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
    }
    
    
    
}

