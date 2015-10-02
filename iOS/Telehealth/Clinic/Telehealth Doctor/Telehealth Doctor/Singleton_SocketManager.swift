//
//  LibraryAPI.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/1/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift

class Singleton_SocketManager {
    static let socketSingleTon = Singleton_SocketManager()
    let socket = SocketIOClient(socketURL: "http://192.168.1.130:3000")
}
let socketSingleTon = Singleton_SocketManager()
