//
//  ListStaffViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/8/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class ListContactPersonViewController:BaseViewController,UITableViewDelegate ,UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    
    var refreshControl: UIRefreshControl!
    var listSite = ListSite()
    var site = Site()
    var companyInfo = DetailCompanyResponse()
    var CheckCompanyInfor = false
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.delegate = self
        tableView.dataSource = self
        loadData()
    }
    func loadData(){
        
        if let companyInfoDict:NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.companyInfor) as? NSDictionary {
            companyInfo = Mapper().map(companyInfoDict)!
        }
        if(companyInfo.data.count > 0){
            let CompanyDetail : DetailCompanyData = companyInfo.data[0]
            UserService.getListSite(CompanyDetail.UID) { [weak self] (response) in
                print(response.result.value)
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            if let listSite = Mapper<ListSite>().map(response.result.value) {
                                print(response.result.value)
                                if(listSite.message == "success"){
                                    //self!.hideLoading()
                                    self?.listSite = listSite
                                    self!.tableView.reloadData()
                                }else{
                                    //self!.hideLoading()
                                    if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                        print(errorModel)
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
            
        }else{
        }
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        if(CheckCompanyInfor == true){
            self.navigationController?.navigationBarHidden = false
            self.navigationController?.navigationBar.topItem?.title = "Back"
            self.navigationItem.title = "List Site"
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listSite.data.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as UITableViewCell;
        cell.textLabel?.text = listSite.data[indexPath.row].SiteName
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        
        if(CheckCompanyInfor != true){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailSite)
            Context.setDataDefaults("YES", key: Define.keyNSDefaults.DetailSiteCheck)
            let profile = Mapper().toJSON(listSite.data[indexPath.row])
            Context.setDataDefaults(profile, key: Define.keyNSDefaults.DetailSite)
            self.navigationController?.popViewControllerAnimated(true)
        }else{
            let company :CompanyViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("CompanyViewControllerID") as! CompanyViewController
            company.site = listSite.data[indexPath.row]
            self.navigationController?.pushViewController(company, animated: true)
        }
    }
    @IBAction func actionBack(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
}