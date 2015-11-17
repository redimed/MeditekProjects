//
//  HomeViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class HomeViewController: UIViewController,UIPopoverPresentationControllerDelegate,MyPopupViewControllerDelegate,UIPageViewControllerDataSource,ContentViewDelegate{
    @IBOutlet weak var pageControl: UIPageControl!
    @IBOutlet weak var pageView: UIView!
    var uid = String()
    var pageViewController: UIPageViewController!
    var pageTitles: NSArray!
    var pageImages: NSArray!
     weak var timer: NSTimer?
    var page = 0
       override func viewDidLoad() {
        super.viewDidLoad()
        //Get uuid user in locacalstorage
        if let uuid = defaults.valueForKey("uid") as? String {
            uid = uuid
        }
        if let token = defaults.valueForKey("token") as? String {
            tokens = token
            print("home token----",tokens)
            
        }
        if let coreToken = defaults.valueForKey("coreToken") as? String {
            coreTokens = coreToken
        }
        if let userUIDs = defaults.valueForKey("userUID") as? String{
            userUID = userUIDs
        }
        if let cookie = defaults.valueForKey("Set-Cookie") as? String{
            cookies = cookie
        }
        
        //Connect Socket
        openSocket()
        pagingImage()
        resetTimer()
    }
    
    func resetTimer() {
        timer?.invalidate()
        let nextTimer = NSTimer.scheduledTimerWithTimeInterval(5.0, target: self, selector: "handleIdleEventAutoSlide:", userInfo: nil, repeats: true)
        timer = nextTimer
    }
    
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
        self.pageTitles = NSArray(objects: "Explore", "Today Widget")
        self.pageImages = NSArray(objects: "Untitled-1_03", "Untitled-1_05")
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
            UIApplication.sharedApplication().openURL(NSURL(string: "tel://0892300900")!)
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    //MARK: MyPopupViewControllerProtocol
    func pressOK(sender: MyPopupViewController) {
        self.dismissPopupViewController(.Fade)
        emitDataToServer(MessageString.CallAnswer, uidFrom: uid, uuidTo: savedData.data[0]["from"].string!)
        let homeMain = self.storyboard?.instantiateViewControllerWithIdentifier("ScreenCallingStoryboard") as! ScreenCallingViewController
        self.presentViewController(homeMain, animated: true, completion: nil)
        
    }
    func pressCancel(sender: MyPopupViewController) {
        emitDataToServer(MessageString.Decline, uidFrom: uid, uuidTo: savedData.data[0]["from"].string!)
        self.dismissPopupViewController(.Fade)
    }
    
    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
    }
    
    func openSocket() {
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            sharedSocket.socket.onAny {
                //                print("got event: \($0.event) with items \($0.items)")
                let a = $0.event
                let b = $0.items
            }
            // Socket Events
            sharedSocket.socket.on("connect") {data, ack in
                print("socket connected")
                print("\(self.uid)")
                let modifieldURLString = NSString(format: UrlAPISocket.joinRoom, self.uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                sharedSocket.socket.emit("get", dictionNary)
            }
            
            sharedSocket.socket.on("receiveMessage"){data, ack in
                print("calling to me")
                let dataCalling = JSON(data)
                
                let message : String = data[0]["message"] as! String
                print("message:",message)
                if message == MessageString.Call {
                    //save data to temp class
                    savedData = saveData(data: dataCalling)
                    self.displayViewController(.TopBottom)
                    NSNotificationCenter.defaultCenter().postNotificationName("AnswerCall", object: self)
                }else if message == MessageString.CallEndCall {
                    NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
                }else if message == MessageString.Cancel {
                    NSNotificationCenter.defaultCenter().postNotificationName("cancelCall", object: self)
                }
            }
            sharedSocket.socket.on("refreshToken") {data, ack in
                
                let dataCalling = JSON(data)
                
                if let newToken = dataCalling[0]["token"].string {
                    let defaults = NSUserDefaults.standardUserDefaults()
                        defaults.setValue(newToken, forKey: "token")
                        defaults.synchronize()
                        tokens = newToken
                }
                
               
            }
        })
        //Socket connecting
        sharedSocket.socket.connect()
        
    }
    //undwid home
    @IBAction func unwindToHome(segue:UIStoryboardSegue) {
        //check back controller to unwind
        if(segue.sourceViewController .isKindOfClass(AppointmentDetailsViewController))
        {
            
        }
        
    }

    @IBAction func callUsButton(sender: AnyObject) {
        UIApplication.sharedApplication().openURL(NSURL(string: "tel://\(phoneNumberCallUs)")!)
    }
    

}


