//
//  PresentComplain.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/17/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class PresentComplain: UIViewController {
    
    @IBOutlet var textViewCollect: [UITextView]!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        var teleAppointment = SingleTon.detailAppointMentObj["TelehealthAppointment"]
        
        for textView in textViewCollect {
            textView.text = teleAppointment[textView.text].stringValue
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
