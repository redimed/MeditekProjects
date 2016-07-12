//
//  TrackingRefferalViewController.swift
//  Telehealth
//
//  Created by Meditek on 5/26/16.
//   Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class TrackingRefferalViewController: UIViewController {
    @IBOutlet weak var ReceiveButton: UIButton!
    @IBOutlet weak var ApptPendingButton: UIButton!
    @IBOutlet weak var AppTimeButton: UIButton!
    @IBOutlet weak var AttendedButton: UIButton!
    @IBOutlet weak var WaitListButton: UIButton!
    @IBOutlet weak var FinishButton: UIButton!
    
    @IBOutlet weak var designableView: DesignableView!
    @IBOutlet weak var doctorLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    var appointmentDetails = AppointmentListResponseDetail()
    override func viewDidLoad() {
        super.viewDidLoad()
        checkStatus()
       
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBar.hidden = true
        print(appointmentDetails.Status)
        if appointmentDetails.Status == Define.statusAppointment.Approved {
            setDataToView()
        }
    }
    
    func setDataToView(){
        designableView.hidden = false
        doctorLabel.text = appointmentDetails.DoctorsName
        dateLabel.text = appointmentDetails.FromTime.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatDate)
        timeLabel.text = appointmentDetails.FromTime.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime)
    }
    
    func checkStatus(){
        switch appointmentDetails.Status {
        case Define.statusAppointment.Approved:
            boxShadowButton(AppTimeButton,Define.colorStatusAppointment.colorReceived)
            break
        case Define.statusAppointment.Attended:
            boxShadowButton(AttendedButton,Define.colorStatusAppointment.colorReceived)
            break
        case Define.statusAppointment.Finished:
            boxShadowButton(FinishButton,Define.colorStatusAppointment.colorReceived)
            break
        case Define.statusAppointment.Pending:
            boxShadowButton(ApptPendingButton,Define.colorStatusAppointment.colorReceived)
            break
        case Define.statusAppointment.Received:
            boxShadowButton(ReceiveButton,Define.colorStatusAppointment.colorReceived)
            break
        case Define.statusAppointment.Waitlist:
            boxShadowButton(WaitListButton,Define.colorStatusAppointment.colorReceived)
            break
        default:
            break
        }
    }
    
    func boxShadowButton(button:UIButton,_ color:UIColor){
        button.layer.shadowOpacity = 8
        button.layer.shadowColor  = UIColor.whiteColor().CGColor
        button.layer.shadowOffset = CGSizeMake(0, 0)
        button.layer.shadowRadius = 6
    }
    @IBAction func backAction(sender: AnyObject) {
         self.dismissViewControllerAnimated(true, completion: {})
    }
}
