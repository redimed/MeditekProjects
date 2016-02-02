//
//  Singleton_SocketManager.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/2/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SocketIOClientSwift

class Singleton_SocketManager:UIViewController {
    static let shareInstance = Singleton_SocketManager()
//    let socket = SocketIOClient(socketURL: ConfigurationSystem.Http_3009,options: ["connectParams": ["__sails_io_sdk_version": "0.11.0", "Authorization":"Bearer \(tokens)"]])
    let socket = SocketIOClient(socketURL: ConfigurationSystem.Http_3009,options: [
//        .Log(true),
        .ConnectParams(["__sails_io_sdk_version": "0.11.0", "Authorization":"Bearer \(tokens)"]),
        .ForcePolling(true),
        ])
}

