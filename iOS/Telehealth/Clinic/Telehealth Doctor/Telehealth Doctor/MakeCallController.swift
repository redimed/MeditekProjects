//
//  MakeCallViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import UIView_draggable
import ReachabilitySwift
import Alamofire
import SwiftyJSON

let videoWidth : CGFloat = 200
let videoHeight : CGFloat = 120

// Replace with your OpenTok API key
let ApiKey = SingleTon.infoOpentok["apiKey"].stringValue
// Replace with your generated session ID
let SessionID = SingleTon.infoOpentok["sessionId"].stringValue
// Replace with your generated token
let Token = SingleTon.infoOpentok["token"].stringValue

// Change to YES to subscribe to your own stream.
let SubscribeToSelf = false

class MakeCallViewController: UIViewController, OTSessionDelegate, OTSubscriberKitDelegate, OTPublisherDelegate {
    
    var session : OTSession?
    var publisher : OTPublisher?
    var subscriber : OTSubscriber?
    var idOnlineUser : Int!
    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("teleUserInfo") as! NSDictionary
    let screenSize: CGRect = UIScreen.mainScreen().bounds
    var avAudioPlayer : AVAudioPlayer?
    var soundFileURL = NSURL(fileURLWithPath: NSBundle.mainBundle().pathForResource("ringtone", ofType: "wav")!)
    var loading: DTIActivityIndicatorView!
    var customUI: CustomViewController = CustomViewController()
    var isClickEnd = false
    var isAnswer = false
    var screenCapture: UIView!
    var screenCaptureForPublisher: UIView!
    var timer: NSTimer?
    
    /// declare uiview for off mic screen
    var offMicView: UIView! = UIView(frame: CGRectMake(0, 0, videoWidth, videoHeight))
    var imageOffMic: UIImage!
    var imgViewOffMic: UIImageView!
    
    /// declare uiimage for off camera
    var imgViewOffCamera: UIImageView!
    
    @IBOutlet var controllerButtonCall: [UIButton]!
    @IBOutlet weak var nameLabelCall: UILabel!
    @IBOutlet weak var titleLabelCall: UILabel!
    @IBOutlet var imageNoCameraSubscriber: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loading = DTIActivityIndicatorView(frame: CGRect(x:screenSize.size.width/2 - 30, y:screenSize.size.height/2, width:90.0, height:90.0))
        self.view.addSubview(self.loading)
        loading.indicatorColor = UIColor(hex: "34AADC")
        loading.indicatorStyle = DTIIndicatorStyle.convInv(.doubleBounce)
        loading.startActivity()
        
