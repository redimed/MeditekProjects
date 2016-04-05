//
//  HomeViewController.swift
//  UrgentCare Work
//
//  Created by DucManh on 2/29/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import SwiftyJSON

class HomeViewController: BaseViewController {
    
    @IBOutlet var button: [UIButton]!
    @IBOutlet var textField: [UITextField]!
    
    var loginResponse : LoginResponse?
    var listRole = []
    override func viewDidLoad() {
        super.viewDidLoad()
        for text : UITextField in textField {
            text.addDoneButton(text)
        }
        for text : UITextField in textField {
            text.attributedPlaceholder = NSAttributedString(string: text.placeholder!, attributes:[ NSForegroundColorAttributeName: UIColor.whiteColor()])
        }
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    func setHeaderData(){
        
    }
    @IBAction func actionLogin(sender: AnyObject) {
        LoadingAnimation.showLoading()
        
        let login:Login = Login();
//        login.UserName = textField[0].text!;
//        login.Password = textField[1].text!;
        login.UserName = "0400000002";
        login.Password = "redimed";
        
        UserService.postLogin(login) { [weak self] (response) in
            
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let loginResponse = Mapper<LoginResponse>().map(response.result.value) {
                            
                            if loginResponse.status == "success"  {
                                LoadingAnimation.stopLoading()
                                
                                //Set hearder data
                                let token =  "Bearer \(loginResponse.token)"
                                Context.setDataDefaults(token, key: Define.keyNSDefaults.Authorization)
                                Context.setDataDefaults("login", key: Define.keyNSDefaults.userLogin)
                                
                                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                                   Context.setDataDefaults(cookie, key: Define.keyNSDefaults.Cookie)
                                }
                                let profile = Mapper().toJSON(loginResponse)
                                Context.setDataDefaults(profile, key: Define.keyNSDefaults.userInfor)
                                //end setHeader data
                                
                                
                                let loginViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewController") as! ViewController
                                self!.navigationController?.pushViewController(loginViewController, animated: true)
                                
                            }else{
                                LoadingAnimation.stopLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
                
            }
        }
    }
    
}
