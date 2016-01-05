//
//  TrackingRefferalViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
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
    var appointmentDetails: AppointmentList!
    override func viewDidLoad() {
        super.viewDidLoad()
        checkStatus()
       
    }
    override func viewWillAppear(animated: Bool) {
        if appointmentDetails.Status == statusAppointment.Approved {
            designableView.hidden = false
            doctorLabel.text = appointmentDetails.NameDoctor
            dateLabel.text = appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDate)
            timeLabel.text = appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime)
        }
    }
    
    
    //check status appointment and change animate
    func checkStatus(){
        switch appointmentDetails.Status {
        case statusAppointment.Approved:
            boxShadowButton(AppTimeButton,colorStatusAppointment.colorReceived)
            break
        case statusAppointment.Attended:
            boxShadowButton(AttendedButton,colorStatusAppointment.colorReceived)
            break
        case statusAppointment.Finished:
            boxShadowButton(FinishButton,colorStatusAppointment.colorReceived)
            break
        case statusAppointment.Pending:
            boxShadowButton(ApptPendingButton,colorStatusAppointment.colorReceived)
            break
        case statusAppointment.Received:
            boxShadowButton(ReceiveButton,colorStatusAppointment.colorReceived)
            break
        case statusAppointment.Waitlist:
            boxShadowButton(WaitListButton,colorStatusAppointment.colorReceived)
            break
        default:
            break
        }
    }
    
    //Animate
    func boxShadowButton(button:UIButton,_ color:UIColor){
        button.layer.shadowOpacity = 8
        button.layer.shadowColor  = UIColor.whiteColor().CGColor
        button.layer.shadowOffset = CGSizeMake(0, 0)
        button.layer.shadowRadius = 6
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "appointmentDetailsSegue"{
            let appointmentDetail = segue.destinationViewController as! AppointmentDetailsViewController
            appointmentDetail.appointmentDetails = appointmentDetails
        }
    }


}
