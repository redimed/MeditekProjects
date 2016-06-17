//
//  ReasonTableViewCell.swift
//  VGODriverApp
//
//  Created by Meditek on 4/5/16.
//  Copyright © 2016 Vu Dinh Trung. All rights reserved.
//

import UIKit

class CustomPatientCell: UITableViewCell {

    @IBOutlet weak var btCheck: UIButton!
    @IBOutlet weak var lbInformation: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }

}