        navigationController?.setNavigationBarHidden(true, animated: true)
        nameLabelCall.text = SingleTon.onlineUser_Singleton[idOnlineUser].fullNamePatient
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "handleCallNotification", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "handleCall:", name: "handleCallNotification", object: nil)
        session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
        doConnect(Token)
        
        /**
        custom ui for off "MICRO" when publisher click
        */
        imageOffMic = UIImage(named: "off-mic.png")
        imgViewOffMic = UIImageView(image: imageOffMic)
        imgViewOffMic.frame = offMicView.bounds
        offMicView.addSubview(imgViewOffMic)
        
        /**
        custom ui for off "CAMERA" when publisher click
        */
        imgViewOffCamera = UIImageView(frame: CGRectMake((videoWidth / 2) - 16, (videoHeight / 2) - 16 , 32, 32))
        imgViewOffCamera.image = UIImage(named: "no-camera-100")
        
        /**
        set to userDefault for when user terminate application
        */
        NSUserDefaults.standardUserDefaults().setValue(SingleTon.onlineUser_Singleton[idOnlineUser].TeleUID, forKey: "currentUserCall")
    }
    
    //    play sound when calling to patient
    func playSoundCall() {
        do {
            try avAudioPlayer = AVAudioPlayer(contentsOfURL: soundFileURL)
            avAudioPlayer?.prepareToPlay()
            avAudioPlayer?.play()
            avAudioPlayer?.volume = 1.0
            avAudioPlayer?.numberOfLoops = -1
        } catch {
            print("Error set audio player contents of URL")
        }
    }
    
    /**
     main func handle call from patient
     */
    func handleCall(notification: NSNotification) {
        if notification.name == "handleCallNotification" {
            let userInfo : Dictionary<String, String!> = notification.userInfo as! Dictionary<String,String!>
            let message : String! = userInfo["message"]
            switch message {
            case "answer":
                timer?.invalidate()
                timer = nil
                isAnswer = true
                receiveAnswerEvent()
                break
            case "decline":
                timer?.invalidate()
                timer = nil
                receiveDeclineEvent()
                break
            case "end":
                endCall()
                break
            default:
                break
            }
        }
    }
    
    /**
     function controller for call
     */
    func receiveAnswerEvent() {
        avAudioPlayer?.stop()
        avAudioPlayer?.currentTime = 0
        titleLabelCall.text = "Connecting..."
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.enabled = false
            }
        }
    }
    
    func receiveDeclineEvent() {
        avAudioPlayer?.stop()
        avAudioPlayer?.currentTime = 0
        titleLabelCall.text = "Unavailable with"
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = true
            } else {
                button.hidden = false
            }
        }
    }
    
    func timeOutOffCall() {
        avAudioPlayer?.stop()
        avAudioPlayer?.currentTime = 0
        titleLabelCall.text = "Unavailable with"
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = true
            } else {
                button.hidden = false
            }
        }
        sendMessEnd()
    }
    
    func tryAgainCall() {
        playSoundCall()
        titleLabelCall.text = "Calling to..."
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = false
            } else {
                button.hidden = true
            }
        }
        
        SingleTon.socket.emit("get", ["url": NSString(format: MAKE_CALL, userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].TeleUID, "call", SessionID, JSON(NSUserDefaults.standardUserDefaults().valueForKey("userInfo")!)["UserName"].stringValue)])
        
        timer = NSTimer.scheduledTimerWithTimeInterval(30, target: self, selector: "timeOutOffCall", userInfo: nil, repeats: false)
    }
    
    func lostConnection() {
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: screenSize.width, height: screenSize.height)
        titleLabelCall.hidden = false
        titleLabelCall.text = "Lost Connection with..."
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = true
            } else {
                button.hidden = false
            }
        }
    }
    
    /**
     spend for end call and back view controller
     */
    func endCall() {
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "handleCall", object: nil)
        NSUserDefaults.standardUserDefaults().removeObjectForKey("currentUserCall")
        sessionDidDisconnect(session!)
        session?.disconnect()
        doUnsubscribe()
        self.navigationController?.popViewControllerAnimated(true)
    }
    
    /**
     function for action controller button call
     */
    @IBAction func actionControllerButton(sender: UIButton) {
        
        switch sender.tag {
        case 0: // mic
            publisher!.publishAudio = !publisher!.publishAudio
            if(publisher!.publishAudio) {
                sender.backgroundColor = UIColor(hex: "CCCC")
                sender.tintColor = UIColor.whiteColor()
                if subscriber != nil {
                    offMicView.removeFromSuperview()
                }
            } else {
                if subscriber != nil {
                    publisher!.view.addSubview(offMicView)
                }
                sender.backgroundColor = UIColor(hex: "8E8E93")
                sender.tintColor = UIColor.grayColor()
            }
            break
        case 1: // ---end call---
            
            let maybeErr:AutoreleasingUnsafeMutablePointer<OTError?> = nil
            
            if ((avAudioPlayer?.playing) != nil) {
                
                avAudioPlayer?.stop()
                avAudioPlayer?.currentTime = 0
                
            }
            
            isClickEnd = true
            if isAnswer {
                session?.signalWithType("endCall", string: "end", connection: nil, error:maybeErr)
                if (maybeErr != nil) {
                    print("signal error \(maybeErr)")
                }
            } else {
                sendMessEnd()
            }
            
            endCall()
        case 2: // camera call
            publisher!.publishVideo = !publisher!.publishVideo
            if(publisher!.publishVideo) {
                sender.backgroundColor = UIColor(hex: "CCCC")
                sender.tintColor = UIColor.whiteColor()
                if subscriber != nil {
                    imgViewOffCamera.removeFromSuperview()
                    screenCaptureForPublisher.removeFromSuperview()
                }
            } else {
                if subscriber != nil {
                    screenCaptureForPublisher = publisher!.view.snapshotViewAfterScreenUpdates(true)
                    customUI.BlurLayer(screenCaptureForPublisher)
                    publisher!.view.addSubview(screenCaptureForPublisher)
                    publisher!.view.addSubview(imgViewOffCamera)
                }
                sender.backgroundColor = UIColor(hex: "8E8E93")
                sender.tintColor = UIColor.grayColor()
            }
        case 3: // try again call
            tryAgainCall()
            break
        case 4: // ---cancel call view---
            self.navigationController!.popViewControllerAnimated(true)
            break
        default:
            break
        }
    }
    
    func sendMessEnd() {
        SingleTon.socket.emit("get", ["url": NSString(format: "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@", userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].TeleUID, "cancel")])
        
        let param = ["data":["message": "end"], "title": "Message end call", "uid": SingleTon.onlineUser_Singleton[idOnlineUser].TeleUID, "sound": "abc"]
        request(.POST, PUSH_ACTION, headers: SingleTon.headers, parameters: param as? [String : AnyObject])
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSONReToken { response -> Void in
                print(response)
        }
    }
    
    /**
     Logical call function
     */
    func doConnect(tokenParam: String) {
        if let session = self.session {
            var maybeError : OTError?
            session.connectWithToken(tokenParam, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
        }
    }
    /**
     * Sets up an instance of OTPublisher to use with this session. OTPubilsher
     * binds to the device camera and microphone, and will provide A/V streams
     * to the OpenTok session.
     */
    func doPublish() {
        publisher = OTPublisher(delegate: self)
        
        var maybeError : OTError?
        session?.publish(publisher, error: &maybeError)
        
        if let error = maybeError {
            showAlert(error.localizedDescription)
        }
        
        view.addSubview(publisher!.view)
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: screenSize.width, height: screenSize.height)
        
        /**
        button controller call to publisherview
        */
        for button: UIButton in controllerButtonCall {
            publisher!.view.addSubview(button)
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = false
            }
        }
        
        /**
        label for publisher view
        */
        nameLabelCall.hidden = false
        titleLabelCall.hidden = false
        publisher!.view.addSubview(titleLabelCall)
        publisher!.view.addSubview(nameLabelCall)
        loading.stopActivity(true)
        
        /// Emit call patient
        SingleTon.socket.emit("get", ["url": NSString(format: MAKE_CALL, userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].TeleUID, "call", SessionID, JSON(NSUserDefaults.standardUserDefaults().valueForKey("userInfo")!)["UserName"].stringValue)])
    }
    
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }
    
    func gradientStatus(currentView: UIView) {
        let viewCustom: UIView = UIView(frame: CGRectMake(0, 0, screenSize.size.width, 35))
        let layer = CAGradientLayer()
        layer.frame = viewCustom.bounds
        let opaqueBlackColor = UIColor(red: 0, green: 0, blue: 0, alpha: 1.0).CGColor
        let transparentBlackColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0).CGColor
        layer.colors = [opaqueBlackColor, transparentBlackColor]
        viewCustom.layer.addSublayer(layer)
        currentView.layer.addSublayer(layer)
    }
    
    /**
     * Instantiates a subscriber for the given stream and asynchronously begins the
     * process to begin receiving A/V content for this stream. Unlike doPublish,
     * this method does not add the subscriber to the view hierarchy. Instead, we
     * add the subscriber only after it has connected and begins receiving data.
     */
    func doSubscribe(stream : OTStream) {
        if let session = self.session {
            subscriber = OTSubscriber(stream: stream, delegate: self)
            var maybeError : OTError?
            session.subscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
        }
    }
    
    /**
     * Cleans the subscriber from the view hierarchy, if any.
     */
    func doUnsubscribe() {
        if let subscriber = self.subscriber {
            var maybeError : OTError?
            session?.unsubscribe(subscriber, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
            }
            
            subscriber.view.removeFromSuperview()
            self.subscriber = nil
        }
    }
    
    // MARK: - OTSession delegate callbacks
    
    func sessionDidConnect(session: OTSession) {
        NSLog("sessionDidConnect (\(session.sessionId))")
        
        // Step 2: We have successfully connected, now instantiate a publisher and
        // begin pushing A/V streams into OpenTok.
        doPublish()
    }
    
    func sessionDidDisconnect(session : OTSession) {
        NSLog("Session disconnected (\( session.sessionId))")
    }
    
    func session(session: OTSession, streamCreated stream: OTStream) {
        NSLog("session streamCreated (\(stream.streamId))")
        
        titleLabelCall.hidden = true
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.enabled = true
            }
        }
        
        // Step 3a: (if NO == subscribeToSelf): Begin subscribing to a stream we
        // have seen on the OpenTok session.
        if subscriber == nil && !SubscribeToSelf {
            doSubscribe(stream)
        }
    }
    
    func session(session: OTSession, streamDestroyed stream: OTStream) {
        NSLog("session streamDestroyed then streamCreated (\(stream.streamId))")
        
        if subscriber?.stream.streamId == stream.streamId {
            endCall()
        }
    }
    
    func session(session: OTSession, connectionCreated connection : OTConnection) {
        NSLog("session connectionCreated (\(connection.connectionId))")
    }
    
    func session(session: OTSession, connectionDestroyed connection : OTConnection) {
        NSLog("session connectionDestroyed (\(connection.connectionId))")
        endCall()
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
        let alert = UIAlertView(title: "Error", message: error.localizedDescription, delegate: nil, cancelButtonTitle: "OK")
        alert.show()
        self.navigationController!.popViewControllerAnimated(true)
        loading.stopActivity(true)
    }
    
    func session(session: OTSession!, receivedSignalType type: String!, fromConnection connection: OTConnection!, withString string: String!) {
        print("receivedSignalType \(type.lowercaseString) - withString \(string.lowercaseString)")
        if let typeReceive = type, let str = string {
            if !typeReceive.isEmpty && !str.isEmpty {
                if typeReceive.lowercaseString == "endcall" && str.lowercaseString == "end" {
                    endCall()
                }
            }
        }
    }
    
    // MARK: - OTSubscriber delegate callbacks
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        gradientStatus(subscriber!.view)
        publisher!.view.frame = CGRect(x: (UIScreen.mainScreen().bounds.size.width - videoWidth) - 10, y: 40, width: videoWidth, height: videoHeight)
        if let view = subscriber?.view {
            view.frame =  CGRect(x: 0.0, y: 0, width: screenSize.size.width, height: screenSize.size.height)
            self.view.addSubview(view)
            self.view.addSubview(publisher!.view)
            for button: UIButton in controllerButtonCall {
                self.view.addSubview(button)
            }
            self.publisher!.view.enableDragging()
            nameLabelCall.frame = CGRectMake(353, 55, 319, 316)
        }
        
        if ((avAudioPlayer?.playing) != nil) {
            
            avAudioPlayer?.stop()
            avAudioPlayer?.currentTime = 0
            
        }
    }
    
    func subscriber(subscriber: OTSubscriberKit, didFailWithError error : OTError) {
        NSLog("subscriber %@ didFailWithError %@", subscriber.stream.streamId, error)
    }
    
    
    
    func subscriberVideoDisabled(subscriberKit: OTSubscriberKit!, reason: OTSubscriberVideoEventReason) {
        print("subscriber video Disabled")
        imageNoCameraSubscriber.hidden = false
        screenCapture = subscriber!.view.snapshotViewAfterScreenUpdates(true)
        customUI.BlurLayer(screenCapture)
        subscriber!.view.addSubview(screenCapture)
        subscriber!.view.addSubview(imageNoCameraSubscriber)
        
    }
    
    func subscriberVideoEnabled(subscriberKit: OTSubscriberKit!, reason: OTSubscriberVideoEventReason) {
        print("subscriber video Enabled.")
        imageNoCameraSubscriber.hidden = true
        screenCapture.removeFromSuperview()
    }
    
    // MARK: - OTPublisher delegate callbacks
    
    func publisher(publisher: OTPublisherKit, streamCreated stream: OTStream) {
        NSLog("publisher streamCreated %@", stream)
        playSoundCall()
        
        timer = NSTimer.scheduledTimerWithTimeInterval(30, target: self, selector: "timeOutOffCall", userInfo: nil, repeats: false)
        // Step 3b: (if YES == subscribeToSelf): Our own publisher is now visible to
        // all participants in the OpenTok session. We will attempt to subscribe to
        // our own stream. Expect to see a slight delay in the subscriber video and
        // an echo of the audio coming from the device microphone.
        if subscriber == nil && SubscribeToSelf {
            doSubscribe(stream)
        }
    }
    
    func publisher(publisher: OTPublisherKit, streamDestroyed stream: OTStream) {
        NSLog("publisher streamDestroyed %@", stream)
        
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func publisher(publisher: OTPublisherKit, didFailWithError error: OTError) {
        NSLog("publisher didFailWithError %@", error)
    }
    
    // MARK: - Helpers
    
    func showAlert(message: String) {
        // show alertview on main UI
        dispatch_async(dispatch_get_main_queue()) {
            _ = UIAlertView(title: "OTError", message: message, delegate: nil, cancelButtonTitle: "OK")
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
