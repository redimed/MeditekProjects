//
//  AppointmentTableViewCell.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/6/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class AppointmentTableViewCell: UITableViewCell {

    @IBOutlet weak var noRows: UILabel!
    @IBOutlet weak var patientName: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var submitDate: UILabel!
    @IBOutlet weak var appoinmentDate: UILabel!
    @IBOutlet weak var callButton: UIButton!
    @IBOutlet weak var statusImageView: UIImageView!
    @IBOutlet weak var teleAppointment: UIButton!
    @IBOutlet weak var waAppointment: UIButton!
    @IBOutlet weak var statusApt: UILabel!
    
}
