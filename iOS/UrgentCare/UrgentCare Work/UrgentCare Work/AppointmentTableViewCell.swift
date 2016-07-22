//
//  AppointmentTableViewCell.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/19/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class AppointmentTableViewCell: UITableViewCell {

    @IBOutlet weak var Code: UILabel!
    @IBOutlet weak var RequestDate: UILabel!
    @IBOutlet weak var PatientName: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
