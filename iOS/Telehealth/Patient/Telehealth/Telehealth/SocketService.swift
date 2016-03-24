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

protocol SocketDelegate{
    func receiveMessage(controller:SocketService,message:String,data:AnyObject)
    func ShowLoading()
    func HideLoading()
}
let sharedSocket = Singleton_SocketManager()
class SocketService {
    
    var delegate : SocketDelegate! = nil
    
    func openSocket(uid:String,complete:(String) -> Void) {
        
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            sharedSocket.socket.onAny {
                print("got event: \($0.event) with items \($0.items)")
                _ = $0.event
                _ = $0.items
                if($0.event ==  "error" ){
                    if($0.items![0] as! String == "The network connection was lost."){
                        self.delegate.ShowLoading()
                    }
                }else if($0.event ==  "connect"){
                    //self.delegate.ShowLoading()
                }
            }
            // Socket Events
            sharedSocket.socket.on("connect") {data, ack in
                
                print("socket connected")
                complete("socket connected")
                let modifieldURLString = NSString(format: UrlAPISocket.joinRoom, uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                sharedSocket.socket.emit("get", dictionNary)
            
                print(defaults.valueForKey("loading"))
                if(defaults.valueForKey("loading") as! String == "1"){
                    self.delegate.HideLoading()
                }
                
            }
            
            sharedSocket.socket.on("receiveMessage"){data, ack in
                print("calling to me")
                //print(data)
                let message : String = data[0]["message"] as! String
                print("message----",data)
                self.delegate.receiveMessage(self, message: message,data:data)
            }
            
        })
        
        //Socket connecting
        sharedSocket.socket.connect()
        
    }
    
    //Emit socket
    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
    }
}