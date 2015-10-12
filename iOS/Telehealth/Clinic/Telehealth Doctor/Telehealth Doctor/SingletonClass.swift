//
//  LibraryAPI.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/1/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class Singleton {
    static let SingleTon = Singleton()
    let socket = SocketIOClient(socketURL: STRING_URL_SERVER)
    var onlineUser_Singleton : [OnlineUsers] = []
    var infoOpentok : JSON!
}
let SingleTon = Singleton()
