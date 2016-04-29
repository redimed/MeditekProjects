//
//  ContentViewController.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
protocol ContentViewDelegate{
    func changePageImage(controller:ContentViewController,index:Int)
}
class ContentViewController: UIViewController {
    var pageIndex: Int!
    var titleText: String!
    var imageFile: String!
    var delegate : ContentViewDelegate?
    @IBOutlet weak var imageView: UIImageView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let image = UIImage(named: self.imageFile) {
             self.imageView.image = image
        }
        
        // Do any additional setup after loading the view.
    }
    override func viewWillAppear(animated: Bool) {
        delegate?.changePageImage(self, index: pageIndex)
    }
    

}
