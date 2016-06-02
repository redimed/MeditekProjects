//
//  AppointmentTableViewCell.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/19/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class AppointmentTableViewCell: UITableViewCell {

    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var appointmentDate: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
