//
//  HomeViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class HomeViewController: UIViewController {
    
    let nsuserDefs = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewWillAppear(animated: Bool) {
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            
            SingleTon.socket.onAny {
                print("on any events: \($0.event) with items \($0.items)")
            }
            
            SingleTon.socket.on("connect") {data, ack in
                print("SOCKET CONNECTED")
            }
            
            SingleTon.socket.on("online_users") {data, ack in
                let onlineUser = JSON(data[0])
                print(onlineUser)
                SingleTon.onlineUser_Singleton = []
                for var i = 0; i < onlineUser.count ; ++i {
//                    if(String(onlineUser[i]["uid"]) != String(self.nsuserDefs["UID"])) {
                        SingleTon.onlineUser_Singleton.append(OnlineUsers(userId: "\(i+1)", numberPhone: String(onlineUser[i]["phone"]), UUID: String(onlineUser[i]["uid"])))
//                    }
                }
                NSNotificationCenter.defaultCenter().postNotificationName("reloadDataTable", object: self)
            }
            
            SingleTon.socket.on("answer") { data, ack in
                
            }
        })
        SingleTon.socket.connect()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
