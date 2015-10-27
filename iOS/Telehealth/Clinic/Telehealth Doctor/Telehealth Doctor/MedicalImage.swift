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
    var dataImage: [NSData] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.collectionView.registerNib(UINib(nibName: "MedicalImageCVC", bundle: nil), forCellWithReuseIdentifier: "cellCollect")
        self.collectionView.backgroundColor = UIColor.clearColor()
    }
    
    override func viewDidAppear(animated: Bool) {
        self.view.frame = CGRectMake(0, 0, 744, 709)
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
