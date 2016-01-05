//
//  MedicalImage.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/17/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class MedicalImage: UIViewController, UICollectionViewDelegateFlowLayout, UICollectionViewDataSource {
    
    @IBOutlet var collectionView: UICollectionView!
    var totalFileUpload: Int = 0
    var arrUID = [String!]()
    let loading: DTIActivityIndicatorView = DTIActivityIndicatorView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if SingleTon.imgDataMedical.count == 0 {
            download_image()
            self.self.loading.frame = CGRectMake((self.view.frame.width/2) - 60, (self.view.frame.height/2) - 60, 80, 80)
            self.loading.indicatorColor = UIColor.cyanColor()
            self.loading.indicatorStyle = DTIIndicatorStyle.convInv(.doubleBounce)
        }
        
        self.collectionView.registerNib(UINib(nibName: "MedicalImageCVC", bundle: nil), forCellWithReuseIdentifier: "cellCollect")
        self.collectionView.backgroundColor = UIColor.clearColor()
    }
    
    override func viewDidAppear(animated: Bool) {
        self.view.frame = CGRectMake(0, 0, 744, 709)
    }
    
    func download_image() {
        if let clinicCal: JSON = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"], fileUpload: JSON = SingleTon.detailAppointMentObj["FileUploads"] {
            if fileUpload.count > 0 || clinicCal.count > 0 {
                for var i = 0; i < fileUpload.count; i++ {
                    if fileUpload.count > 0 {
                        if fileUpload[i]["FileType"].isEmpty && fileUpload[i]["FileType"].stringValue.lowercaseString == "medicalimage" {
                            arrUID.append(fileUpload[i]["UID"].stringValue)
                        }
                    }
                }
                for var i = 0; i < clinicCal.count; ++i {
                    if let fileUpload: JSON = clinicCal[i]["FileUploads"] {
                        if fileUpload.count > 0 {
                            for var i = 0; i < fileUpload.count; ++i {
                                if fileUpload[i]["FileType"].isEmpty && fileUpload[i]["FileType"].stringValue.lowercaseString == "medicalimage" {
                                    arrUID.append(fileUpload[i]["UID"].stringValue)
                                }
                            }
                        }
                    }
                }
            }
        }
        getImageFromUID(arrUID)
    }
    
    func getImageFromUID(parUID: [String!]) {
        print(parUID.count)
        guard parUID.count != 0 else {
            return
        }
        self.view.addSubview(self.loading)
        self.loading.startActivity()
        for var i = 0;  i < parUID.count; i++ {
            let url = NSURL(string: "\(DOWNLOAD_IMAGE)\(parUID[i])")
            request(.GET, url!, headers: SingleTon.headers)
                .validate(statusCode: 200..<300)
                .responseJSONReToken() { response in
                    guard response.2.value == nil else {
                        print("error download file: ", response)
                        return
                    }
                    
                    if let data: NSData? = response.2.data {
                        if data != nil {
                            SingleTon.imgDataMedical.append(data!)
                            if parUID.count == SingleTon.imgDataMedical.count {
                                self.collectionView.reloadData()
                                self.loading.stopActivity(true)
                            }
                        }
                    }
            }
        }
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell: MedicalImageCVC = collectionView.dequeueReusableCellWithReuseIdentifier("cellCollect", forIndexPath: indexPath) as! MedicalImageCVC
        if let imgSrc: NSData = SingleTon.imgDataMedical[indexPath.row] {
            cell.mediImage.image = UIImage(data: imgSrc)
        }
        return cell
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return SingleTon.imgDataMedical.count
    }
    
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        let detailImgVC = DetailImageVC(nibName: "DetailImageVC", bundle: nil)
        detailImgVC.indexSelect = indexPath.row
        detailImgVC.modalPresentationStyle  = UIModalPresentationStyle.FormSheet
        self.presentViewController(detailImgVC, animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
}
