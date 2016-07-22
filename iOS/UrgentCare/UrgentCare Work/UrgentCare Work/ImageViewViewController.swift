//
//  ImageViewViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/22/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class ImageViewViewController: UIViewController {

    @IBOutlet weak var viewCotentImage: UIImageView!
    var uiimage : UIImage!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.modalPresentationStyle = UIModalPresentationStyle.CurrentContext
        viewCotentImage.image = uiimage
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
    }

}
