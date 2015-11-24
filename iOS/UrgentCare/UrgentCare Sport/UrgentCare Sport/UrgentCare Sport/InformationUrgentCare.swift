//
//  InformationUrgentCare.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation


class Information {
    var firstName : String!
    var lastName : String!
    var phoneNumber : String!
    var email : String!
    var DOB : String!
    var suburb : String!
    var GPReferral : String!
    var description : String!
    var  physiotherapy : String!
    var specialist : String!
    var handTherapy : String!
    var urgentRequestType : String!
    var requestDate : String!
    var GP:String!
    init(firstName:String,lastName:String,phoneNumber:String,email:String,DOB:String,suburb:String,GPReferral:String,description:String,physiotherapy:String,specialist:String,handTherapy:String,urgentRequestType:String,requestDate:String,GP:String){
        self.firstName = firstName
        self.lastName = lastName
        self.phoneNumber = phoneNumber
        self.email = email
        self.DOB = DOB
        self.suburb = suburb
        self.GPReferral = GPReferral
        self.description = description
        self.physiotherapy = physiotherapy
        self.specialist = specialist
        self.handTherapy = handTherapy
        self.urgentRequestType = urgentRequestType
        self.requestDate = requestDate
        self.GP = GP
    }
}