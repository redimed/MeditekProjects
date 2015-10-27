//
//  Singleton_SocketManager.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/2/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift

class Singleton_SocketManager:UIViewController {
    static let shareInstance = Singleton_SocketManager()
    let socket = SocketIOClient(socketURL: ConfigurationSystem.Http_3009,opts: ["connectParams": ["__sails_io_sdk_version": "0.11.0", "Authorization":"Bearer \(tokens)", "CoreAuth": "Bearer \(coreTokens)"]])
    
}
let sharedSocket = Singleton_SocketManager()
