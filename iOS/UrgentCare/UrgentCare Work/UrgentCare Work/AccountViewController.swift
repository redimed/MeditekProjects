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
    
    @IBOutlet weak var txtAccountName: UITextField!
    @IBOutlet weak var txtAccountBookingPerson: UITextField!
    @IBOutlet weak var txtAccountMobile: UITextField!
    @IBOutlet weak var txtAccountEmail: UITextField!
    
    @IBOutlet weak var txtFirstName: UITextField!
    @IBOutlet weak var txtMiddleName: UITextField!
    @IBOutlet weak var txtLastName: UITextField!
    @IBOutlet weak var txtHomePhone: UITextField!
    @IBOutlet weak var txtDOB: UITextField!
    @IBOutlet weak var txtEmail: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtSuburb: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtCountry: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()
       // ScrollView.contentSize.height = 1000
        self.navigationItem.title = "Account"
        loadDataUserAccount()
    }
    
    func loadDataUserAccount(){
        
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
                                self!.txtAccountName.text = userAccountDetail.UserName
                                self!.txtAccountEmail.text = userAccountDetail.Email
                                self?.txtAccountMobile.text = userAccountDetail.PhoneNumber
                            }else{
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
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
    
}
