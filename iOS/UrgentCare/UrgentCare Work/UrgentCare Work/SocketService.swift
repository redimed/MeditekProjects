//
//  SocketService.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/14/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SocketIOClientSwift
import SwiftyJSON

let Socket = SocketIOClient(socketURL: Constants.Path.SERVICE_URL_3009,options: [
    .ConnectParams(["__sails_io_sdk_version": "0.11.0", "Authorization":"\(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as! String)"]),
    .ForcePolling(true),
    ])

class SocketService {

    func openSocket(uid:String,complete:(String) -> Void) {
        print(uid)
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            Socket.onAny {
                print("got event: \($0.event) with items \($0.items)")
                _ = $0.event
                _ = $0.items
                if($0.event ==  "error" ){
                    if($0.items![0] as! String == "The network connection was lost."){
                       // self.delegate.ShowLoading()
                    }
                }else if($0.event ==  "connect"){
                    //self.delegate.ShowLoading()
                }
            }
            // Socket Events
            Socket.on("connect") {data, ack in
                
                print("socket connected")
                let modifieldURLString = NSString(format: Constants.UrlAPISocket.joinRoom, uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                Socket.emit("get", dictionNary)
            }
            
            Socket.on("receiveMessage"){data, ack in
                print("calling to me")
                let message : String = data[0]["message"] as! String
                print("message----",message)
                //self.delegate.receiveMessage(self, message: message,data:data)
            }
            
        })
        Socket.connect()
        
    }

    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: Constants.UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        Socket.emit("get", dictionNary)
    }
}