//
//  MonthYearPickerView.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/11/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class MonthYearPickerView: UIPickerView, UIPickerViewDelegate, UIPickerViewDataSource {
    
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var years: [Int]!
    var yearCurrent : Int = 0
    var monthCurrent : Int = 0
    var month: Int = 0 {
        didSet {
            selectRow(month-1, inComponent: 2, animated: false)
        }
    }
    
    var year: Int = 0 {
        didSet {
            selectRow(years.indexOf(year)!, inComponent: 3, animated: true)
        }
    }
    
    var onDateSelected: ((month: Int, year: Int) -> Void)?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.commonSetup()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.commonSetup()
    }
    
    func commonSetup() {
        var years: [Int] = []
        var year = 1900
        if years.count == 0 {
            for _ in 1...1099 {
                years.append(year)
                year += 1
            }
        }
        self.years = years
        self.delegate = self
        self.dataSource = self
        yearCurrent = NSCalendar(identifier: NSCalendarIdentifierGregorian)!.component(.Year, fromDate: NSDate())
        monthCurrent = NSCalendar(identifier: NSCalendarIdentifierGregorian)!.component(.Month, fromDate: NSDate())
        SetCurrentDate(monthCurrent,year: yearCurrent)
    }
    func SetCurrentDate(month:Int,year:Int){
        if let m : Int = month - 1 {
            if(m <= months.count && m >= 0){
                self.selectRow(m, inComponent: 2, animated: false)
                self.month = month
            }
        }
        if let y : Int = year - 1900 {
            if(y <= years.count && y >= 0){
                self.selectRow(y, inComponent: 3, animated: false)
                self.year = year
            }
        }
    }
    
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 6
    }
    
    func pickerView(pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        switch component {
        case 2:
            return months[row]
        case 3:
            return "\(years[row])"
        default:
            return nil
        }
    }
    
    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        switch component {
        case 2:
            return months.count
        case 3:
            return years.count
        default:
            return 0
        }
    }
    
    func pickerView(pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        let month = self.selectedRowInComponent(2)+1
        let year = years[self.selectedRowInComponent(3)]
        if let block = onDateSelected {
            block(month: month, year: year)
        }
        self.month = month
        self.year = year
    }
    func done()->String{
        yearCurrent = year
        monthCurrent = month
        SetCurrentDate(monthCurrent,year: yearCurrent)
        return  String(format: "%02d/%d", month, year)
    }
    func cancel(){
        SetCurrentDate(monthCurrent,year: yearCurrent)
    }
}
