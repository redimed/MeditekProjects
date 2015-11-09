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
    
    var firstNameDoctor: String!
    var midleNameDoctor: String!
    var lastNameDoctor: String!
    
    var firstNamePatient: String!
    var midleNamePatient: String!
    var lastNamePatient: String!
    
    var requestDateAppoinment: String!
    var appoinmentDate: String!
    var status: Int!
    var UID:String!
    
    var fullNameDoctor: String!
    var fullNamePatient: String!
    
    init(userId: String, requestDateAppoinment: String, appoinmentDate: String, UID:String, status: Int, firstNameDoctor: String, midleNameDoctor: String, lastNameDoctor: String, firstNamePatient: String, midleNamePatient: String, lastNamePatient: String) {
        self.userId = userId
        
        self.requestDateAppoinment = requestDateAppoinment
        self.appoinmentDate = appoinmentDate
        self.status = status
        
        self.UID = UID
        fullNameDoctor = firstNameDoctor + " " + midleNameDoctor + " " + lastNameDoctor
        fullNamePatient = firstNamePatient + " " + midleNamePatient + " " + lastNamePatient
    }
}