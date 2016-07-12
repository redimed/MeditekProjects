//
//  CustomTableViewCell.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class CustomTableViewCell: UITableViewCell {

    @IBOutlet weak var lbProfile: UILabel!
    @IBOutlet weak var lbName: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
