//
//  ContentViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 11/2/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
protocol ContentViewDelegate{
    func changePageImage(controller:ContentViewController,index:Int)
}

class ContentViewController: UIViewController {

    @IBOutlet weak var imageView: UIImageView!
    var pageIndex: Int!
    var titleText: String!
    var imageFile: String!
    var delegate : ContentViewDelegate?

    override func viewDidLoad() {
        super.viewDidLoad()
         self.imageView.image = UIImage(named: self.imageFile)
        
    }
    override func viewWillAppear(animated: Bool) {
        delegate?.changePageImage(self, index: pageIndex)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}
