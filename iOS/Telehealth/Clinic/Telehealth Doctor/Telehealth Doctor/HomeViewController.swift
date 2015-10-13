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
    
//    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
    
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
                
//                SingleTon.socket.emit("get", GET_ONLINE_USERS)
//                let modURL = NSString(format: "/telehealth/socket/joinRoom?uid=%@", self.userDefaults["UID"] as! String)
//                let dictionNary : NSDictionary = ["url": modURL]
//                SingleTon.socket.emit("get", dictionNary)
            }
            
            SingleTon.socket.on("online_users") {data, ack in
                let onlineUser = JSON(data[0])
                SingleTon.onlineUser_Singleton = []
                for var i = 0; i < onlineUser.count ; ++i {
                    let fullnamePatient = onlineUser[i]["Patients"][0]["FirstName"].stringValue + " " + onlineUser[i]["Patients"][0]["MiddleName"].stringValue + " " + onlineUser[i]["Patients"][0]["LastName"].stringValue
                    let fullnameDoctor = onlineUser[i]["Doctors"][0]["FirstName"].stringValue + " " + onlineUser[i]["Doctors"][0]["MiddleName"].stringValue + " " + onlineUser[i]["Doctors"][0]["LastName"].stringValue
                    SingleTon.onlineUser_Singleton.append(OnlineUsers(userId: "\(i+1)", fullNamePatient: fullnamePatient, fullNameDoctor: fullnameDoctor, requestDateAppoinment: onlineUser[i]["RequestDate"].stringValue, appoinmentDate: onlineUser[i]["FromTime"].stringValue, UID: onlineUser[i]["TeleUID"].stringValue, status: onlineUser[i]["IsOnline"].intValue))
                }
                NSNotificationCenter.defaultCenter().postNotificationName("reloadDataTable", object: self)
            }
            
            SingleTon.socket.on("receiveMessage") { data, ack in
                let result = JSON(data[0])
                NSNotificationCenter.defaultCenter().postNotificationName("handleCallNotification", object: nil, userInfo: ["message": result["message"].stringValue])
            }
            
            SingleTon.socket.on("errorMsg") { data, ack in
                debugPrint("error event: ", data)
            }
        })
        SingleTon.socket.connect()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
