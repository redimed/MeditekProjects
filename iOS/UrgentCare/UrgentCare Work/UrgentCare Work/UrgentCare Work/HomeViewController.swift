//
//  HomeViewController.swift
//  UrgentCare Work
//
//  Created by DucManh on 2/29/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper

class HomeViewController: BaseViewController {
    
    @IBOutlet var button: [UIButton]!
    @IBOutlet var textField: [UITextField]!
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
    @IBAction func actionLogin(sender: AnyObject) {
        LoadingAnimation.showLoading()
        
        let login:Login = Login();
        login.UserName = textField[0].text!;
        login.Password = textField[1].text!;
        
        UserService.postLogin(login) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let loginResponse = Mapper<LoginResponse>().map(response.result.value) {
                            if loginResponse.status == "success"  {
                                LoadingAnimation.stopLoading()
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
