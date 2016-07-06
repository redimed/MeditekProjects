//
//  ConsentViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import SwiftyJSON
class ConsentViewController: BaseViewController     {
    @IBOutlet weak var checkBoxIConfirm: UIButton!
    @IBOutlet weak var checkBoxAgree: UIButton!
    @IBOutlet weak var checkBoxIfClaim: UIButton!
    @IBOutlet weak var checkBoxAuthorise: UIButton!
    @IBOutlet weak var SignatureImage: SignatureUIView!
    @IBOutlet weak var SaveSignature: UIButton!
    
    var checkAuthorise = false
    var checkIfClaim = false
    var checkAgree = false
    var checkIConfirm = false
    var DataSubmit = General()
    var DataPatientInjuryOrGeneral = General()
    var AppointPostCompany = RequestAppointPostCompany()
    var AppointPost = RequestAppointPostCompany()
    var uploadImage = UploadImage()
    var templateUID = ""
    var assets: [DKAsset] = []
    var ImageDta = RequestAppointDataCompany()
    
    @IBOutlet weak var txtSupervisorName: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        txtSupervisorName.textFiledOnlyLine(txtSupervisorName)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillDisappear (animated: Bool) {
        super.viewWillDisappear(animated)
        
    }
    override func shouldAutorotate() -> Bool {
        return true
    }
    func canRotate() -> Void {
        
    }
    func UploadImageError()
    {
        let alert = UIAlertView()
        alert.title = "Warning"
        alert.message = "Upload Image Fail"
        alert.addButtonWithTitle("OK")
        alert.show()
    }
    override func viewWillAppear(animated: Bool) {
        self.AppointPostCompany = requestAppointPostCompany
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
    }
    @IBAction func ActionBack(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {})
    }
    @IBAction func AcctionCheckAuthorise(sender: AnyObject) {
        ClickCheckBox(&checkAuthorise, CheckBox: checkBoxAuthorise)
    }
    @IBAction func ActionCheckIfYour(sender: AnyObject) {
        ClickCheckBox(&checkIfClaim, CheckBox: checkBoxIfClaim)
    }
    @IBAction func ActionCheckAgree(sender: AnyObject) {
        ClickCheckBox(&checkAgree, CheckBox: checkBoxAgree)
    }
    @IBAction func ActionCheckConfirm(sender: AnyObject) {
        ClickCheckBox(&checkIConfirm, CheckBox: checkBoxIConfirm)
    }
    func ClickCheckBox(inout checked:Bool, CheckBox:UIButton){
        if(checked != true){
            checked = true
            CheckBox.setImage(UIImage(named: Define.imageName.CheckedBox), forState: UIControlState.Normal)
        }else{
            checked = false
            CheckBox.setImage(UIImage(named: Define.imageName.UnCheckedGreen), forState: UIControlState.Normal)
        }
    }
    @IBAction func SaveImageSignatrure(sender: AnyObject) {
        self.view.endEditing(true)
        if(!SignatureImage.CheckDrawImageNil()){
            self.showloading(Define.MessageString.PleaseWait)
            let image : UIImage = SignatureImage.SaveImage()
            let upload:UploadImage = UploadImage()
            upload.userUID = Context.getDataDefasults(Define.keyNSDefaults.UserUID) as! String
            upload.fileType = "Signature"
            UserService.uploadImage(image, uploadImage: upload) { [weak self] (response) in
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            print(response.result.value!)
                            if let uploadImage = Mapper<UploadImage>().map(response.result.value) {
                                print(uploadImage.status)
                                if(uploadImage.status == "success"){
                                    self!.SaveSignature.enabled = false
                                    self!.hideLoading()
                                    self!.uploadImage = uploadImage
                                    self!.AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData.append(self!.AppendAppointData("PatientSignatureID",value:"\(uploadImage.fileInfo.ID)"));
                                    self!.AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData.append(self!.AppendAppointData("PatientSignatureUID",value:uploadImage.fileUID));
                                }else{
                                    self!.hideLoading()
                                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                    dispatch_after(time, dispatch_get_main_queue(), {
                                        self!.AlertShow("Error", message: "Upload signature fail")
                                    })
                                    
                                }
                                
                            }
                        }
                    } else {
                        self!.hideLoading()
                        let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                        dispatch_after(time, dispatch_get_main_queue(), {
                            self!.AlertShow("Error", message: "Upload signature fail")
                        })
                        
                    }
                }
            }
            
        }else{
            self.alertView.alertMessage("Waring", message: "Plesae sign signature before click save")
        }
    }
    func AlertShow(title:String,message:String){
        let alert = UIAlertController(title: title, message:message, preferredStyle: .Alert)
        alert.addAction(UIAlertAction(title: "OK", style: .Default) { _ in })
        self.presentViewController(alert, animated: true){}
    }
    func AppendAppointData(name:String,value:String)-> AppointmentData{
        let appointmentData = AppointmentData()
        appointmentData.Name = name
        appointmentData.Value = value
        return appointmentData
    }
    @IBAction func ClearImage(sender: AnyObject) {
        SaveSignature.enabled = true
        SignatureImage.Clear()
        self.uploadImage = UploadImage()
    }
    func GetConsentFormDataGeneral(){
        DataConsent.general.removeAll()
        DataConsent.general.append(Context.EformtData(txtSupervisorName.text!, name: "third_party_name", ref: "field_2_22_3", type: "eform_input_text", checked: "", refRow: "row_2_22"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_discuss", ref: "field_2_20_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_20"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_claim", ref: "field_2_21_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_21"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_third_party", ref: "field_2_22_1", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_22"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_correct", ref: "field_2_23_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_23"))
    }
    func GetConsentFormDataInjury(){
        DataConsent.general.removeAll()
        DataConsent.general.append(Context.EformtData(txtSupervisorName.text!, name: "third_party_name", ref: "field_2_28_2", type: "eform_input_text", checked: "", refRow: "row_2_28"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_discuss", ref: "field_2_26_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_26"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_claim", ref: "field_2_27_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_27"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_third_party", ref: "field_2_28_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_28"))
        DataConsent.general.append(Context.EformtData("yes", name: "is_correct", ref: "field_2_29_0", type: "eform_input_check_checkbox", checked: "true", refRow: "row_2_29"))
    }
    @IBAction func ActionSubmit(sender: AnyObject) {
        if(checkAuthorise && checkIfClaim && checkIConfirm && checkAgree){
            if(uploadImage.fileUID != ""){
                UpLoadAssetImage()
            }else{
                self.alertView.alertMessage("Waring", message: "Please sign signature")
            }
        }else{
            self.alertView.alertMessage("Waring", message: "Please check all checkbox")
        }
        
    }
    func SubmitDataAppointment(AppointmentUID:String){
        let redisiteData : RedisiteData = RedisiteData();
        redisiteData.userUID = Context.getDataDefasults(Define.keyNSDefaults.UserUID) as! String
        redisiteData.appointmentUID = AppointmentUID
        redisiteData.patientUID = Constants.Path.PatientUID
        
        var jsonString = Mapper().toJSONString(DataSubmit, prettyPrint: true)
        print("jsonString",jsonString)
        jsonString = jsonString!.substringWithRange(Range<String.Index>(start: jsonString!.startIndex.advancedBy(16), end: jsonString!.endIndex.advancedBy(-2)))
        redisiteData.tempData = jsonString!
        redisiteData.templateUID = templateUID
        UserService.postEformDetail(redisiteData) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let responseEform = Mapper<ResponseEform>().map(response.result.value) {
                            if responseEform.data.Status == "saved"  {
                                self?.hideLoading()
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    let loginNavi = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("mainNavigation") as! UINavigationController
                                    loginNavi.viewControllers = [loginViewController]
                                    Define.appDelegate.window?.rootViewController = loginNavi
                                    self!.alertView.alertMessage("Success", message: "Request Appointment Success!")
                                })
                            }else{
                                self?.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                    dispatch_after(time, dispatch_get_main_queue(), {
                                        self!.AlertShow("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                    })
                                }
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                    dispatch_after(time, dispatch_get_main_queue(), {
                        self!.AlertShow("Error", message: "Could not connect to the server")
                    })
                }
                
            }
        }
    }
    func postRequestAppointmentCompany(requestAppointPost:RequestAppointPostCompany){
        requestAppointPost.dataCompany.appointmentsCompany[0].fileUploads.removeAll()
        requestAppointPost.dataCompany.appointmentsCompany[0].fileUploads = ImageDta.fileUploads
        UserService.postRequestAppointmentCompany(requestAppointPost) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let requestAppointResponse = Mapper<RequestAppointResponse>().map(response.result.value) {
                           if(requestAppointResponse.status == "success"){
                                self!.SubmitDataAppointment(requestAppointResponse.data[0].appointment.UID)
                            }else{
                                self!.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                    dispatch_after(time, dispatch_get_main_queue(), {
                                        self!.AlertShow("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                    })
                                }
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                    dispatch_after(time, dispatch_get_main_queue(), {
                        self!.AlertShow("Error", message: "Could not connect to the server")
                    })
                }
            }
        }
    }
    
}
extension ConsentViewController {
    
    func UpLoadAssetImage(){
        self.ImageDta.fileUploads.removeAll()
        self.showloading(Define.MessageString.PleaseWait)
        if(assets.count > 0){
            var countCheck = 0
            for i in 0..<assets.count {
                let asset = self.assets[i]
                asset.fetchFullScreenImage(true, completeBlock: { image, info in
                    self.UploadOneImage(image!, sucess: { (UID) in
                        countCheck += 1
                        let fileUpaload = FileUploads()
                        fileUpaload.UID = UID
                        self.ImageDta.fileUploads.append(fileUpaload)
                        print(i,self.assets.count-1)
                        if(self.ImageDta.fileUploads.count == self.assets.count){
                            self.CheckUploadImageSuccess()
                        }
                        }, fail: { (emty) in
                            countCheck += 1
                            if(countCheck == self.assets.count){
                                self.hideLoading()
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self.AlertShow("Error", message: "Upload Image Fail")
                                })
                            }
                    })
                })
            }
        }else{
            self.CheckUploadImageSuccess()
        }
    }
    func CheckUploadImageSuccess(){
        DataSubmit.general.removeAll()
        if(templateUID == "\(Define.Redisite.templateUID_InjuryEFormUID)"){
            GetConsentFormDataInjury()
        }else{
            GetConsentFormDataGeneral()
        }
        DataSubmit.general = DataPatientInjuryOrGeneral.general + DataConsent.general
        AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData.removeAll()
        AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData = requestAppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData
        self.AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData.append(self.AppendAppointData("PatientSignatureID",value:"\(uploadImage.fileInfo.ID)"));
        self.AppointPostCompany.dataCompany.appointmentsCompany[0].appointmentData.append(self.AppendAppointData("PatientSignatureUID",value:uploadImage.fileUID));
        postRequestAppointmentCompany(AppointPostCompany)
    }
    func ErrorWhenUpdateImage(){
        print("UPdate hinh thoi cung deo xong")
    }
    func UploadOneImage(image:UIImage, sucess: ((UID: String)->())? = nil, fail: String -> Void){
        let upload: UploadImage = UploadImage()
        upload.userUID = Context.getDataDefasults(Define.keyNSDefaults.UserUID) as! String
        upload.fileType = "MedicalImage"
        UserService.uploadImage(image, uploadImage: upload) { [weak self] (response) in
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        print(response.result.value!)
                        if let uploadImage = Mapper<UploadImage>().map(response.result.value) {
                            print(uploadImage.status)
                            if(uploadImage.status == "success"){
                                if let callback = sucess {
                                    callback(UID: uploadImage.fileUID)
                                }
                            }else{
                                fail("Upload Image Fail")
                            }
                            
                        }
                    }
                } else {
                    fail("Upload Image Fail")
                }
            }
        }
    }
}

