//
//  HomeViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SocketIOClientSwift
import SwiftyJSON
import AVFoundation

class HomeViewController: UIViewController,UIPopoverPresentationControllerDelegate,MyPopupViewControllerDelegate,UIPageViewControllerDataSource,ContentViewDelegate,AVAudioPlayerDelegate,SocketDelegate {
    let api = TokenAPI()
    let socketService = SocketService()
    let callService = CallService()
    let requestTelehealthService = RequestTelehealthService()
    let patientService = PatientService()
    
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var pageControl: UIPageControl!
    @IBOutlet weak var pageView: UIView!
    @IBOutlet weak var labelHealthCare: UILabel!
    @IBOutlet weak var serviceNotLogin: UIView!
    @IBOutlet weak var requestTelehealNotLogin: UIView!
    @IBOutlet weak var otherServiceLogin: UIView!
    @IBOutlet weak var requestTelehealthLogin: UIView!
    @IBOutlet weak var trackingReferral: UIView!
    @IBOutlet weak var settingView: UIView!
    weak var timer: NSTimer?
    
    var pageViewController: UIPageViewController!
    var pageTitles: NSArray!
    var pageImages: NSArray!
    var page = 0
    
    var backMusic: AVAudioPlayer!
    var uid = String()
    
    var typeTelehelth = [String]()
    var patientInformation : PatientContainer!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        labelHealthCare.attributedText = config.setLabelAttribute(MessageString.StringHealthCare)
        typeTelehelth = requestTelehealthService.loadDataJson()
        
        //Connect Socket
        socketService.delegate = self
        
        if let uuid = defaults.valueForKey("uid") as? String {
            uid = uuid
            self.socketService.openSocket(uuid,complete: {
                complete in
                if complete == "socket connected" {
                    
                }
            })
            
        }
        
