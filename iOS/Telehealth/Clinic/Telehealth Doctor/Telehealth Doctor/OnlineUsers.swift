//
//  OnlineUsers.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/5/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

class OnlineUsers {
    
    var userId: String!
    var numberPhone: String!
    var UUID:String!
    
    init(userId: String, numberPhone: String, UUID: String) {
        self.userId = userId
        self.numberPhone = numberPhone
        self.UUID = UUID
    }
}