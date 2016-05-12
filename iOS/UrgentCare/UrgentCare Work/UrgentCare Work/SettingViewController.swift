//
//  SettingViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper

class SettingViewController: BaseViewController,UITableViewDelegate ,UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    
    var nameComapny :String = "name"
    var array = [["List Staff"],["Harry Berry","Change Pin Number"],["Other services", "About Redimed", "LOGOUT"]]
    var arrayTitle = ["Company", "Accounts", "", "", ""]
    var StringIncompleteProfile :String = "Incomplete Profile"
    var companyInfo = DetailCompanyResponse()
    var userInfor = LoginResponse()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        if(Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != ""){
            
            let userInforDict : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.userInfor) as! NSDictionary
            userInfor = Mapper().map(userInforDict)!
            
            if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
                if let companyInfoDict:NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.companyInfor) as? NSDictionary {
                    companyInfo = Mapper().map(companyInfoDict)!
                }
                if(companyInfo.data.count > 0){
                    array[0].append(companyInfo.data[0].CompanyName)
                }else{
                    array[0].append("")
                }
            }else{
                array = [["Harry Berry","Change Pin Number"],["Other services", "About Redimed", "LOGOUT"]]
                arrayTitle = ["Accounts", "", "", ""]
                
            }
        }else{
            array = [["Other services", "About Redimed"]]
            arrayTitle = [""]
            
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Setting"
    }
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return array.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return array[section].count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        if(Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != ""){
            if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
                if(indexPath.section == 1 && indexPath.row == 0){
                    let cell = tableView.dequeueReusableCellWithIdentifier("CellInfor", forIndexPath: indexPath) as! CustomTableViewCell;
                    cell.lbName.text = userInfor.user?.UserName
                    cell.lbProfile.text = StringIncompleteProfile
                    return cell
                }else{
                    let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
                    cell.textLabel?.text = array[indexPath.section][indexPath.row]
                    return cell
                }
            }else{
                if(indexPath.section == 0 && indexPath.row == 0){
                    let cell = tableView.dequeueReusableCellWithIdentifier("CellInfor", forIndexPath: indexPath) as! CustomTableViewCell;
                    cell.lbName.text = userInfor.user?.UserName
                    cell.lbProfile.text = StringIncompleteProfile
                    return cell
                }else{
                    let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
                    cell.textLabel?.text = array[indexPath.section][indexPath.row]
                    return cell
                }
            }
        }else{
            let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
            cell.textLabel?.text = array[indexPath.section][indexPath.row]
            return cell
        }
        
    }
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String?
    {
        return arrayTitle[section]
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        print(indexPath.row,indexPath.section)
        if(Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != ""){
            if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
                if(indexPath.row == 0 && indexPath.section == 0){
                    let listStaff :ListStaffViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListStaffViewControllerID") as! ListStaffViewController
                     listStaff.CheckStaffInfor = true
                    self.navigationController?.pushViewController(listStaff, animated: true)
                }
                if(indexPath.row == 1 && indexPath.section == 0){
                    let listSite :ListContactPersonViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListContactPersonViewControllerID") as! ListContactPersonViewController
                    listSite.CheckCompanyInfor = true
                    self.navigationController?.pushViewController(listSite, animated: true)
                }
                if(indexPath.row == 1 && indexPath.section == 1){
                    let changPinNumber :ChangePinNumberViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ChangePinNumberViewControllerID") as! ChangePinNumberViewController
                    self.navigationController?.pushViewController(changPinNumber, animated: true)
                }
                if(indexPath.row == 0 && indexPath.section == 1){
                    
                    let account :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("AccountViewControllerID") as! AccountViewController
                    self.navigationController?.pushViewController(account, animated: true)
                    
                }
                if(indexPath.row == 0 && indexPath.section == 2){
                    let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                    faqs.fileName = "FAQs"
                    faqs.navigationBarString = "FAQs"
                    self.navigationController?.pushViewController(faqs, animated: true)
                }
                if(indexPath.row == 1 && indexPath.section == 2){
                    let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                    faqs.fileName = "UrgentCare"
                    faqs.navigationBarString = "ABOUT REDIMED"
                    self.navigationController?.pushViewController(faqs, animated: true)
                }
                if(indexPath.row == 2 && indexPath.section == 2){
                    LogoutWhenIsAuthenticated()
                }
            }else{
                if(indexPath.row == 0 && indexPath.section == 0){
                    
                    let account :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("AccountViewControllerID") as! AccountViewController
                    self.navigationController?.pushViewController(account, animated: true)
                    
                }
                if(indexPath.row == 1 && indexPath.section == 0){
                    let changPinNumber :ChangePinNumberViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ChangePinNumberViewControllerID") as! ChangePinNumberViewController
                    self.navigationController?.pushViewController(changPinNumber, animated: true)
                }

                if(indexPath.row == 0 && indexPath.section == 1){
                    let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                    faqs.fileName = "FAQs"
                    faqs.navigationBarString = "FAQs"
                    self.navigationController?.pushViewController(faqs, animated: true)
                }
                if(indexPath.row == 1 && indexPath.section == 1){
                    let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                    faqs.fileName = "UrgentCare"
                    faqs.navigationBarString = "ABOUT REDIMED"
                    self.navigationController?.pushViewController(faqs, animated: true)
                }
                if(indexPath.row == 2 && indexPath.section == 1){
                    LogoutWhenIsAuthenticated()
                }
                
            }
        }else{
            if(indexPath.row == 0 && indexPath.section == 0){
                let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                faqs.fileName = "FAQs"
                faqs.navigationBarString = "FAQs"
                self.navigationController?.pushViewController(faqs, animated: true)
                
            }else{
                let faqs = self.storyboard?.instantiateViewControllerWithIdentifier("FAQsViewControllerID") as! FAQsViewController
                faqs.fileName = "UrgentCare"
                faqs.navigationBarString = "ABOUT REDIMED"
                self.navigationController?.pushViewController(faqs, animated: true)
            }
        }
    }
    
}
