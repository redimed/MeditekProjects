//
//  AppointmentDetailsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire

class AppointmentDetailsViewController: UIViewController,UICollectionViewDataSource, UICollectionViewDelegate, UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate ,NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate,reloadCollectionDelegate{
    let api = GetAndPostDataController()
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var selectOptionImage: UIButton!
    @IBOutlet weak var scrollView: UIScrollView!
    
    var UIDApointment = String()
    var imageDetails : UIImage!
    var picker:UIImagePickerController?=UIImagePickerController()
    var popover:UIPopoverController?=nil
    var appointmentDetails: AppointmentList!
    
    var ArrayImageUID : [UIImage] = []
    override func viewDidLoad() {
        super.viewDidLoad()
        picker?.delegate = self
        dateLabel.text = appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDate)
                                //Check To time
        if appointmentDetails.ToTime == "" {
            timeLabel.text = "\(appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime))"

        }else{
            timeLabel.text = "\(appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime)) - \(appointmentDetails.ToTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime))"
        }
        doctorName.text = appointmentDetails.NameDoctor
        status.text = appointmentDetails.Status
        
        print("-------",appointmentDetails.Type)
        self.getListImage(appointmentDetails.UIDApointment,appointmentDetails.Type)
    
       
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    
    //Giap:Get list Image with Appointment
    func getListImage(UIDAppointment:String,_ Type:String){
        self.api.getAppointmentDetails(UIDAppointment,type:Type, completionHandler: {
            response in
            print(response)
            if response["message"] == "error"{
//                self.alertMessage("Error", message: ErrorMessage.NoData)
            }else {
                let countImage = response.count
                
                for var i = 0 ; i < countImage ; i++ {
                    let imageUID : String = response[i]["UID"].string ?? ""
                    let FileType  = response[i]["FileType"].string ?? ""
                    if FileType == "MedicalImage"{
                        self.downloadImage(imageUID)
                    }
                }
            }
        })
    }
    //Giap: Download image
    func downloadImage(imageUID:String){
        api.getImageAppointment(imageUID, completionHandler: { response in
            let image = UIImage(data: response)
            if image == nil {
                print(image)
            }else {
                self.ArrayImageUID.append(image!)
               self.insertDataToCollectionView()
            }
        })
    }
    
    //Giap: Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    
    
    //Giap: Collection View
    func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return ArrayImageUID.count
    }
    
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("AppointmentCollectionCell", forIndexPath: indexPath) as! AppointmentImageCollectionViewCell
        let data = ArrayImageUID[indexPath.row]
        cell.imageView.image = data
        cell.imageView.layer.shadowRadius = 4
        cell.imageView.layer.shadowOpacity = 0.5
        cell.imageView.layer.shadowOffset = CGSize.zero
        return cell
    }
    //select 1 item in collection view
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        
        performSegueWithIdentifier("ImageDetailSegue", sender: indexPath)
        //        var cell = collectionView.cellForItemAtIndexPath(indexPath)
        
        
        
    }
    
    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.5, animations: {
            cell.alpha = 1
        })
    }
    
    //send data view to view
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "ImageDetailSegue" {
            if let indexPath = sender as? NSIndexPath {
                let destVC = segue.destinationViewController as! ImageDetailViewController
                destVC.imageDetail = ArrayImageUID[indexPath.row]
                
            }
        } else if segue.identifier == "BodyUploadSegue" {
            let body = segue.destinationViewController as! BodyUploadViewController
            body.imageSelect = imageDetails
            body.appointmentID = appointmentDetails.UIDApointment
            body.delegate = self
        }
    }
    
    
    //Select image or capture imge
    @IBAction func SelectImageUpload(sender: AnyObject) {
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
        
        // Add the actions
        picker?.delegate = self
        alert.addAction(cameraAction)
        alert.addAction(galleryAction)
        alert.addAction(cancelAction)
        // Present the controller
        if UIDevice.currentDevice().userInterfaceIdiom == .Phone
        {
            self.presentViewController(alert, animated: true, completion: nil)
        }
        else
        {
            popover=UIPopoverController(contentViewController: alert)
            popover!.presentPopoverFromRect(selectOptionImage.frame, inView: self.view, permittedArrowDirections: UIPopoverArrowDirection.Any, animated: true)
        }
        
    }
    
    func openCamera()
    {
        if(UIImagePickerController .isSourceTypeAvailable(UIImagePickerControllerSourceType.Camera))
        {
            picker!.sourceType = UIImagePickerControllerSourceType.Camera
            self .presentViewController(picker!, animated: true, completion: nil)
        }
        else
        {
            openGallery()
        }
    }
    
    func openGallery()
    {
        picker!.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
        if UIDevice.currentDevice().userInterfaceIdiom == .Phone
        {
            self.presentViewController(picker!, animated: true, completion: nil)
        }
        else
        {
            popover=UIPopoverController(contentViewController: picker!)
            popover!.presentPopoverFromRect(selectOptionImage.frame, inView: self.view, permittedArrowDirections: UIPopoverArrowDirection.Any, animated: true)
        }
    }
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : AnyObject])
    {
        picker .dismissViewControllerAnimated(true, completion: nil)
        imageDetails = info[UIImagePickerControllerOriginalImage] as? UIImage
        //Check capture and save image to Gallery
        if(picker.sourceType == UIImagePickerControllerSourceType.Camera)
        {
            // Access the uncropped image from info dictionary
            let imageToSave: UIImage = info[UIImagePickerControllerOriginalImage] as! UIImage //same but with different way
            UIImageWriteToSavedPhotosAlbum(imageToSave, nil, nil, nil)
            savedImageAlert("Saved!", message: "Your picture was saved to Camera Roll")
            self.dismissViewControllerAnimated(true, completion: nil)
        }
        //change to view BodyUpload
        performSegueWithIdentifier("BodyUploadSegue", sender: self)
    }
    func imagePickerControllerDidCancel(picker: UIImagePickerController)
    {
        print("picker cancel.")
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    func savedImageAlert(title:String,message:String)
    {
        let alert:UIAlertView = UIAlertView()
        alert.title = title
        alert.message = message
        alert.delegate = self
        alert.addButtonWithTitle("Ok")
        alert.show()
    }
    //Add new item to collection view
    func reloadCollectionView(controller: BodyUploadViewController, sender: UIImage) {
        
        ArrayImageUID.append(sender)
        insertDataToCollectionView()
        savedImageAlert("Upload", message: "Upload Success")
        
    }
    
    func insertDataToCollectionView(){
        let newRowIndex = ArrayImageUID.count
        let indexPath = NSIndexPath(forRow: newRowIndex - 1 , inSection: 0)
        collectionView.insertItemsAtIndexPaths([indexPath])
    }
    
    
}
