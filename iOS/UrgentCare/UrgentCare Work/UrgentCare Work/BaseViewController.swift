//
//  BaseViewController.swift
//  VgoUserApp
//
//  Created by admin on 02/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

class BaseViewController: UIViewController,DTAlertViewDelegate,UITextFieldDelegate {
    
    //var alertView: DTAlertView!
    var alertView = UIAlertView()
    var alertDTAlertView: DTAlertView!
    let delay = 0.5 * Double(NSEC_PER_SEC)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(BaseViewController.LogoutWhenIsAuthenticated), name: Define.LogoutFunction, object: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
      
    func leftNavButtonClick(sender:UIButton!)
    {
        self.navigationController?.popViewControllerAnimated(true)
    }
    //MARK: - deletate DT ALERT
    func willPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "will present")
    }
    func didPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "Did present")
    }
    func DTAlertViewWillDismiss(alertView: DTAlertView) {
        NSLog("%@", "Will Dismiss")
    }
    func DTAlertViewDidDismiss(alertView: DTAlertView) {
        NSLog("%@", "did Dismiss")
    }
    func showAlertWithMessageTitle(message: String, title: String, alertStyle: DTAlertStyle){
        self.alertDTAlertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: self)
        self.alertDTAlertView.show()
    }
    func LogoutWhenIsAuthenticated(){
        
        CallAPILogout(Context.getDataDefasults(Define.keyNSDefaults.UID) as! String)
        Context.deleteDatDefaults(Define.keyNSDefaults.Authorization)
        Context.deleteDatDefaults(Define.keyNSDefaults.userLogin)
        Context.deleteDatDefaults(Define.keyNSDefaults.Cookie)
        Context.deleteDatDefaults(Define.keyNSDefaults.companyInfor)
        Context.deleteDatDefaults(Define.keyNSDefaults.UIDLogoutFail)
        Context.deleteDatDefaults(Define.keyNSDefaults.UID)
        Context.deleteDatDefaults(Define.keyNSDefaults.IsCompanyAccount)
        Context.deleteDatDefaults(Define.keyNSDefaults.userLogin)
        Context.deleteDatDefaults(Define.keyNSDefaults.TeleheathUserDetail)
    }
    func CallAPILogout(uid:String){
       self.showloading(Define.MessageString.PleaseWait)
        UserService.getLogout() { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let logoutResponse = Mapper<LogoutResponse>().map(response.result.value) {
                            if(logoutResponse.status == "success"){
                                
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                
                                self!.hideLoading()
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })
                            }else{
                                self!.hideLoading()
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                    dispatch_after(time, dispatch_get_main_queue(), {
                        self?.navigationController?.pushViewController(loginViewController, animated: true)
                    })

                }
            }
        }
    }
}
