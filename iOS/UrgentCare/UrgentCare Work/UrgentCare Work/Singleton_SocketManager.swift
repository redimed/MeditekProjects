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
    let socket = SocketIOClient(socketURL: Constants.Path.SERVICE_URL_3009,options: [
        .ConnectParams(["__sails_io_sdk_version": "0.11.0", "Authorization":"\(Context.getDataDefasults(Define.keyNSDefaults.Authorization) as! String)"]),
        .ForcePolling(true),
        ])
}

