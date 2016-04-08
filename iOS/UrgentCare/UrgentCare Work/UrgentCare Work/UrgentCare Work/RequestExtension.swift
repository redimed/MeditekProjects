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