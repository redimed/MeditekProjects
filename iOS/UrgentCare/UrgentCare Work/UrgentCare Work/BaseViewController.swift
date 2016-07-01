//
//  BaseViewController.swift
//  VgoUserApp
//
//  Created by admin on 02/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

class BaseViewController: UIViewController,DTAlertViewDelegate,UITextFieldDelegate,AVAudioPlayerDelegate,SocketDelegate,MyPopupViewControllerDelegate {
    
    //var alertView: DTAlertView!
    var alertView = UIAlertView()
    var alertDTAlertView: DTAlertView!
    let delay = 0.5 * Double(NSEC_PER_SEC)
    var backMusic: AVAudioPlayer!
    let callService = CallService()
    let socketService = SocketService()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        socketService.delegate = self
        
        NSNotificationCenter.defaultCenter().removeObserver(self,name:Define.LogoutFunction, object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(BaseViewController.LogoutWhenIsAuthenticated), name: Define.LogoutFunction, object: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func animationView(view:DesignableView){
        view.animation = "shake"
        view.curve = "easeIn"
        view.force = 2.0
        view.duration = 0.5
        view.animate()
    }
    func leftNavButtonClick(sender:UIButton!)
    {
        self.navigationController?.popViewControllerAnimated(true)
    }
    
    func showAlertWithMessageTitle(message: String, title: String, alertStyle: DTAlertStyle){
        self.alertDTAlertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: self)
        self.alertDTAlertView.show()
    }
    func receiveMessage(controller: SocketService, message: String, data: AnyObject) {
        switch message {
        case Define.MessageString.Call :
            callService.setDataCalling(data)
            self.openPopUpCalling()
        case  Define.MessageString.CallEndCall:
            NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
            break
        case Define.MessageString.Cancel:
            NSNotificationCenter.defaultCenter().postNotificationName("cancelCall", object: self)
            NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
            break
        case  Define.MessageString.Decline:
            self.dismissPopupViewController(.Fade)
            self.backMusic.stop()
            break
        case Define.MessageString.CallAnswer:
            self.dismissPopupViewController(.Fade)
            self.backMusic.stop()
            break
        default :
            break
        }
    }
    //MARK: MyPopupViewControllerProtocol
    func pressOK(sender: MyPopupViewController) {
        backMusic.stop()
        self.dismissPopupViewController(.Fade)
        openScreenCall()
        
    }
    func openScreenCall(){
        let homeMain = self.storyboard?.instantiateViewControllerWithIdentifier("ScreenCallingViewControllerID") as! ScreenCallingViewController
        self.presentViewController(homeMain, animated: true, completion: nil)
    }
    
    func openPopUpCalling(){
        self.displayViewController(.TopBottom)
        self.playRingtone()
    }
    func displayViewController(animationType: SLpopupViewAnimationType) {
        let myPopupViewController:MyPopupViewController = MyPopupViewController(nibName:"MyPopupViewController", bundle: nil)
        myPopupViewController.delegate = self
        self.presentpopupViewController(myPopupViewController, animationType: animationType, completion: { () -> Void in
            
        })
    }
    
    func pressCancel(sender: MyPopupViewController) {
        backMusic.stop()
        socketService.emitDataToServer(Define.MessageString.Decline, uidFrom: receiveMessageData.to, uuidTo: receiveMessageData.from)
        self.dismissPopupViewController(.Fade)
        //savedData = CallContainer()
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
    
    func LogoutWhenIsAuthenticated(){
        
        CallAPILogout(Context.getDataDefasults(Define.keyNSDefaults.UID) as! String)
        Context.deleteDatDefaults(Define.keyNSDefaults.Authorization)
        Context.deleteDatDefaults(Define.keyNSDefaults.userLogin)
        Context.deleteDatDefaults(Define.keyNSDefaults.Cookie)
        Context.deleteDatDefaults(Define.keyNSDefaults.companyInfor)
        Context.deleteDatDefaults(Define.keyNSDefaults.UIDLogoutFail)
        Context.deleteDatDefaults(Define.keyNSDefaults.UID)
        Context.deleteDatDefaults(Define.keyNSDefaults.IsCompanyAccount)
        Context.deleteDatDefaults(Define.keyNSDefaults.userLogin)
        Context.deleteDatDefaults(Define.keyNSDefaults.TeleheathUserDetail)
        Context.deleteDatDefaults(Define.keyNSDefaults.TelehealthUserUID)
        Socket.disconnect()
    }
    func CallAPILogout(uid:String){
       self.showloading(Define.MessageString.PleaseWait)
        UserService.getLogout() { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let logoutResponse = Mapper<LogoutResponse>().map(response.result.value) {
                            if(logoutResponse.status == "success"){
                                
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                
                                self!.hideLoading()
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })
                            }else{
                                self!.hideLoading()
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                    let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                    dispatch_after(time, dispatch_get_main_queue(), {
                        self?.navigationController?.pushViewController(loginViewController, animated: true)
                    })

                }
            }
        }
    }
}
