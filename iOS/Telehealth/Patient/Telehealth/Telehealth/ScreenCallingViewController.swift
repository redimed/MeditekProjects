//
//  ScreenCallingViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

let videoWidthSub : CGFloat = 150
let videoHeightSub : CGFloat = 150

var ApiKey  = String()
// Replace with your generated session ID
var SessionID = String()
// Replace with your generated token
var Token = String()

// Change to YES to subscribe to your own stream.
let SubscribeToSelf = false


class ScreenCallingViewController: UIViewController,OTSessionDelegate, OTSubscriberKitDelegate, OTPublisherDelegate {
    let screenSize: CGRect = UIScreen.mainScreen().bounds
    var videoWidth : CGFloat  = UIScreen.mainScreen().bounds.width
    var videoHeight : CGFloat  = UIScreen.mainScreen().bounds.height
    var session : OTSession?
    var publisher : OTPublisher?
    var subscriber : OTSubscriber?
    var uuidFrom = String()
    var uuidTo = String()
    @IBOutlet weak var buttonHoldCall: DesignableButton!
    @IBOutlet weak var buttonEndCall: DesignableButton!
    @IBOutlet weak var buttonMuteCall: DesignableButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        let apiKey = savedData.data[0]["apiKey"]
        let sessionId = savedData.data[0]["sessionId"]
        let token = savedData.data[0]["token"]
        print("token calling : \(token)")
        ApiKey = String(apiKey)
        // Replace with your generated session ID
        SessionID = String(sessionId)
        // Replace with your generated token
        Token = String(token)
        //get UUID to
        uuidTo = String(savedData.data[0]["from"])
        //Get uuid from in localstorage
        if let uuid = defaults.valueForKey("uid") as? String {
            uuidFrom = uuid
            
        }

        
    }
    
    //Giap: Open or close publisher video
    @IBAction func buttonHoldCallAction(sender: DesignableButton) {
        
        if publisher?.publishVideo.boolValue == true {
            publisher?.publishVideo = false
            sender.setTitle(FAIcon.play, forState: .Normal)

        } else {
            publisher?.publishVideo = true
            sender.setTitle(FAIcon.pause, forState: .Normal)
            
        }
    }
    //Giap: On or Off mic
    @IBAction func buttonMuteAudioAction(sender: DesignableButton) {
        if publisher?.publishAudio.boolValue == true {
            publisher?.publishAudio = false
            sender.setTitle(FAIcon.volume_up, forState: .Normal)
        }else {
            publisher?.publishAudio = true
            sender.setTitle(FAIcon.volume_off, forState: .Normal)
        }
    }
    @IBAction func buttonEndCallAction(sender: DesignableButton) {
        sessionDidDisconnect(session!)
        doUnsubscribe()
        session!.disconnect()
        emitDataToServer(MessageString.CallEndCall)
        let homeMain = storyboard?.instantiateViewControllerWithIdentifier("NavigationHomeStoryboard") as! NavigationHomeViewController
        presentViewController(homeMain, animated: true, completion: nil)
    }
    
    //Giap: Func handle emit socket to server 2 message : Answer or EndCall
    func emitDataToServer(message:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer,self.uuidFrom,self.uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
    }
    
    
    override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
        if UIDevice.currentDevice().orientation.isLandscape.boolValue {
            print("landscape")
            print("Width:\(UIScreen.mainScreen().bounds.width) , height:\(UIScreen.mainScreen().bounds.height)")
        } else {
            print("portraight")
            print("Width:\(UIScreen.mainScreen().bounds.width) , height:\(UIScreen.mainScreen().bounds.height)")
            
        }
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    override func viewWillAppear(animated: Bool) {
        // Step 2: As the view comes into the foreground, begin the connection process.
        session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
        doConnect()
        view.showLoading()
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    
    /**
    * Asynchronously begins the session connect process. Some time later, we will
    * expect a delegate method to call us back with the results of this action.
    */
    func doConnect() {
        if let session = self.session {
            var maybeError : OTError?
            session.connectWithToken(Token, error: &maybeError)
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
        view.addSubview((publisher?.view)!)
        view.addSubview(buttonEndCall)
        view.addSubview(buttonHoldCall)
        view.addSubview(buttonMuteCall)
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: videoWidthSub, height: videoHeightSub)
        
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
        let HomeController = storyboard?.instantiateViewControllerWithIdentifier("NavigationHomeStoryboard") as! NavigationHomeViewController
        presentViewController(HomeController, animated: true, completion: nil)
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
    }
    
    // MARK: - OTSubscriber delegate callbacks
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        
        if let view = subscriber?.view {
            view.frame =  CGRect(x: 0.0, y: 0, width: videoWidth, height: videoHeight)
            
        }
        //add button in subcriber
        view.addSubview(subscriber!.view)
        
        subscriber?.view.addSubview((publisher?.view)!)
        subscriber?.view.addSubview(buttonEndCall)
        subscriber?.view.addSubview(buttonHoldCall)
        subscriber?.view.addSubview(buttonMuteCall)
        view.hideLoading()
        
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
            let al = UIAlertView(title: "OTError", message: message, delegate: nil, cancelButtonTitle: "OK")
        }
    }
    //Giap: Func change icon
    func changeIconCallingView(button:DesignableButton,nameImg:String){
        button.setImage(UIImage(named: nameImg), forState: UIControlState.Normal)
    }
    
    
}
