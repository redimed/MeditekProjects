//
//  AppDelegate.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import CoreData
import SwiftyJSON

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    var config = ConfigurationSystem()
    let ServerApi = GetAndPostDataController()
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        let defaults = NSUserDefaults.standardUserDefaults()
        if  defaults.valueForKey("deviceID") as? String == nil {
            let deviceID = UIDevice.currentDevice().identifierForVendor!.UUIDString
            defaults.setValue(deviceID, forKey: "deviceID")
            defaults.synchronize()
        }else {
            print("data device-------",defaults.valueForKey("deviceID") as? String)
        }
        
        

        
        
        
        // Override point for customization after application launch.
        UINavigationBar.appearance().barTintColor = UIColor(red: 51.0/255.0, green: 65.0/255.0, blue: 105.0/255.0, alpha: 1.0)
        UINavigationBar.appearance().tintColor = UIColor.whiteColor()
        UINavigationBar.appearance().titleTextAttributes = [NSForegroundColorAttributeName : UIColor.whiteColor()]
        
        //check verified in localstorege
        
        if let stringOne = defaults.valueForKey("verifyUser") as? String {
            if stringOne == "Verified" {
                
                let storyboard = UIStoryboard(name: "Main", bundle: nil)
                let initialViewController = storyboard.instantiateViewControllerWithIdentifier("NavigationHomeStoryboard") as! NavigationHomeViewController
                self.window?.rootViewController = initialViewController
                self.window?.makeKeyAndVisible()
            }
            
        }
        //create setting push notification
        application.registerUserNotificationSettings(UIUserNotificationSettings(forTypes: [UIUserNotificationType.Sound, UIUserNotificationType.Alert, UIUserNotificationType.Badge], categories: nil))
        let notificationActionOk :UIMutableUserNotificationAction = UIMutableUserNotificationAction()
        notificationActionOk.identifier = "Answer"
        notificationActionOk.title = "Ok"
        notificationActionOk.destructive = false
        notificationActionOk.authenticationRequired = false
        notificationActionOk.activationMode = UIUserNotificationActivationMode.Foreground
        
        let notificationActionCancel :UIMutableUserNotificationAction = UIMutableUserNotificationAction()
        notificationActionCancel.identifier = "Desline"
        notificationActionCancel.title = "Not Now"
        notificationActionCancel.destructive = true
        notificationActionCancel.authenticationRequired = false
        notificationActionCancel.activationMode = UIUserNotificationActivationMode.Background
        
        let notificationCategory:UIMutableUserNotificationCategory = UIMutableUserNotificationCategory()
        notificationCategory.identifier = "CALLING_MESSAGE"
        notificationCategory .setActions([notificationActionOk,notificationActionCancel], forContext: UIUserNotificationActionContext.Default)
        
        application.registerUserNotificationSettings(UIUserNotificationSettings(forTypes: [UIUserNotificationType.Sound ,UIUserNotificationType.Alert,UIUserNotificationType.Badge],categories:NSSet(array:[notificationCategory]) as? Set<UIUserNotificationCategory>))
        application.registerForRemoteNotifications()
        
        return true
    }
    
    func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject], fetchCompletionHandler completionHandler: (UIBackgroundFetchResult) -> Void) {
        setDataCalling(userInfo)
        statusCallingNotification = notifyMessage.ClickNotify
         NSNotificationCenter.defaultCenter().postNotificationName("openPopUpCalling", object: self)
         UIApplication.sharedApplication().applicationIconBadgeNumber = 0
        completionHandler(.NoData)
    }
    
    func setDataCalling(userInfo: [NSObject : AnyObject]){
        let userInfo = JSON(userInfo)
        let apiKey  =  userInfo["data"]["apiKey"].string! as String
        let message = userInfo["data"]["message"].string! as String
        let from = userInfo["data"]["from"].string! as String
        let sessionId  =  userInfo["data"]["sessionId"].string! as String
        let token  = userInfo["data"]["token"].string! as String
        let fromName  = userInfo["data"]["fromName"].string! as String
        savedData = saveData(apiKey: apiKey, message: message, fromName: fromName, sessionId: sessionId, token: token, from: from)

    }
    
    func application(application: UIApplication, handleActionWithIdentifier identifier: String?, forRemoteNotification userInfo: [NSObject : AnyObject], completionHandler: () -> Void) {
            switch (identifier!) {
                case "Answer":
                   setDataCalling(userInfo)
                   statusCallingNotification = notifyMessage.ClickAnswer
                    NSNotificationCenter.defaultCenter().postNotificationName("openScreenCall", object: self)
                    UIApplication.sharedApplication().applicationIconBadgeNumber = 0
                     completionHandler()
                case "Desline":
                    completionHandler()
                    
                     setDataCalling(userInfo)
                    ServerApi.pushNotification("Doctor cancel call", uid: savedData.from, category: "", data: "aaa",completionHandler: {
                        respone in
                        
                    })
                 UIApplication.sharedApplication().applicationIconBadgeNumber = 0
                default: break
                }
    }
    
    func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData)
    {
        
        
        let deviceTokenString = convertDeviceTokenToString(deviceToken)
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.setValue(deviceTokenString, forKey: "deviceToken")
        defaults.synchronize()
    }
    
    private func convertDeviceTokenToString(deviceToken:NSData) -> String {
        //  Convert binary Device Token to a String (and remove the <,> and white space charaters).
        var deviceTokenStr = deviceToken.description.stringByReplacingOccurrencesOfString(">", withString: "", options: [], range: nil)
        deviceTokenStr = deviceTokenStr.stringByReplacingOccurrencesOfString("<", withString: "", options: [], range: nil)
        deviceTokenStr = deviceTokenStr.stringByReplacingOccurrencesOfString(" ", withString: "", options: [], range: nil)
        return deviceTokenStr
    }
    
    
    
    func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
        print("Couldn't register: \(error)")
    }
    
    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }
    
    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
        print("applicationDidEnterBackground")
        
        
    }
    
    
    
    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
        UIApplication.sharedApplication().applicationIconBadgeNumber = 0
        print("applicationWillEnterForeground")
    }
    
    func applicationDidBecomeActive(application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }
    
    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
        // Saves changes in the application's managed object context before the application terminates.
        self.saveContext()
        print("applicationWillTerminate")
    }
    
    // MARK: - Core Data stack
    
    lazy var applicationDocumentsDirectory: NSURL = {
        // The directory the application uses to store the Core Data store file. This code uses a directory named "com.kreatived.Telehealth" in the application's documents Application Support directory.
        let urls = NSFileManager.defaultManager().URLsForDirectory(.DocumentDirectory, inDomains: .UserDomainMask)
        return urls[urls.count-1]
    }()
    
    lazy var managedObjectModel: NSManagedObjectModel = {
        // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
        let modelURL = NSBundle.mainBundle().URLForResource("Telehealth", withExtension: "momd")!
        return NSManagedObjectModel(contentsOfURL: modelURL)!
    }()
    
    lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        // The persistent store coordinator for the application. This implementation creates and returns a coordinator, having added the store for the application to it. This property is optional since there are legitimate error conditions that could cause the creation of the store to fail.
        // Create the coordinator and store
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
            // Replace this with code to handle the error appropriately.
            // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
            NSLog("Unresolved error \(wrappedError), \(wrappedError.userInfo)")
            abort()
        }
        
        return coordinator
    }()
    
    lazy var managedObjectContext: NSManagedObjectContext = {
        // Returns the managed object context for the application (which is already bound to the persistent store coordinator for the application.) This property is optional since there are legitimate error conditions that could cause the creation of the context to fail.
        let coordinator = self.persistentStoreCoordinator
        var managedObjectContext = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = coordinator
        return managedObjectContext
    }()
    
    // MARK: - Core Data Saving support
    
    func saveContext () {
        if managedObjectContext.hasChanges {
            do {
                try managedObjectContext.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                NSLog("Unresolved error \(nserror), \(nserror.userInfo)")
                abort()
            }
        }
    }
    
}

