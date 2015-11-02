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
import MediaPlayer

class HomeViewController: UIViewController {
    
    var moviePlayer : MPMoviePlayerController?
    let customUIViewController : CustomViewController = CustomViewController()
    
    @IBOutlet weak var buttonAppointment: UIButton!
    @IBOutlet weak var imageListIcon: UIImageView!
    @IBOutlet var labelDashboard: [UILabel]!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        playVideo()
        
        buttonAppointment.layer.cornerRadius = 15
        buttonAppointment.layer.borderWidth = 2
        buttonAppointment.layer.borderColor = UIColor(red: 255/0, green: 255/0, blue: 255/0, alpha: 0.5).CGColor
        
        self.navigationController!.navigationBar.tintColor = UIColor.whiteColor()
        let fontDictionary = [ NSForegroundColorAttributeName:UIColor.whiteColor() ]
        self.navigationController!.navigationBar.titleTextAttributes = fontDictionary
        self.navigationController!.navigationBar.setBackgroundImage(imageLayerForGradientBackground(), forBarMetrics: UIBarMetrics.Default)
    }
    
    func playVideo() {
        let path = NSBundle.mainBundle().pathForResource("video", ofType:"mp4")
        let url = NSURL.fileURLWithPath(path!)
        moviePlayer = MPMoviePlayerController(contentURL: url)
        if let player = moviePlayer {
            player.view.frame = self.view.bounds
            player.prepareToPlay()
            player.scalingMode = .AspectFill
            player.repeatMode = .One
            customUIViewController.BlurLayer(player.view)
            self.view.addSubview(player.view)
            player.view.addSubview(buttonAppointment)
            player.view.addSubview(imageListIcon)
            for label : UILabel in labelDashboard {
                player.view.addSubview(label)
            }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        
        let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
        
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            SingleTon.socket.onAny {
                if let event: String! = $0.event {
                    if event != "online_users" && event != "refreshToken" {
                        print("on any events: \($0.event) with items \($0.items)")
                    }
                }
            }
            
            SingleTon.socket.on("connect") {data, ack in
                print("SOCKET CONNECTED")
                SingleTon.socket.emit("get", ["url": NSString(format: JOIN_ROOM, userDefaults["UID"] as! String)])
            }
            
            SingleTon.socket.on("online_users") {data, ack in
                let response = JSON(data[0])
                SingleTon.onlineUser_Singleton = []
                for var i = 0; i < response.count ; ++i {
                    
                    let onlineObj : OnlineUsers = OnlineUsers(userId: "\(i+1)",
                        requestDateAppoinment: response[i]["RequestDate"].stringValue,
                        appoinmentDate: response[i]["FromTime"].stringValue,
                        UID: response[i]["TeleUID"].stringValue,
                        status: response[i]["IsOnline"].intValue,
                        firstNameDoctor: response[i]["Doctors"][0]["FirstName"].stringValue,
                        midleNameDoctor: response[i]["Doctors"][0]["MiddleName"].stringValue,
                        lastNameDoctor: response[i]["Doctors"][0]["LastName"].stringValue,
                        firstNamePatient: response[i]["Patients"][0]["FirstName"].stringValue,
                        midleNamePatient: response[i]["Patients"][0]["MiddleName"].stringValue,
                        lastNamePatient: response[i]["Patients"][0]["LastName"].stringValue,
                        appointmentUID: response[i]["UID"].stringValue
                    )
                    
                    SingleTon.onlineUser_Singleton.append(onlineObj)
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
            
            SingleTon.socket.on("refreshToken") { data, ack in
                if let readJson: JSON = JSON(data) {
                    AUTHTOKEN = readJson["token"].stringValue
                }
            }
        })
        SingleTon.socket.connect()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    private func imageLayerForGradientBackground() -> UIImage {
        
        var updatedFrame = self.navigationController!.navigationBar.bounds
        // take into account the status bar
        updatedFrame.size.height += 20
        let layer = CAGradientLayer.gradientLayerForBounds(updatedFrame)
        UIGraphicsBeginImageContext(layer.bounds.size)
        layer.renderInContext(UIGraphicsGetCurrentContext()!)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return image
    }
    
}

extension CAGradientLayer {
    class func gradientLayerForBounds(bounds: CGRect) -> CAGradientLayer {
        let layer = CAGradientLayer()
        layer.frame = bounds
        layer.colors = [UIColor(hex: "FF2A68").CGColor, UIColor(hex: "FF5E3A").CGColor]
        return layer
    }
}
