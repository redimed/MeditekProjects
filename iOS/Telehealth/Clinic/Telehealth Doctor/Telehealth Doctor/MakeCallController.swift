//
//  MakeCallViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import UIView_draggable

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
    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
    let screenSize: CGRect = UIScreen.mainScreen().bounds
    var avAudioPlayer : AVAudioPlayer?
    var soundFileURL = NSURL(fileURLWithPath: NSBundle.mainBundle().pathForResource("call", ofType: "wav")!)
    var loading: DTIActivityIndicatorView!
    var isClickEnd = false
    
    @IBOutlet var controllerButtonCall: [UIButton]!
    @IBOutlet weak var nameLabelCall: UILabel!
    @IBOutlet weak var titleLabelCall: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loading = DTIActivityIndicatorView(frame: CGRect(x:screenSize.size.width/2 - 30, y:screenSize.size.height/2, width:90.0, height:90.0))
        self.view.addSubview(self.loading)
        loading.indicatorColor = UIColor(hex: "34AADC")
        loading.indicatorStyle = DTIIndicatorStyle.convInv(.doubleBounce)
        loading.startActivity()
        
        navigationController?.setNavigationBarHidden(true, animated: true)
        nameLabelCall.text = SingleTon.onlineUser_Singleton[idOnlineUser].fullNamePatient
        nameLabelCall.sizeToFit()
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "handleCall", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "handleCall:", name: "handleCallNotification", object: nil)
        session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
        doConnect(Token)
        playSoundCall()
    }
    
    
    func playSoundCall() {
        do {
            try avAudioPlayer = AVAudioPlayer(contentsOfURL: soundFileURL)
            avAudioPlayer?.prepareToPlay()
            avAudioPlayer?.play()
            avAudioPlayer?.numberOfLoops = -5
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
                receiveAnswerEvent()
                break
            case "decline":
                receiveDeclineEvent()
                break
            case "end":
                if isClickEnd != true {
                    endCall()
                }
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
        titleLabelCall.text = "Connecting..."
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.enabled = false
            }
        }
    }
    
    func receiveDeclineEvent() {
        avAudioPlayer?.stop()
        titleLabelCall.text = "Unavailable with"
        for button : UIButton in controllerButtonCall {
            if button.tag >= 0 && button.tag <= 2 {
                button.hidden = true
            } else {
                button.hidden = false
            }
        }
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
        
        SingleTon.socket.emit("get", ["url": NSString(format: MAKE_CALL, userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].UID, "call", SessionID, SingleTon.onlineUser_Singleton[idOnlineUser].fullNameDoctor)])
    }
    
    /**
    spend for end call and back view controller
    */
    func endCall() {
        sessionDidDisconnect(session!)
        doUnsubscribe()
        self.navigationController!.popViewControllerAnimated(true)
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
            } else {
                sender.backgroundColor = UIColor(hex: "8E8E93")
                sender.tintColor = UIColor.grayColor()
            }
            break
        case 1: // ---end call---
            isClickEnd = true
            SingleTon.socket.emit("get", ["url": NSString(format: "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@", userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].UID, "end")])
            endCall()
            
            /// using for multiple conference, sent signal in a session
            //            var err: OTError? = nil
            //
            //            session!.signalWithType("type", string: "endCall", connection: nil, error: &err)
            //            if ((err) != nil) {
            //                print("Error, \(err)")
            //            } else {
            //                print("--signal sent--")
            //            }
            
        case 2: // camera call
            publisher!.publishVideo = !publisher!.publishVideo
            if(publisher!.publishVideo) {
                sender.backgroundColor = UIColor(hex: "CCCC")
                sender.tintColor = UIColor.whiteColor()
            } else {
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
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: screenSize.width
            , height: screenSize.height)
        
        /// Emit call patient
        SingleTon.socket.emit("get", ["url": NSString(format: MAKE_CALL, userDefaults["UID"] as! String, SingleTon.onlineUser_Singleton[idOnlineUser].UID, "call", SessionID, SingleTon.onlineUser_Singleton[idOnlineUser].fullNameDoctor)])
        
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
        NSLog("session streamCreated (\(stream.streamId))")
        
        if subscriber?.stream.streamId == stream.streamId {
            doUnsubscribe()
        }
    }
    
    func session(session: OTSession, connectionCreated connection : OTConnection) {
        NSLog("session connectionCreated (\(connection.connectionId))")
    }
    
    func session(session: OTSession, connectionDestroyed connection : OTConnection) {
        NSLog("session connectionDestroyed (\(connection.connectionId))")
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
    }
    
    func session(session: OTSession, receivedSignalType type: String!, fromConnection connection: OTConnection!, withString string: String!) {
        print(type, string)
    }
    
    // MARK: - OTSubscriber delegate callbacks
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        publisher!.view.frame = CGRect(x: (UIScreen.mainScreen().bounds.size.width - videoWidth) - 10, y: 40, width: videoWidth, height: videoHeight)
        if let view = subscriber?.view {
            view.frame =  CGRect(x: 0.0, y: 0, width: screenSize.size.width, height: screenSize.size.height)
            self.view.addSubview(view)
            self.view.addSubview(publisher!.view)
            for button: UIButton in controllerButtonCall {
                self.view.addSubview(button)
            }
            self.publisher!.view.enableDragging()
        }
    }
    
    func subscriber(subscriber: OTSubscriberKit, didFailWithError error : OTError) {
        NSLog("subscriber %@ didFailWithError %@", subscriber.stream.streamId, error)
    }
    
    // MARK: - OTPublisher delegate callbacks
    
    func publisher(publisher: OTPublisherKit, streamCreated stream: OTStream) {
        NSLog("publisher streamCreated %@", stream)
        
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
