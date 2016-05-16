//
//  ListTrackingViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class ListTrackingViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var spinner: UIActivityIndicatorView!
    let alertView = UIAlertView()
    
    var patientUid = String()
    var refreshControl: UIRefreshControl!
    var loadingData = false
    var sumPage = String()
    override func viewDidLoad() {
        super.viewDidLoad()
        getAppointmentLists()
        
        
        
        //        create refreshControl
        refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor.blackColor()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Pull to refresh")
        refreshControl.addTarget(self, action: #selector(ListTrackingViewController.getAppointmentLists), forControlEvents: UIControlEvents.ValueChanged)
        tableView.addSubview(refreshControl)
        
    }
    
    
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Giap: Get Appointment List
    func getAppointmentLists() {
       refreshPage(Context.getDataDefasults(Define.keyNSDefaults.PatientUID) as! String,Offset: "0")
    }
    
    func refreshPage(patientUID:String,Offset:String){
        appointmentListTrackingData.Offset = Offset
        filterPatientData.UID = patientUID
        
        filterPatient.Patient = filterPatientData
        orderAppointment.Appointment = orderAppointmentData
        appointmentListTrackingData.Filter.removeAll()
        appointmentListTrackingData.Order.removeAll()
        appointmentListTrackingData.Filter.append(filterPatient)
        appointmentListTrackingData.Order.append(orderAppointment)
        appointmentListTracking.data = appointmentListTrackingData

        UserService.postAppointmentList(appointmentListTracking) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let userAccountDetail = Mapper<UserAccountDetail>().map(response.result.value) {
                            print(userAccountDetail.id)
                            if(userAccountDetail.UserName != ""){
                                
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
    
//    func getAppointmentList(patientUID:String,Offset:String){
//        appointmentService.getAppointmentByID(patientUID, Limit: "20",Offset:Offset, completionHandler: {
//            message , appointmentList ,sumPage in
//            
//            if message["message"] == "error" {
//                self.alertView.alertMessage("Error", message: message["ErrorType"].string!)
//                self.refreshControl.endRefreshing()
//            }
//            else {
//                self.Appointment += appointmentList
//                print(self.Appointment.count)
//                self.view.hideLoading()
//                self.refreshControl.endRefreshing()
//                self.tableView.reloadData()
//                self.loadingData = false
//            }
//            
//        })
//    }
//    
//    //sending data by segue
//    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
//        if segue.identifier == "appointmentDetailsSegue" {
//            let appointmentDedtails = segue.destinationViewController as! ListTrackingViewController
//            if let indexPath = tableView.indexPathForSelectedRow {
//                appointmentDedtails.appointmentDetails = Appointment[indexPath.row]
//            }
//        }
//    }
    
    
    
    
}

extension ListTrackingViewController:UITableViewDataSource,UITableViewDelegate{
    
    
    
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 2
    }
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
       
        return UITableViewCell()
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
       // performSegueWithIdentifier("appointmentDetailsSegue", sender: self)
        //tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }
    
    
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        
        cell.alpha = 0
        UIView.animateWithDuration(0.25, animations: {
            cell.alpha = 1
        })
    }
    
}

