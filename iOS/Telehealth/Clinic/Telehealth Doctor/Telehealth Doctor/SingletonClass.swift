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
import Alamofire

class Singleton {
    static let SingleTon = Singleton()
    let socket = SocketIOClient(socketURL: STRING_URL_SERVER, opts: ["connectParams": ["__sails_io_sdk_version": "0.11.0"]])
    var onlineUser_Singleton : [OnlineUsers] = []
    var infoOpentok : JSON!
    var headers : [String: String]!
    var detailAppointMentObj: JSON!
}
let SingleTon = Singleton()
