//
//  ListStaffViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/8/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper

class ListStaffViewController:BaseViewController,UITableViewDelegate ,UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    
    var refreshControl: UIRefreshControl!
    var listStaff = ListStaff()
    var staff = Staff()
    var CheckStaffInfor = false
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.title = "List Staff"
        tableView.delegate = self
        tableView.dataSource = self
        loadData()
    }
    override func viewWillAppear(animated: Bool) {
        if(CheckStaffInfor == true){
            self.navigationController?.navigationBarHidden = false
            self.navigationController?.navigationBar.topItem?.title = "Back"
            self.navigationItem.title = "List Staff"
        }
    }
    func loadData(){
        
        let userInforDict : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.userInfor) as! NSDictionary
        let userInfor :LoginResponse = Mapper().map(userInforDict)!
        let user: User = userInfor.user!
        
        UserService.getListStaff(user.UID) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let listStaff = Mapper<ListStaff>().map(response.result.value) {
                            if(listStaff.message == "success"){
                                //self!.hideLoading()
                                self?.listStaff = listStaff
                                self!.tableView.reloadData()
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
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listStaff.data.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
        cell.textLabel?.text = listStaff.data[indexPath.row].FirstName + listStaff.data[indexPath.row].LastName
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        
        if(CheckStaffInfor != true){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailStaff)
            Context.setDataDefaults("YES", key: Define.keyNSDefaults.DetailStaffCheck)
            let profile = Mapper().toJSON(listStaff.data[indexPath.row])
            Context.setDataDefaults(profile, key: Define.keyNSDefaults.DetailStaff)
            self.navigationController?.popViewControllerAnimated(true)
        }else{
            let staffViewController :StaffDetailViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("StaffDetailViewControllerID") as! StaffDetailViewController
            staffViewController.staff = listStaff.data[indexPath.row]
            self.navigationController?.pushViewController(staffViewController, animated: true)
        }
        
    }
    @IBAction func actionBack(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
}