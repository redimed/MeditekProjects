//
//  AccountViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper

class AccountViewController: BaseViewController {
    
    @IBOutlet weak var FullName: UITextField!
    @IBOutlet weak var BookingPerson: UITextField!
    @IBOutlet weak var Email: UITextField!
    @IBOutlet weak var Phone: UITextField!
    @IBOutlet weak var Mobile: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        self.navigationItem.title = "Account"
        loadData()
    }
    
    func loadData(){
        
        let userInforDict : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.userInfor) as! NSDictionary
        let userInfor :LoginResponse = Mapper().map(userInforDict)!
        let user: User = userInfor.user!
        
        UserService.getDetailUserAccount(user.UID) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let userAccountDetail = Mapper<UserAccountDetail>().map(response.result.value) {
                            print(userAccountDetail.id)
                            if(userAccountDetail.UserName != ""){
                                self!.FullName.text = userAccountDetail.UserName
                                self!.Email.text = userAccountDetail.Email
                                self?.Phone.text = userAccountDetail.PhoneNumber
                            }else{
                                //self!.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    // self!.hideLoading()
                    self?.showMessageNoNetwork()
                }
            }
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
    
}