        pagingImage()
        resetTimer()
    }
    func ShowLoading(){
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.removeObjectForKey("loading")
        defaults.setValue("1", forKey: "loading")
        defaults.synchronize()
        showloading("Connecting to server..")
    }
    func HideLoading() {
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.removeObjectForKey("loading")
        defaults.setValue("0", forKey: "loading")
        defaults.synchronize()
        hideLoading()
    }
    override func viewWillAppear(animated: Bool) {
        if let _ = defaults.valueForKey("uid") as? String {
            getInformationPatient()
        }
        checkLogin()
        
    }
    
    func checkLogin(){
        if let uuid = defaults.valueForKey("uid") as? String {
            uid = uuid
            if let deviceToken = defaults.valueForKey("deviceToken") as? String{
                api.updateTokenPush(uid,deviceToken:deviceToken)
            }
            loginButton.hidden = true
            serviceNotLogin.hidden = true
            requestTelehealNotLogin.hidden = true
            otherServiceLogin.hidden = false
            requestTelehealthLogin.hidden = false
            trackingReferral.hidden = false
            settingView.hidden = false
        }else {
            loginButton.hidden = false
            serviceNotLogin.hidden = false
            requestTelehealNotLogin.hidden = false
            otherServiceLogin.hidden = true
            requestTelehealthLogin.hidden = true
            trackingReferral.hidden = true
            settingView.hidden = true
        }
        
    }
    
    
    func receiveMessage(controller: SocketService, message: String, data: AnyObject) {
        switch message {
        case MessageString.Call :
            callService.setDataCalling(data)
            self.openPopUpCalling()
        case  MessageString.CallEndCall:
            NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
            break
        case MessageString.Cancel:
            NSNotificationCenter.defaultCenter().postNotificationName("cancelCall", object: self)
            NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
            break
        case  MessageString.Decline:
            self.dismissPopupViewController(.Fade)
            self.backMusic.stop()
            break
        case MessageString.CallAnswer:
            self.dismissPopupViewController(.Fade)
            self.backMusic.stop()
            break
        default :
            break
        }
    }
    
    
    //Play ringtone while have calling
    func playRingtone() {
        backMusic = setupAudioPlayerWithFile("ringtone", type: "wav")
        backMusic?.delegate = self
        backMusic.numberOfLoops = -1
        backMusic.prepareToPlay()
        backMusic.play()
        
    }
    
    //handle music
    func setupAudioPlayerWithFile(file:NSString, type:NSString) -> AVAudioPlayer  {
        let path = NSBundle.mainBundle().pathForResource(file as String, ofType: type as String)
        let url = NSURL.fileURLWithPath(path!)
        var audioPlayer:AVAudioPlayer?
        
        do {
            try audioPlayer = AVAudioPlayer(contentsOfURL: url)
        } catch {
            print("NO AUDIO PLAYER")
        }
        
        return audioPlayer!
    }
    //setup timer slide
    func resetTimer() {
        timer?.invalidate()
        let nextTimer = NSTimer.scheduledTimerWithTimeInterval(5.0, target: self, selector: "handleIdleEventAutoSlide:", userInfo: nil, repeats: true)
        timer = nextTimer
    }
    // handle slide image
    func handleIdleEventAutoSlide(timer: NSTimer) {
        let numberofPage = pageImages.count
        if page + 1 == numberofPage  {
            page = 0
            autoSlide(page)
        }else {
            if page == numberofPage {
                page = 0
                autoSlide(page + 1)
                page++
            }else{
                autoSlide(page + 1)
                page++
            }
        }
    }
    
    //page Controller
    func pagingImage(){
        self.pageTitles = NSArray(objects: "Explore", "Today Widget","Home3")
        self.pageImages = NSArray(objects: "Home1", "Home2","Home3")
        pageControl.numberOfPages = pageImages.count
        self.pageViewController = self.storyboard?.instantiateViewControllerWithIdentifier("PageViewController") as! UIPageViewController
        self.pageViewController.dataSource = self
        
        let startVC = self.viewControllerAtIndex(0) as ContentViewController
        let viewControllers = NSArray(object: startVC)
        
        self.pageViewController.setViewControllers(viewControllers as? [UIViewController], direction: .Forward, animated: true, completion: nil)
        
        self.pageViewController.view.frame = CGRectMake(0, 0, self.view.frame.width, self.view.frame.size.height)
        
        self.addChildViewController(self.pageViewController)
        self.pageView.addSubview(self.pageViewController.view)
        self.pageViewController.didMoveToParentViewController(self)
    }
    //changeView
    func autoSlide(index:Int){
        let startVC = self.viewControllerAtIndex(index) as ContentViewController
        let viewControllers = NSArray(object: startVC)
        
        self.pageViewController.setViewControllers(viewControllers as? [UIViewController], direction: .Forward, animated: true, completion: nil)
        
    }
    
    func viewControllerAtIndex(index: Int) -> ContentViewController
    {
        if ((self.pageTitles.count == 0) || (index >= self.pageTitles.count)) {
            return ContentViewController()
        }
        
        let vc: ContentViewController = self.storyboard?.instantiateViewControllerWithIdentifier("ContentViewController") as! ContentViewController
        vc.imageFile = self.pageImages[index] as! String
        vc.titleText = self.pageTitles[index] as! String
        vc.pageIndex = index
        vc.delegate = self
        return vc
        
        
    }
    
    // MARK: - Page View Controller Data Source
    
    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController?
    {
        
        let vc = viewController as! ContentViewController
        var index = vc.pageIndex as Int
        if (index == 0 || index == NSNotFound)
        {
            return nil
        }
        index--
        return self.viewControllerAtIndex(index)
        
    }
    
    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        let vc = viewController as! ContentViewController
        var index = vc.pageIndex as Int
        if (index == NSNotFound)
        {
            return nil
        }
        index++
        if (index == self.pageTitles.count)
        {
            return nil
        }
        return self.viewControllerAtIndex(index)
    }
    
    func presentationCountForPageViewController(pageViewController: UIPageViewController) -> Int
    {
        return self.pageTitles.count
    }
    
    func presentationIndexForPageViewController(pageViewController: UIPageViewController) -> Int
    {
        return 0
    }
    //change currentPage in PageControl
    func changePageImage(controller: ContentViewController, index: Int) {
        pageControl.currentPage = index
        page = index
        
    }
    //Giap: Change view AnswerCall by StoryboardID
    func AnswerCall(){
        backMusic.stop()
        self.displayViewController(.TopBottom)
    }
    
    //display popup call
    func displayViewController(animationType: SLpopupViewAnimationType) {
        let myPopupViewController:MyPopupViewController = MyPopupViewController(nibName:"MyPopupViewController", bundle: nil)
        myPopupViewController.delegate = self
        self.presentpopupViewController(myPopupViewController, animationType: animationType, completion: { () -> Void in
            
        })
    }
    
    @IBAction func ContactUsAction(sender: AnyObject) {
        callAlertMessage("", message: MessageString.QuestionCallPhone)
    }
    
    //Giap: Show alert message
    func callAlertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
            // ...
        }
        alertController.addAction(cancelAction)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            UIApplication.sharedApplication().openURL(NSURL(string: MessageString.phoneNumberCallUs)!)
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    //MARK: MyPopupViewControllerProtocol
    func pressOK(sender: MyPopupViewController) {
        backMusic.stop()
        self.dismissPopupViewController(.Fade)
        openScreenCall()
        
    }
    
    func pressCancel(sender: MyPopupViewController) {
        backMusic.stop()
        if let from  = savedData.from {
            socketService.emitDataToServer(MessageString.Decline, uidFrom: uid, uuidTo: from)
        }
        self.dismissPopupViewController(.Fade)
        savedData = CallContainer()
    }
    
    //open screen calling
    func openScreenCall(){
        let homeMain = self.storyboard?.instantiateViewControllerWithIdentifier("ScreenCallingStoryboard") as! ScreenCallingViewController
        self.presentViewController(homeMain, animated: true, completion: nil)
    }
    
    func openPopUpCalling(){
        self.displayViewController(.TopBottom)
        self.playRingtone()
    }
    
    //undwid home
    @IBAction func unwindToHome(segue:UIStoryboardSegue) {
        //check back controller to unwind
        if(segue.sourceViewController .isKindOfClass(AppointmentDetailsViewController))
        {
            
        }
        
    }
    //Call us
    @IBAction func callUsButton(sender: AnyObject) {
        UIApplication.sharedApplication().openURL(NSURL(string: MessageString.phoneNumberCallUs)!)
    }
    
    @IBAction func requestTelehealthAction(sender: AnyObject) {
        performSegueWithIdentifier("RequestTelehealthSegue", sender: self)
    }
    
    @IBAction func loginAction(sender: AnyObject) {
        performSegueWithIdentifier("LoginSegue", sender: self)
    }
    
    //get information patient
    func getInformationPatient(){
        if let uuid = defaults.valueForKey("uid") as? String {
            patientService.getInformationPatientByUUID(uuid){
                message , data in
                if message["message"] == "success" {
                    self.view.hideLoading()
                    self.patientInformation = data!
                    
                }else {
                    print(message)
                }
            }
        }
    }
    
    //    override func loading(){
    //        let alert = UIAlertController(title: nil, message: "Please wait...", preferredStyle: .Alert)
    //
    //        alert.view.tintColor = UIColor.blackColor()
    //        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(10, 5, 50, 50)) as UIActivityIndicatorView
    //        loadingIndicator.hidesWhenStopped = true
    //        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
    //        loadingIndicator.startAnimating();
    //
    //        alert.view.addSubview(loadingIndicator)
    //        presentViewController(alert, animated: true, completion: nil)
    //
    //    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "FAQsegue" {
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "FAQs"
        }else if segue.identifier == "Aboutsegue"{
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "ABOUT US"
        }else if segue.identifier == "RequestTelehealthSegue" {
            let RQ  = segue.destinationViewController as! RequestTelehealthViewController
            RQ.autocompleteUrls = typeTelehelth
            RQ.patientInformation = patientInformation
        }else if segue.identifier == "OtherServiceSegue"{
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "Other Services"
        }
    }
    
    
    
}


