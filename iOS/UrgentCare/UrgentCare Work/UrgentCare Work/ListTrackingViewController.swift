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
    var sumPage = Int()
    var appointmentList = AppointmentListResponse()
    override func viewDidLoad() {
        super.viewDidLoad()
        getAppointmentLists()
        refreshController()
    }
    
    func refreshController() {
        refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor.blackColor()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Pull to refresh")
        refreshControl.addTarget(self, action: #selector(ListTrackingViewController.getAppointmentLists), forControlEvents: UIControlEvents.ValueChanged)
        tableView.addSubview(refreshControl)
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
        self.navigationItem.title = "List Appointment"

    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    func getAppointmentLists() {
        refreshPage(Context.getDataDefasults(Define.keyNSDefaults.PatientUID) as! String,Offset: "0",refreshPage:true)
    }
    
    func refreshPage(patientUID:String,Offset:String,refreshPage:Bool){
        appointmentListTrackingData.Offset = Offset
        appointmentListTrackingData.Limit = "10"
        filterPatientData.UID = patientUID

        filterPatient.Patient = filterPatientData
        orderAppointment.Appointment = orderAppointmentData
        appointmentListTrackingData.Filter.removeAll()
        appointmentListTrackingData.Order.removeAll()
        if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String == ""){
            appointmentListTrackingData.Filter.append(filterPatient)
        }
        appointmentListTrackingData.Order.append(orderAppointment)
        appointmentListTracking.data = appointmentListTrackingData

        UserService.postAppointmentList(appointmentListTracking) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let appointmentListResponse = Mapper<AppointmentListResponse>().map(response.result.value) {
                            if(refreshPage){
                             self!.appointmentList = appointmentListResponse
                            }else{
                                self!.appointmentList.rows += appointmentListResponse.rows
                            }
                            
                            if(appointmentListResponse.rows.count > 0){
                                self!.view.hideLoading()
                                self!.sumPage = appointmentListResponse.count
                                self!.refreshControl.endRefreshing()
                                self!.tableView.reloadData()
                                self!.loadingData = false
                                
                                
                            }else{
                                self!.refreshControl.endRefreshing()
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

extension ListTrackingViewController:UITableViewDataSource,UITableViewDelegate{

    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return appointmentList.rows.count
    }
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
       
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) as! AppointmentTableViewCell
        let data = appointmentList.rows[indexPath.row]
        print(data)
        cell.appointmentDate.text = data.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatDate)
        let DataPatient = data.Patients.count != 0 ? data.Patients[0] : data.patientAppointments[0]
        let PatientName  = "\(DataPatient.FirstName + " " + DataPatient.LastName)"
        cell.doctorName.text = PatientName == "" ? "N/A" : PatientName
        return cell
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        tableView.deselectRowAtIndexPath(indexPath, animated: false)
        let detailsViewController :AppointmentDetailsViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("AppointmentDetailsViewControllerID") as! AppointmentDetailsViewController
        detailsViewController.appointmentListResponseDetail = appointmentList.rows[indexPath.row]
        self.navigationController?.pushViewController(detailsViewController, animated: true)
    }
    
    
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        
        print(self.loadingData,indexPath.row,appointmentList.rows.count,sumPage)
        if !self.loadingData && indexPath.row == appointmentList.rows.count - 1 && appointmentList.rows.count + 1 <= Int(sumPage) {
            self.loadingData = true
            let count = String(appointmentList.rows.count)
            refreshPage(Context.getDataDefasults(Define.keyNSDefaults.PatientUID) as! String,Offset: count,refreshPage: false)
            
        }
    }
    
}

