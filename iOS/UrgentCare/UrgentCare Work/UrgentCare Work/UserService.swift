//
//  UserService.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire

class UserService {
    
    //Post API
    class func postLogin(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_LOGIN, model: model, completion: completion)
    }
    class func postUpdateProfile(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_UPDATEPROFILE, model: model, completion: completion)
    }
    
    class func postCheckVerifyCode(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_CHECKVERIFY_CODE, model: model, completion: completion)
    }
    
    class func postRequestVerify(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_CHECKACTIVATION, model: model, completion: completion)
    }
    class func postRequestAppointmentCompany(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_REQUEST_APPOINTMENTCOMPANY, model: model, completion: completion)
    }
    class func postRequestAppointmentPatient(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.postRequestAppoint(Constants.UserURL.URL_POST_REQUEST_APPOINTMENT, model: model, completion: completion)
    }
    class func postCheckActivation(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_CHECKACTIVATION, model: model, completion: completion)
    }
    class func postForgetPin(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_FORGETPIN, model: model, completion: completion)
    }
    class func postTelehealthUser(model: BaseModel, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.post(Constants.UserURL.URL_POST_TELEHEATHUSER, model: model, completion: completion)
    }
    
    //Get API
    class func getLogout(completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_LOGOUT, completion: completion)
    }
    class func getListStaff(userID:String, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_LIST_STAFF + "/"+userID, completion: completion)
    }
    class func getListSite(companyID:String, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_LIST_SITE + "/"+companyID, completion: completion)
    }
    
    class func getDetailUserAccount(userID:String, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_DETAIL_USER + "?UID="+userID, completion: completion)
    }
    class func getPatientInfomation(patientIUD:String, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_PATIENTINFORMATION + "/"+patientIUD, completion: completion)
    }
    class func getDetailCompanyByUser(userID:String, completion : Response<AnyObject, NSError> -> Void) -> Request {
        return RequestFactory.get(Constants.UserURL.URL_GET_DETAIL_COMPANY_BY_USER+"/"+userID, completion: completion)
    }
 
}
