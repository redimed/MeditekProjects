//
//  SocketService.swift
//  Telehealth
//
//  Created by Nguyen Duc Manh on 1/14/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import SocketIOClientSwift
import SwiftyJSON
import ObjectMapper

let Socket = SocketIOClient(socketURL: Constants.Path.SERVICE_URL_3009,options: [
    .ConnectParams(["__sails_io_sdk_version": "0.11.0", "Authorization":"\(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as! String)"]),
    .ReconnectWait(1),
    .ForcePolling(true),
    ])
protocol SocketDelegate{
    func receiveMessage(controller:SocketService,message:String,data:AnyObject)
}

class SocketService {
    
    var delegate : SocketDelegate! = nil
    func openSocket(uid:String,complete:(String) -> Void) {
        print(uid)
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            Socket.onAny {
                print("got event: \($0.event) with items \($0.items)")
                _ = $0.event
                _ = $0.items
            }
            // Socket Events
            Socket.on("connect") {data, ack in
                print("socket connected")
                let modifieldURLString = NSString(format: Define.UrlAPISocket.joinRoom, uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                print("dictionNary",dictionNary)
                Socket.emit("get", dictionNary)
            }
            
            Socket.on("receiveMessage"){data, ack in
                print("calling to me")
                if let receiveData = Mapper<ReceiveMessageData>().map(data[0]) {
                    receiveMessageData = receiveData
                    print("message----",data)
                    self.delegate.receiveMessage(self, message: receiveData.message,data:data)
                }
            }
            
        })
        Socket.connect()
        
    }

    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: Define.UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        Socket.emit("get", dictionNary)
    }
}