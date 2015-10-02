//
//  HomeViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift

class HomeViewController: UIViewController {
    
    override func viewDidLoad() {
        
        // sharedSocketa.addHandler()
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        
    }
    
    @IBAction func testEmit(sender: AnyObject) {
        let modifieldURLString = NSString(format: "/telehealth/socket/joinRoom?phone=%@", "000999999") as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        socketSingleTon.socket.emit("get", dictionNary)
    }
    
    override func viewWillAppear(animated: Bool) {
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            socketSingleTon.socket.onAny {
                print("got event: \($0.event) with items \($0.items)")
            }
            
            socketSingleTon.socket.on("connect") {data, ack in
                print("socket connected")
                let modifieldURLString = NSString(format: "/telehealth/socket/joinRoom?phone=%@", "000999999") as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                socketSingleTon.socket.emit("get", dictionNary)
            }
            
            socketSingleTon.socket.on("jsonTestEmit") {data, ack in
                print("json test emit")
                let controllerId = "LoginView"
                let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
                let initViewController : UIViewController = storyBoard.instantiateViewControllerWithIdentifier(controllerId) as UIViewController
                self.presentViewController(initViewController, animated: true, completion: nil)
            }
        })
        socketSingleTon.socket.connect()
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
