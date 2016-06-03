//
//  Contants.swift
//  VgoUserApp
//
//  Created by admin on 07/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import Foundation
import UIKit

struct Constants {
    
    //        struct Path {
    //            static let SERVICE_URL_3006                              = "https://testapp.redimed.com.au:3006"
    //            static let SERVICE_URL_3005                              = "https://testapp.redimed.com.au:3005"
    //            static let SERVICE_URL_3009                              = "https://testapp.redimed.com.au:3009"
    //            static let SandboxOption                                 = false
    //        }
    
//    struct Path {
//        static let SERVICE_URL_3006                              = "https://meditek.redimed.com.au:3006"
//        static let SERVICE_URL_3005                              = "https://meditek.redimed.com.au:3005"
//        static let SERVICE_URL_3009                              = "https://meditek.redimed.com.au:3009"
//        static let SandboxOption                                 = true
//    }
    //    struct Path {
    //        static let SERVICE_URL_3006                              = "http://192.168.1.102:3006"
    //        static let SERVICE_URL_3005                              = "http://192.168.1.102:3005"
    //        static let SERVICE_URL_3009                              = "http://192.168.1.102:3009"
    //        static let SandboxOption                                 = true
     //   }
        struct Path {
            static let SERVICE_URL_3006                              = "http://192.168.1.247:3006"
            static let SERVICE_URL_3005                              = "http://192.168.1.247:3005"
            static let SERVICE_URL_3009                              = "http://192.168.1.247:3009"
            static let SandboxOption                                 = true
        }
    struct KeyPushNotification {
        static let SandboxOption = Path.SandboxOption
        //True: using key develoment
        //False: using key product
    }
    struct UserURL {
        static let URL_POST_LOGIN                                = Path.SERVICE_URL_3006 + "/api/login";
        static let URL_GET_LOGOUT                                = Path.SERVICE_URL_3006 + "/api/logout";
        static let GET_NEW_TOKEN                                 = Path.SERVICE_URL_3006 + "/api/refresh-token/GetNewToken"
        
        static let URL_GET_DETAIL_COMPANY_BY_USER                = Path.SERVICE_URL_3005 + "/api/company/detail-company-by-user";
        static let URL_GET_LIST_STAFF                            = Path.SERVICE_URL_3005 + "/api/company/get-list-staff"
        static let URL_GET_LIST_SITE                             = Path.SERVICE_URL_3005 + "/api/company/get-list-site"
        static let URL_GET_DETAIL_USER                           = Path.SERVICE_URL_3005 + "/api/user-account/GetUserAccountDetails"
        static let URL_POST_REQUEST_APPOINTMENTCOMPANY           = Path.SERVICE_URL_3005 + "/api/appointment-wa-request/company"
        static let URL_POST_REQUEST_APPOINTMENT                  = Path.SERVICE_URL_3005 + "/api/appointment-wa-request/patient-new"
        static let URL_GET_IMAGE                                 = Path.SERVICE_URL_3005 + "/api/downloadFile/400"
        static let URL_UPLOAD_IMAGE                              = Path.SERVICE_URL_3005 + "/api/uploadFile"
        
        static let URL_POST_REQUEST_VERIFY                       = Path.SERVICE_URL_3009 + "/api/telehealth/user/requestActivationCode";
        static let URL_POST_CHECKVERIFY_CODE                     = Path.SERVICE_URL_3009 + "/api/telehealth/user/verifyActivationCode"
        static let URL_POST_CHECKACTIVATION                      = Path.SERVICE_URL_3009 + "/api/telehealth/checkActivation"
        static let URL_GET_PATIENTINFORMATION                    = Path.SERVICE_URL_3009 + "/api/telehealth/user/details"
        static let URL_POST_UPDATEPROFILE                        = Path.SERVICE_URL_3009 + "/api/telehealth/user/update"
        static let URL_POST_FORGETPIN                            = Path.SERVICE_URL_3009 + "/api/telehealth/user/forgetPin"
        static let URL_POST_TELEHEATHUSER                        = Path.SERVICE_URL_3009 + "/api/telehealth/user"
        static let URL_POST_UPDATE_PINNUMBER                     = Path.SERVICE_URL_3009 + "/api/telehealth/updatePinNumber"
        static let URL_POST_APPOINTMENTLIST                      = Path.SERVICE_URL_3009 + "/api/telehealth/user/appointments"
        static let URL_GET_DETAILS_APPOINMENT                    = Path.SERVICE_URL_3009 + "/api/telehealth/user/WAAppointmentDetails"
        static let URL_POST_UPDATEFILE_TO_APPOINTMENT            = Path.SERVICE_URL_3009 + "/api/telehealth/appointment/updateFile"
    }
    
}