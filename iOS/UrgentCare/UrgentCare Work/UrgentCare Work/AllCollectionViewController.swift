//
//  AllCollectionViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/2/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

let reuseIdentifier = "collCell"

class AllCollectionViewController: UICollectionViewController, UICollectionViewDelegateFlowLayout {
    var Allsize = CGSize()
    var titles = []
    var listID : Array<Int>! = []
    var type  = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        self.automaticallyAdjustsScrollViewInsets = false
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1
    }
//    override func shouldAutorotate() -> Bool {
//        return false
//    }
    
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return titles.count
    }
    
    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(reuseIdentifier, forIndexPath: indexPath) as! CollectionViewCell
        cell.txtName.text = titles[indexPath.row] as? String
        cell.txtName.backgroundColor = UIColor.whiteColor()
        cell.txtName.textColor = UIColor(hex: Define.ColorCustom.greenBoderColor)
        for i in 0 ..< listID.count {
            if(listID[i] == indexPath.row){
                cell.txtName.textColor = UIColor.whiteColor()
                cell.txtName.backgroundColor = UIColor(hex: Define.ColorCustom.greenColor)
            }
        }
        return cell
    }
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAtIndexPath indexPath: NSIndexPath) -> CGSize {
        
        let originalString: String = titles[indexPath.row] as! String
        let myString: NSString = originalString as NSString
        let size: CGSize = myString.sizeWithAttributes([NSFontAttributeName: UIFont.systemFontOfSize(17.0)])
        Allsize.width = Allsize.width + size.width + 5
        print(Allsize.width)
        if(type == "DescrubeInjury"){
            return CGSize(width: 120, height: collectionView.frame.size.height)
        }else if(type == "InjurySymtomsSegue"){
            if(size.width < 120){
                return CGSize(width: size.width + 5, height: collectionView.frame.size.height)
            }else{
                return CGSize(width: size.width + 5, height: collectionView.frame.size.height)
            }
            
        }else{
            return CGSize(width: size.width + 5, height: collectionView.frame.size.height)
        }
        
    }
    
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAtIndex section: Int) -> UIEdgeInsets {
        return UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    }
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAtIndex section: Int) -> CGFloat {
        return 0.0
    }
    
    func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAtIndex section: Int) -> CGFloat {
        return 0.0
    }
    override func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        var checkExits = 0
        for i in 0 ..< listID.count {
            if(i < listID.count){
                if(listID[i] == indexPath.row){
                    listID.removeAtIndex(i)
                    checkExits += 1
                }
            }
        }
        if(checkExits == 0){
            listID.append(indexPath.row)
        }
        collectionView.reloadData()
    }
}