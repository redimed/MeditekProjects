//
//  Request+Extension.swift
//  StoreApp
//
//  Created by admin on 18/02/16.
//  Copyright © 2016 HarveyNash. All rights reserved.
//

import Foundation
import Alamofire

extension Request {
//    public func exResponseJSON(
//        options options: NSJSONReadingOptions = .AllowFragments,
//        completionHandler: Response<AnyObject, NSError> -> Void)
//        -> Self
//    {
//        let req = response(
//            responseSerializer: Request.JSONResponseSerializer(options: options),
//            completionHandler: {[weak self] (response) in
//                print(response)
//                if let strongSelf = self {
//                    if response.result.isSuccess {
//                        if response.response!.statusCode == 401 {
//                            
//                            // handle message
//                            strongSelf.handleErrorMessage(response.result.value)
//                            completionHandler(response)
//                        }
//                        else if response.response?.statusCode != 200 {
//                            // handle error message
//                            strongSelf.handleErrorMessage(response.result.value)
//                            completionHandler(response)
//                        }
//                        else {
//                            completionHandler(response)
//                        }
//                    } else {
//                        // no internet
//                        strongSelf.showMessageNoNetwork()
//                        completionHandler(response)
//                    }
//                }
//                else {
//                    completionHandler(response)
//                }
//            }
//        )
//        return req
//    }
    
    private func handleErrorMessage(JSON: AnyObject?)
    {
        Utility.getTopViewController()?.handleApiError(JSON)
    }
    private func showMessageNoNetwork()
    {
        let base = Utility.getTopViewController()
        
        Alert.alert(base!, message: "No Network", title: "Notification", alertStyle: DTAlertErrorStyle.DTAlertStyleErrorNetwork)
    }
}