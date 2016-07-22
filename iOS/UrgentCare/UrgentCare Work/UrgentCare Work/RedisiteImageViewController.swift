//
//  RedisiteImageViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/26/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class RedisiteImageViewController: UIViewController ,UICollectionViewDataSource, UICollectionViewDelegate {
    var picker:UIImagePickerController?=UIImagePickerController()
    var popover:UIPopoverController?=nil
    var assets: [DKAsset] = []
    var templateUID = ""
    var DataPatientInjuryOrGeneral = General()
    var AppointPostCompany = RequestAppointPostCompany()
    var ImageDta = RequestAppointDataCompany()
    var redisiteName = ""
    var CountImage = 0
    
    @IBOutlet weak var CollectionView: UICollectionView!
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    override func viewWillAppear(animated: Bool) {
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
    }
    let sectionInsets = UIEdgeInsets(top: 10.0, left: 10.0, bottom: 10.0, right: 10.0)
    let reuseIdentifier = "collCell"
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.assets.count
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let asset = self.assets[indexPath.row]
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(reuseIdentifier, forIndexPath: indexPath) as! CollectionViewCellImage
        asset.fetchFullScreenImage(true, completeBlock: { image, info in
            cell.pinImage.image  = image
        })
        
        return cell
    }
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        print("You selected cell #\(indexPath.item)!")
    }
    func collectionView(collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAtIndexPath indexPath: NSIndexPath) -> CGSize {
        return CGSize(width: 150, height: 150)
    }
    
    func collectionView(collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                               insetForSectionAtIndex section: Int) -> UIEdgeInsets {
        return sectionInsets
    }
}
extension RedisiteImageViewController : UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate {
    
    @IBAction func selectImageUpload(sender: AnyObject) {
        guard let button = sender.valueForKey("view") else {
            return
        }
        let alert:UIAlertController=UIAlertController(title: "Choose Image", message: nil, preferredStyle: UIAlertControllerStyle.ActionSheet)
        
        let cameraAction = UIAlertAction(title: "Camera", style: UIAlertActionStyle.Default)
        {
            UIAlertAction in
            self.openCamera()
            
        }
        let galleryAction = UIAlertAction(title: "Gallery", style: UIAlertActionStyle.Default)
        {
            UIAlertAction in
            self.openGallery()
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel)
        {
            UIAlertAction in
            
        }
        
        picker?.delegate = self
        alert.addAction(cameraAction)
        alert.addAction(galleryAction)
        alert.addAction(cancelAction)
        if let presenter = alert.popoverPresentationController {
            presenter.sourceView = button as? UIView
            presenter.sourceRect = button.bounds
        }
        
        self.presentViewController(alert, animated: true) {}
    }
    
    func openCamera()
    {
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Camera
        let allowsLandscape = false
        let singleSelect = true
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
    }
    
    func openGallery()
    {
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Photo
        let allowsLandscape = false
        let singleSelect = false
        
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
    }
    @IBAction func ActionContinue(sender: AnyObject) {
        let consentView :ConsentViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ConsentViewControllerID") as! ConsentViewController
        consentView.DataPatientInjuryOrGeneral = DataPatientInjuryOrGeneral
        consentView.templateUID = templateUID
        consentView.assets = assets
        consentView.redisiteName = redisiteName
        self.presentViewController(consentView, animated: true, completion: nil)
    }
    
    func AppendAppointData(name:String,value:String)-> AppointmentData{
        let appointmentData = AppointmentData()
        appointmentData.Name = name
        appointmentData.Value = value
        return appointmentData
    }
    @IBAction func ActionBack(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {})
    }
    func showImagePickerWithAssetType(
        assetType: DKImagePickerControllerAssetType,
        allowMultipleType: Bool,
        sourceType: DKImagePickerControllerSourceType = .Both,
        allowsLandscape: Bool,
        singleSelect: Bool) {
        
        let pickerController = DKImagePickerController()
        pickerController.assetType = assetType
        pickerController.allowsLandscape = allowsLandscape
        pickerController.allowMultipleTypes = allowMultipleType
        pickerController.sourceType = sourceType
        pickerController.singleSelect = singleSelect
        pickerController.defaultSelectedAssets = self.assets
        pickerController.didSelectAssets = { [unowned self] (assets: [DKAsset]) in
            self.assets = assets
            self.CollectionView.reloadData()
        }
        
        if UI_USER_INTERFACE_IDIOM() == .Pad {
            pickerController.modalPresentationStyle = .FormSheet
        }
        self.presentViewController(pickerController, animated: true) {}
    }
}

