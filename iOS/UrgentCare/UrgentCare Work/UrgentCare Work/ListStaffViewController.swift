//
//  ListStaffViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/8/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class ListStaffViewController:BaseViewController,UITableViewDelegate ,UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    var alertViewList = UIAlertView()
    var refreshControl: UIRefreshControl!
    var listStaff = ListStaff()
    var staff = Staff()
    var CheckStaffInfor = false
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.delegate = self
        tableView.dataSource = self
        loadData()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationItem.title = "List Staff"
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
        if(CheckStaffInfor == true){
            self.navigationController?.navigationBarHidden = false
            self.navigationController?.navigationBar.topItem?.title = "Back"
            self.navigationItem.title = "List Staff"
        }
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
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
                                    self!.alertViewList.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
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
        cell.textLabel?.text =  "\(listStaff.data[indexPath.row].FirstName + " " + listStaff.data[indexPath.row].LastName)"
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        GetStaffDetail(listStaff.data[indexPath.row].UID)
        
    }
    func GetStaffDetail(patientUID:String){
        let getDatailPatientData : GetDatailPatientData = GetDatailPatientData()
        let getDatailPatient : GetDatailPatient = GetDatailPatient()
        getDatailPatient.UID = patientUID
        getDatailPatientData.data = getDatailPatient
        
        UserService.postGetPatientDetail(getDatailPatientData) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let dataPatientDetail = Mapper<DataPatientDetail>().map(response.result.value) {
                            if(dataPatientDetail.message == "success"){
                                if(self!.CheckStaffInfor != true){
                                    Context.deleteDatDefaults(Define.keyNSDefaults.DetailStaff)
                                    Context.setDataDefaults("YES", key: Define.keyNSDefaults.DetailStaffCheck)
                                    let profile = Mapper().toJSON(dataPatientDetail)
                                    Context.setDataDefaults(profile, key: Define.keyNSDefaults.DetailStaff)
                                    self!.navigationController?.popViewControllerAnimated(true)
                                }else{
                                    let staffViewController :StaffDetailViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("StaffDetailViewControllerID") as! StaffDetailViewController
                                    staffViewController.staff = dataPatientDetail
                                    self!.navigationController?.pushViewController(staffViewController, animated: true)
                                }
                                
                            }else{
                                //self!.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertViewList.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
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
    @IBAction func actionBack(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
}