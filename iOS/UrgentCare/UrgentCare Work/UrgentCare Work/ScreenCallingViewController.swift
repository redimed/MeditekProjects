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
    
    @IBOutlet weak var displayTimeLabel: UILabel!
    @IBOutlet weak var buttonHoldCall: DesignableButton!
    @IBOutlet weak var buttonEndCall: DesignableButton!
    @IBOutlet weak var buttonMuteCall: DesignableButton!
    @IBOutlet weak var buttonOffMic: DesignableButton!
    let panRec = UIPanGestureRecognizer()
    var startTime = NSTimeInterval()
    var timer:NSTimer = NSTimer()
    
    @IBOutlet weak var timeEffect: UIVisualEffectView!
    
    let socketService = "SocketService()"
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        let apiKey = "apiKey"
        let sessionId = "sessionId"
        let token = "tokenc"
        
        ApiKey = String(apiKey)

        SessionID = String(sessionId)
        Token = String(token)
        uuidTo = String("savedData")
        publisher = OTPublisher(delegate: self)
        
        view.addSubview((publisher?.view)!)
        view.addSubview(buttonEndCall)
        view.addSubview(buttonHoldCall)
        view.addSubview(buttonMuteCall)
        view.addSubview(buttonOffMic)
        buttonEndCall.enabled = true
        
        NSNotificationCenter.defaultCenter().removeObserver(self,name:"endCallAnswer",object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(ScreenCallingViewController.endCallAnswer), name: "endCallAnswer", object: nil)
    }
    
    func start() {
        if (!timer.valid) {
            let aSelector : Selector = #selector(ScreenCallingViewController.updateTime)
            timer = NSTimer.scheduledTimerWithTimeInterval(0.01, target: self, selector: aSelector, userInfo: nil, repeats: true)
            startTime = NSDate.timeIntervalSinceReferenceDate()
        }
    }
    
    func stop() {
        timer.invalidate()
    }
    
    func updateTime() {
        let currentTime = NSDate.timeIntervalSinceReferenceDate()
    
        var elapsedTime: NSTimeInterval = currentTime - startTime
        let minutes = UInt8(elapsedTime / 60.0)
        elapsedTime -= (NSTimeInterval(minutes) * 60)
        
        let seconds = UInt8(elapsedTime)
        elapsedTime -= NSTimeInterval(seconds)
        
        let fraction = UInt8(elapsedTime * 100)
        
        
        let strMinutes = String(format: "%02d", minutes)
        let strSeconds = String(format: "%02d", seconds)
        _ = String(format: "%02d", fraction)
        
        displayTimeLabel.text = "\(strMinutes):\(strSeconds)"
    }
    
    @IBAction func buttonHoldCallAction(sender: DesignableButton) {
        
        if publisher?.publishVideo.boolValue == true {
            publisher?.publishVideo = false
            publisher?.view.hidden = true
            
            sender.setTitle(FAIcon.play, forState: .Normal)
        } else {
            publisher?.publishVideo = true
            sender.setTitle(FAIcon.pause, forState: .Normal)
            publisher?.view.hidden = false
        }
    }
    
    @IBAction func buttonMuteAudioAction(sender: DesignableButton) {
        if subscriber?.subscribeToAudio.boolValue == true {
            subscriber?.subscribeToAudio = false
            sender.setTitle(FAIcon.volume_off, forState: .Normal)
        }else {
            subscriber?.subscribeToAudio = true
            sender.setTitle(FAIcon.volume_up, forState: .Normal)
        }
    }
    
    @IBAction func buttonOnOffMic(sender: AnyObject) {
        if publisher?.publishAudio.boolValue == true {
            publisher?.publishAudio = false
            sender.setTitle(FAIcon.microphone_off, forState: .Normal)
        }else {
            publisher?.publishAudio = true
            sender.setTitle(FAIcon.microphone_on, forState: .Normal)
        }
    }
    
    @IBAction func buttonEndCallAction(sender: DesignableButton) {
        session?.signalWithType("endCall", string: "MessageString.CallEndCall", connection: nil, error: nil)
        endCallAnswer()
    }
    
    func session(session: OTSession!, receivedSignalType type: String!, fromConnection connection: OTConnection!, withString string: String!) {
        if type == "endCall"{
            if string == "end"{

            }
        }
        
    }
    
    func emitDataToServer(message:String){
        let modifieldURLString = NSString(format: "UrlAPISocket.emitAnswer",self.uuidFrom,self.uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        print("get", dictionNary)
    }
    
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    
    override func viewWillAppear(animated: Bool) {
        session = OTSession(apiKey: ApiKey, sessionId: SessionID, delegate: self)
        print("daadadad------\(session?.sessionConnectionStatus)")
        doConnect()
        view.showLoading()
    }
    
    override func prefersStatusBarHidden() -> Bool {
        return true
    }
    
    func doConnect() {
        
        if let session = self.session {
            var maybeError : OTError?
            session.connectWithToken(Token, error: &maybeError)
            if let error = maybeError {
                showAlert(error.localizedDescription)
                print("----error---calling---",error)
            }
            
        }
    }
    
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
        view.addSubview(buttonOffMic)
        
        panRec.addTarget(self, action: #selector(ScreenCallingViewController.draggedView(_:)))
        publisher!.view.frame = CGRect(x: 0.0, y: 0, width: videoWidthSub, height: videoHeightSub)
        publisher?.view.userInteractionEnabled = true
        publisher?.view.addGestureRecognizer(panRec)
        
    }
    func draggedView(sender:UIPanGestureRecognizer){
        self.view.bringSubviewToFront(sender.view!)
        let translation = sender.translationInView(self.view)
        sender.view!.center = CGPointMake(sender.view!.center.x + translation.x, sender.view!.center.y + translation.y)
        sender.setTranslation(CGPointZero, inView: self.view)
    }
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
    
    func sessionDidConnect(session: OTSession) {
        NSLog("sessionDidConnect (\(session.sessionId))")
        
        print("----ssss---",session.sessionConnectionStatus.rawValue)
        doPublish()
    }
    
    func sessionDidDisconnect(session : OTSession) {
        NSLog("Session disconnected (\( session.sessionId))")
        
        
    }
    
    func session(session: OTSession, streamCreated stream: OTStream) {
        NSLog("session streamCreated (\(stream.streamId))")
        
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
        
        endCallAnswer()
    }
    
    func session(session: OTSession, didFailWithError error: OTError) {
        NSLog("session didFailWithError (%@)", error)
        
    }
    
    func subscriberDidConnectToStream(subscriberKit: OTSubscriberKit) {
        NSLog("subscriberDidConnectToStream (\(subscriberKit))")
        
        if let views = subscriber?.view {
            views.frame =  CGRect(x: 0.0, y: 0, width: view.bounds.width, height: view.bounds.height)
            
        }
        
        view.addSubview(subscriber!.view)
        
        subscriber?.view.addSubview((publisher?.view)!)
        subscriber?.view.addSubview(buttonEndCall)
        subscriber?.view.addSubview(buttonHoldCall)
        subscriber?.view.addSubview(buttonMuteCall)
        subscriber?.view.addSubview(buttonOffMic)
        subscriber?.view.addSubview(timeEffect)
        buttonEndCall.enabled = true
        start()
        view.hideLoading()
        
        
    }
    
    func subscriber(subscriber: OTSubscriberKit, didFailWithError error : OTError) {
        NSLog("subscriber %@ didFailWithError %@", subscriber.stream.streamId, error)
        
    }
    
    func publisher(publisher: OTPublisherKit, streamCreated stream: OTStream) {
        NSLog("publisher streamCreated %@", stream)
        if subscriber == nil && SubscribeToSelf {
            doSubscribe(stream)
        }
        if subscriber == nil {
            endCallAnswer()
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
    
    
    func showAlert(message: String) {
        dispatch_async(dispatch_get_main_queue()) {
            print("Message",message)
        }
    }

    func changeIconCallingView(button:DesignableButton,nameImg:String){
        button.setImage(UIImage(named: nameImg), forState: UIControlState.Normal)
    }
    
    
    
    func endCallAnswer() {
        sessionDidDisconnect(session!)
        session?.disconnect()
        doUnsubscribe()
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    override func shouldAutorotate() -> Bool {
        if (UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeLeft ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.LandscapeRight ||
            UIDevice.currentDevice().orientation == UIDeviceOrientation.Unknown) {
            return false
        }
        else {
            return true
        }
    }
    
    override func supportedInterfaceOrientations() -> UIInterfaceOrientationMask {
        return [UIInterfaceOrientationMask.Portrait ,UIInterfaceOrientationMask.PortraitUpsideDown]
    }
 
}
