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
    
    var fullNamePatient: String!
    
    var fullNameDoctor: String!
    
    var requestDateAppoinment: String!
    var appoinmentDate: String!
    var status: Int!
    
    var UID:String!
    
    init(userId: String, fullNamePatient: String, fullNameDoctor: String, requestDateAppoinment: String, appoinmentDate: String, UID:String, status: Int) {
        self.userId = userId
        
        self.fullNamePatient = fullNamePatient
        
        self.fullNameDoctor = fullNameDoctor
        
        self.requestDateAppoinment = requestDateAppoinment
        self.appoinmentDate = appoinmentDate
        self.status = status
        
        self.UID = UID
    }
}