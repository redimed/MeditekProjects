//
//  Singleton_SocketManager.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/2/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
protocol callViewDelegate {
    func callView (controller:Singleton_SocketManager,sender:String)
}
class Singleton_SocketManager:UIViewController {
    static let shareInstance = Singleton_SocketManager()
    let socket = SocketIOClient(socketURL: config.Http)
    var delegate: callViewDelegate? = nil
      
}
let sharedSocket = Singleton_SocketManager()
