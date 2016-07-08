//
//  AppDelegate.swift
//  UrgentCare Sport
//
//  Created by Nguyen Duc Manh on 11/3/15.
//  Copyright © 2015 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import CoreData
import AdSupport
import SwiftyJSON
import ObjectMapper

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, GGLInstanceIDDelegate, GCMReceiverDelegate {
    
    var window: UIWindow?
    
    var connectedToGCM      = false
    var subscribedToTopic   = false
    var gcmSenderID: String?
    var registrationToken: String?
    var registrationOptions = [String: AnyObject]()
    var socketService = SocketService()
    let registrationKey     = "onRegistrationCompleted"
    let messageKey          = "onMessageReceived"
    let subscriptionTopic   = "/topics/global"
    let TAG: String         = "AppDelegate | "
    
    func application(application: UIApplication, supportedInterfaceOrientationsForWindow window: UIWindow?) -> UIInterfaceOrientationMask {
        if let rootViewController = self.topViewControllerWithRootViewController(window?.rootViewController) {
            if (rootViewController.respondsToSelector(Selector("canRotate"))) {
                // Unlock landscape view orientations for this view controller
                return .LandscapeLeft;
            }
        }
        
        // Only allow portrait (standard behaviour)
        return .Portrait;
    }
    
    private func topViewControllerWithRootViewController(rootViewController: UIViewController!) -> UIViewController? {
        if (rootViewController == nil) { return nil }
        if (rootViewController.isKindOfClass(UITabBarController)) {
            return topViewControllerWithRootViewController((rootViewController as! UITabBarController).selectedViewController)
        } else if (rootViewController.isKindOfClass(UINavigationController)) {
            return topViewControllerWithRootViewController((rootViewController as! UINavigationController).visibleViewController)
        } else if (rootViewController.presentedViewController != nil) {
            return topViewControllerWithRootViewController(rootViewController.presentedViewController)
        }
        return rootViewController
    }
    
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        application.setStatusBarStyle(UIStatusBarStyle.Default, animated: true)
        
        // [START register_for_remote_notifications]
        // Configure the Google context: parses the GoogleService-Info.plist, and initializes the services that have entries in the file
        var configureError: NSError?
        GGLContext.sharedInstance().configureWithError(&configureError)
        assert(configureError == nil, "Error configuring Google services: \(configureError)")
        gcmSenderID = GGLContext.sharedInstance().configuration.gcmSenderID
        // [END_EXCLUDE]
        
        // Register for remote notifications
        let types:UIUserNotificationType = ([.Alert, .Badge, .Sound])
        let settings: UIUserNotificationSettings = UIUserNotificationSettings(forTypes: types, categories: nil)
        application.registerUserNotificationSettings(settings)
        application.registerForRemoteNotifications()
        // [END register_for_remote_notifications]
        
        // [START start_gcm_service]
        let gcmConfig = GCMConfig.defaultConfig()
        gcmConfig.receiverDelegate = self
        GCMService.sharedInstance().startWithConfig(gcmConfig)
        // [END start_gcm_service]
        
        setDeviceID()
        return true
    }
    func application(application: UIApplication, didRegisterUserNotificationSettings notificationSettings: UIUserNotificationSettings) {
        application.registerForRemoteNotifications()
    }
    
    
    func setDeviceID(){
        if  Context.getDataDefasults(Define.keyNSDefaults.DeviceID)as! String != "" {
            Context.setDataDefaults(UIDevice.currentDevice().modelName, key: Define.keyNSDefaults.DeviceID)
        }else {
            Context.setDataDefaults(UIDevice.currentDevice().modelName, key: Define.keyNSDefaults.DeviceID)
        }
    }
    func subscribeToTopic() {
        // If the app has a registration token and is connected to GCM, proceed to subscribe to the topic
        if(registrationToken != nil && connectedToGCM) {
            GCMPubSub.sharedInstance().subscribeWithToken(self.registrationToken, topic: subscriptionTopic, options: nil, handler: {(error:NSError?) -> Void in
                if let error = error {
                    // Treat the "already subscribed" error more gently
                    if error.code == 3001 {
                        print("Already subscribed to \(self.subscriptionTopic)")
                    } else {
                        print("Subscription failed: \(error.localizedDescription)");
                    }
                } else {
                    self.subscribedToTopic = true;
                    NSLog("Subscribed to \(self.subscriptionTopic)");
                }
            })
        }
    }
    // [START connect_gcm_service]
    func applicationDidBecomeActive(application: UIApplication) {
        // Connect to the GCM server to receive non-APNS notifications
        GCMService.sharedInstance().connectWithHandler({(error: NSError?) -> Void in
            if let error = error {
                print("Could not connect to GCM: \(error.localizedDescription)")
            } else {
                self.connectedToGCM = true
                print("Connected to GCM")
                // [START_EXCLUDE]
                self.subscribeToTopic()
                // [END_EXCLUDE]
            }
        })
    }
    // [END connect_gcm_service]
    
    // [START disconnect_gcm_service]
    func applicationDidEnterBackground(application: UIApplication) {
        GCMService.sharedInstance().disconnect()
        // [START_EXCLUDE]
        self.connectedToGCM = false
        NSNotificationCenter.defaultCenter().postNotificationName("cancelCall", object: self)
        // [END_EXCLUDE]
    }
    // [END disconnect_gcm_service]
    
    // [START receive_apns_token]
    func application( application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData ) {
        
        // [START get_gcm_reg_token]
        let instanceIDConfig = GGLInstanceIDConfig.defaultConfig()
        instanceIDConfig.delegate = self
        
        // Start the GGLInstanceID shared instance with that config and request a registration token to enable reception of notifications
        GGLInstanceID.sharedInstance().startWithConfig(instanceIDConfig)
        registrationOptions = [kGGLInstanceIDRegisterAPNSOption: deviceToken, kGGLInstanceIDAPNSServerTypeSandboxOption: Constants.KeyPushNotification.SandboxOption]
        GGLInstanceID.sharedInstance().tokenWithAuthorizedEntity(gcmSenderID, scope: kGGLInstanceIDScopeGCM, options: registrationOptions, handler: registrationHandler)
        // [END get_gcm_reg_token]
    }
    // [END receive_apns_token]
    
    // [START receive_apns_token_error]
    func application( application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError ) {
        print("Registration for remote notification failed with error: \(error.localizedDescription)")
        let userInfo = ["error": error.localizedDescription]
        NSNotificationCenter.defaultCenter().postNotificationName(registrationKey, object: nil, userInfo: userInfo)
    }
    // [END receive_apns_token_error]
    
    func applicationWillResignActive(application: UIApplication) {
        
    }
    // [START ack_message_reception]
    func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject]) {
        print("Notification received: \(userInfo)")
        // This works only if the app started the GCM service
        GCMService.sharedInstance().appDidReceiveMessage(userInfo);
        
        // [START_EXCLUDE]
        NSNotificationCenter.defaultCenter().postNotificationName(messageKey, object: nil, userInfo: userInfo)
        // [END_EXCLUDE]
    }
    func application(application: UIApplication, handleActionWithIdentifier identifier: String?, forRemoteNotification userInfo: [NSObject : AnyObject], completionHandler: () -> Void) {
        print("forRemoteNotification",userInfo)
    }
    func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject], fetchCompletionHandler handler: (UIBackgroundFetchResult) -> Void) {
        print("Notification received completion: \(userInfo)")
        // This works only if the app started the GCM service
        GCMService.sharedInstance().appDidReceiveMessage(userInfo);
        
        // [START_EXCLUDE]
        NSNotificationCenter.defaultCenter().postNotificationName(messageKey, object: nil, userInfo: userInfo)
        handler(UIBackgroundFetchResult.NoData);
        // [END_EXCLUDE]
        if(application.applicationState == .Active) {
            NSNotificationCenter.defaultCenter().postNotificationName(Define.PushNotification.PushChangePassword, object: userInfo)
        }else if(application.applicationState == .Background){
            
        }else if(application.applicationState == .Inactive){
            
        }
    }
    // [END ack_message_reception]
    
    func registrationHandler(registrationToken: String!, error: NSError!) {
        if (registrationToken != nil) {
            Context.setDataDefaults(registrationToken, key: Define.keyNSDefaults.DeviceToken)
            self.registrationToken = registrationToken
            print("Registration Token: \(registrationToken)")
            self.subscribeToTopic()
            let userInfo = ["registrationToken": registrationToken]
            NSNotificationCenter.defaultCenter().postNotificationName(
                self.registrationKey, object: nil, userInfo: userInfo)
        } else {
            print("Registration to GCM failed with error: \(error.localizedDescription)")
            let userInfo = ["error": error.localizedDescription]
            NSNotificationCenter.defaultCenter().postNotificationName(
                self.registrationKey, object: nil, userInfo: userInfo)
        }
    }
    
    // [START on_token_refresh]
    func onTokenRefresh() {
        // A rotation of the registration tokens is happening, so the app needs to request a new token.
        print("The GCM registration token needs to be changed.")
        GGLInstanceID.sharedInstance().tokenWithAuthorizedEntity(gcmSenderID, scope: kGGLInstanceIDScopeGCM, options: registrationOptions, handler: registrationHandler)
    }
    // [END on_token_refresh]
    
    func willSendDataMessageWithID(messageID: String!, error: NSError!) {
        if (error != nil) {
        } else {
            print(TAG, messageID)
        }
    }
    
    func didDeleteMessagesOnServer() {
    }
    
    func applicationWillEnterForeground(application: UIApplication) {
    }
    
    
    func applicationWillTerminate(application: UIApplication) {
        self.saveContext()
    }
    
    lazy var applicationDocumentsDirectory: NSURL = {
        let urls = NSFileManager.defaultManager().URLsForDirectory(.DocumentDirectory, inDomains: .UserDomainMask)
        return urls[urls.count-1]
    }()
    
    lazy var managedObjectModel: NSManagedObjectModel = {
        let modelURL = NSBundle.mainBundle().URLForResource("UrgentCare_Sport", withExtension: "momd")!
        return NSManagedObjectModel(contentsOfURL: modelURL)!
    }()
    
    lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        let url = self.applicationDocumentsDirectory.URLByAppendingPathComponent("SingleViewCoreData.sqlite")
        var failureReason = "There was an error creating or loading the application's saved data."
        do {
            try coordinator.addPersistentStoreWithType(NSSQLiteStoreType, configuration: nil, URL: url, options: nil)
        } catch {
            // Report any error we got.
            var dict = [String: AnyObject]()
            dict[NSLocalizedDescriptionKey] = "Failed to initialize the application's saved data"
            dict[NSLocalizedFailureReasonErrorKey] = failureReason
            
            dict[NSUnderlyingErrorKey] = error as NSError
            let wrappedError = NSError(domain: "YOUR_ERROR_DOMAIN", code: 9999, userInfo: dict)
            abort()
        }
        
        return coordinator
    }()
    
    lazy var managedObjectContext: NSManagedObjectContext = {
        let coordinator = self.persistentStoreCoordinator
        var managedObjectContext = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()
    
    func saveContext () {
        if managedObjectContext.hasChanges {
            do {
                try managedObjectContext.save()
            } catch {
                let nserror = error as NSError
                NSLog("Unresolved error \(nserror), \(nserror.userInfo)")
                abort()
            }
        }
    }
    
}

