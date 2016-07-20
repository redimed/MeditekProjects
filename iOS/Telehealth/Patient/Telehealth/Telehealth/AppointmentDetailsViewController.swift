//
//  AppointmentDetailsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class AppointmentDetailsViewController: UIViewController, UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate ,NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate,reloadCollectionDelegate{
    let appointmentService = AppointmentService()
    let patientService = PatientService()
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var selectOptionImage: UIButton!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var Code: UILabel!
    
    @IBOutlet weak var fullNameLabel: UILabel!
    @IBOutlet weak var mobileLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    
    
    
    
    @IBOutlet weak var messageImageLabel: UILabel!
    var UIDApointment = String()
    var imageDetails : UIImage!
    var picker:UIImagePickerController?=UIImagePickerController()
    var popover:UIPopoverController?=nil
    var appointmentDetails: AppointmentContainer!
    var ArrayImageUID : [UIImage] = []
    
    let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        picker?.delegate = self
       
        setDataInit()
        getDetailsAppointment(appointmentDetails.UIDApointment, Type: appointmentDetails.Type)
        
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func setDataInit(){
        dateLabel.text = appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDate)
        //Check To time
        if appointmentDetails.ToTime == "" {
            timeLabel.text = "\(appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime))"
            
        }else{
            timeLabel.text = "\(appointmentDetails.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime)) - \(appointmentDetails.ToTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime))"
        }
        doctorName.text = appointmentDetails.NameDoctor
        status.text = appointmentDetails.Status
        Code.text = appointmentDetails.Code
        print(appointmentDetails)
        
     
       
        
        
        
        
    }
    
    //get details appointment
    func getDetailsAppointment(UIDAppointment:String,Type:String){
        appointmentService.getAppointmentDetails(UIDAppointment, Type: Type,compailer: {
            response in
            print("----appointment---",response)
            if response["message"] == "success"{
                self.getAllImageInAppointmentDetails(response["data"])
                let infoAppointment = self.appointmentService.getInformationAppointment(response["data"])
                
                
                self.fullNameLabel.text = infoAppointment.FirstName + " " + infoAppointment.LastName
                self.mobileLabel.text = infoAppointment.PhoneNumber
                self.homePhoneLabel.text = infoAppointment.HomePhoneNumber
                self.suburbLabel.text = infoAppointment.Suburb
                self.emailLabel.text = infoAppointment.Email
                self.dobLabel.text = infoAppointment.DOB

                
            }else {
                print("Error---",response["ErrorType"])
            }
        })
        
    }
  
    //Get all image in appointment details
    func getAllImageInAppointmentDetails(AppointmentDetails:JSON){
        appointmentService.getAllImageInAppointmentDetails(AppointmentDetails,compailer: {
            arrImage in
            let countImage = arrImage.count
            if countImage == 0{
                self.messageImageLabel.hidden = false
            }
            for i in 0  ..< countImage  {
                let imageUID = arrImage[i]
                self.downloadImage(imageUID)
            }
            
        })
    }
    
    //Giap: Download image
    func downloadImage(imageUID:String){
        
        patientService.getImage(imageUID, completionHandler: { response in
            let image = response
            self.ArrayImageUID.append(image)
            self.insertDataToCollectionView()
        })
    }
    
    
    //send data view to view
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "ImageDetailSegue" {
            //get index path selected image in collection view
            if let indexPath = sender as? NSIndexPath {
                let destVC = segue.destinationViewController as! ImageDetailViewController
                destVC.imageDetail = ArrayImageUID[indexPath.row]
                
            }
        } else if segue.identifier == "BodyUploadSegue" {
            let body = segue.destinationViewController as! BodyUploadViewController
            body.imageSelect = imageDetails
            body.appointmentID = appointmentDetails.UIDApointment
            body.delegate = self
        } else if segue.identifier == "TrackingSegue" {
            let Tracking = segue.destinationViewController as! TrackingRefferalViewController
            Tracking.appointmentDetails = appointmentDetails
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
        if(UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.Camera))
        {
            picker!.sourceType = UIImagePickerControllerSourceType.Camera
            self.presentViewController(picker!, animated: true, completion: nil)
        }
        else
        {
            openGallery()
        }
    }
    
    func openGallery()
    {
        picker!.sourceType = UIImagePickerControllerSourceType.PhotoLibrary
        self.presentViewController(picker!, animated: true, completion: nil)
        
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
            alertView.alertMessage("Saved!", message:MessageString.savedPictureMessage)

        }
        //change to view BodyUpload
        performSegueWithIdentifier("BodyUploadSegue", sender: self)
    }
    func imagePickerControllerDidCancel(picker: UIImagePickerController)
    {
        print("picker cancel.")
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    
    //Add new item to collection view
    func reloadCollectionView(controller: BodyUploadViewController, sender: UIImage) {
        
        ArrayImageUID.append(sender)
        insertDataToCollectionView()
        alertView.alertMessage("Upload", message: "Upload Success")
        if ArrayImageUID.count != 0{
            messageImageLabel.hidden = true
        }
        
    }
    //add an image to collection view
    func insertDataToCollectionView(){
        let newRowIndex = ArrayImageUID.count
        let indexPath = NSIndexPath(forRow: newRowIndex - 1 , inSection: 0)
        collectionView.insertItemsAtIndexPaths([indexPath])
    }
    
    
    
}

extension AppointmentDetailsViewController : UICollectionViewDataSource, UICollectionViewDelegate {
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
    }
    
    
    //animation collection view cell scrolling
    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.5, animations: {
            cell.alpha = 1
        })
    }
    
}
