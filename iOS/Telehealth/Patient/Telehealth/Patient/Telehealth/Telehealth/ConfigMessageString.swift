//
//  ConfigMessageString.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/15/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation

//Giap: Group Message in system
struct MessageString  {
    static let CallAnswer : String = "answer"
    static let CallEndCall : String = "end"
    static let Decline : String = "decline"
    static let Call : String = "call"
    static let Cancel : String = "cancel"
    static let VersionAndBuild : String = "© REDIMED 2015 \(UIApplication.sharedApplication().versionBuild()) – App Design by Meditek"
    static let QuestionCallPhone : String = "You want to contact us?"
    static let MessageLogout : String = "Are you sure you want to unregister? This will delete your user account on this device."
    static let StringHealthCare:String = "Personalised + Customised, HEALTHCARE anywhere"
    static let phoneNumberCallUs : String = "tel://0892300900"
    static let savedPictureMessage : String = "Your picture was saved to Camera Roll"
    static let placeHolderDescription : String = "Description of injury"
}

struct ErrorMessage {
    static let NoData : String = "No appointment details!"
    static let TimeOut: String  = "Request Time Out"
    static let TimeOutToken : String = "jwt expired"
    static let CheckField : String = "Please check field"
}


struct statusAppointment {
    static let Attended : String = "Attended"
    static let Waitlist : String = "Waitlist"
    static let Pending : String = "Pending"
    static let Received : String = "Received"
    static let Cancelled : String = "Cancelled"
    static let Approved : String = "Approved"
    static let Finished : String = "Finished"
}
