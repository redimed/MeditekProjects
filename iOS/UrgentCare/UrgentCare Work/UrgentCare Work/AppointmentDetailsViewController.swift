//
//  AppointmentDetailsViewController.swift
//  Telehealth
//
//  Created by Meditek on 5/26/16.
//   Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

class AppointmentDetailsViewController: BaseViewController,UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate ,NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate,reloadCollectionDelegate {
    
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
    var appointmentListResponseDetail = AppointmentListResponseDetail()
    var ArrayImageUID : [UIImage] = []
    
    // let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //picker?.delegate = self
        setDataInit()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
        self.navigationItem.title = "Appointment"
        self.ArrayImageUID.removeAll()
        self.collectionView.reloadData()
        getDetailsAppointment(appointmentListResponseDetail.UID)
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    func getDetailsAppointment(AppointmentUID:String){
        UserService.getDetailAppointment(AppointmentUID) { [weak self] (response) in
            print(response.result.value!["data"])
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        print(JSON(response.result.value!))
                        if let detailAppointment = Mapper<DetailAppointment>().map(response.result.value!["data"]) {
                            print(detailAppointment.PatientAppointments)
                           
                            self!.getAllImageInAppointmentDetails(detailAppointment.fileUploads)
                            let Patients = detailAppointment.Patients.count != 0 ? detailAppointment.Patients[0] : detailAppointment.PatientAppointments[0]
                            self!.fullNameLabel.text = Patients.FirstName + " " + Patients.LastName
                            self!.mobileLabel.text = Patients.PhoneNumber
                            self!.homePhoneLabel.text = Patients.HomePhoneNumber
                            self!.suburbLabel.text = Patients.Suburb
                            self!.emailLabel.text = Patients.Email1
                            self!.dobLabel.text = Patients.DOB
                            self!.UIDApointment = detailAppointment.UID
                            self!.doctorName.text = detailAppointment.Doctors.count != 0 ? "\(detailAppointment.Doctors[0].FirstName + " " + detailAppointment.Doctors[0].LastName)" : ""
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
            }
        }
    }
    func setDataInit(){
        dateLabel.text = appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatDate)
        //Check To time
        if appointmentListResponseDetail.ToTime == "" {
            timeLabel.text = "\(appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime))"
            
        }else{
            timeLabel.text = "\(appointmentListResponseDetail.CreatedDate.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime)) - \(appointmentListResponseDetail.ToTime.toDateTimeZone(Define.formatTime.dateTimeZone, format: Define.formatTime.formatTime))"
        }
        doctorName.text = appointmentListResponseDetail.DoctorsName
        status.text = appointmentListResponseDetail.Status
        Code.text = appointmentListResponseDetail.Code
        print(appointmentListResponseDetail)
        
    }
    @IBAction func actionTracking(sender: AnyObject) {
        let detailsViewController :TrackingRefferalViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("TrackingRefferalViewControllerID") as! TrackingRefferalViewController
        detailsViewController.appointmentDetails = appointmentListResponseDetail
        self.presentViewController(detailsViewController, animated: true, completion: {})
    }
    
    //Get all image in appointment details
    func getAllImageInAppointmentDetails(fileUploads:[FileUploads]){
        
        for i in 0  ..< fileUploads.count  {
            self.downloadImage(fileUploads[i].UID)
        }
    }
    
    // Download image
    func downloadImage(imageUID:String){
        UserService.getImage(imageUID) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if  let images = UIImage(data: response.result.value!) {
                        self!.ArrayImageUID.append(images)
                        self!.insertDataToCollectionView()
                    }
                } else {
                   // self?.showMessageNoNetwork()
                }
            }
            
        }
}

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
    if(picker.sourceType == UIImagePickerControllerSourceType.Camera)
    {
        let imageToSave: UIImage = info[UIImagePickerControllerOriginalImage] as! UIImage
        UIImageWriteToSavedPhotosAlbum(imageToSave, nil, nil, nil)
        
    }
    let bodyUploadViewController :BodyUploadViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("BodyUploadViewControllerID") as! BodyUploadViewController
    bodyUploadViewController.imageSelect = imageDetails
    bodyUploadViewController.appointmentID = appointmentListResponseDetail.UID
    self.navigationController?.pushViewController(bodyUploadViewController, animated: true)
}

func imagePickerControllerDidCancel(picker: UIImagePickerController)
{
    print("picker cancel.")
    self.dismissViewControllerAnimated(true, completion: nil)
}

func reloadCollectionView(controller: BodyUploadViewController, sender: UIImage) {
    
    ArrayImageUID.append(sender)
    insertDataToCollectionView()
    alertView.alertMessage("Upload", message: "Upload Success")
    if ArrayImageUID.count != 0{
        messageImageLabel.hidden = true
    }
    
}
func insertDataToCollectionView(){
    let newRowIndex = ArrayImageUID.count
    let indexPath = NSIndexPath(forRow: newRowIndex - 1 , inSection: 0)
    collectionView.insertItemsAtIndexPaths([indexPath])
}

    @IBAction func RedisiteForm(sender: AnyObject) {
        let patientInfor :PatientInforViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("PatientInforViewControllerID") as! PatientInforViewController
        patientInfor.AppointmentUID = UIDApointment
        self.navigationController?.pushViewController(patientInfor, animated: true)
    }


}

extension AppointmentDetailsViewController : UICollectionViewDataSource, UICollectionViewDelegate {
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
        //performSegueWithIdentifier("ImageDetailSegue", sender: indexPath)
    }
    
    
    //animation collection view cell scrolling
    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.5, animations: {
            cell.alpha = 1
        })
    }
    
}
