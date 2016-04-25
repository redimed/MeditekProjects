//
//  ViewController.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
import ObjectMapper

class ViewController: BaseViewController,UIPageViewControllerDataSource,ContentViewDelegate{
    
    @IBOutlet weak var pageControl: UIPageControl!
    @IBOutlet weak var viewPaging: UIView!
    var pageViewController: UIPageViewController!
    var pageTitles: NSArray!
    var pageImages: NSArray!
    weak var timer: NSTimer?
    var page = 0
    @IBOutlet weak var buttonLogin: UIButton!
    var pastUrls :[String] =   []
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationController?.navigationBarHidden = true
        if (Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != "") {
            buttonLogin.hidden = true
            if(Context.getDataDefasults(Define.keyNSDefaults.IsCompanyAccount) as! String != ""){
                loadInformationData()
            }
        }
        
    }
    override func viewDidAppear(animated: Bool) {
        if let _ = Context.getDataDefasults(Define.keyNSDefaults.pastUrls) as? String {
            loadDataJson()
        } else {
            pastUrls = Context.getDataDefasults(Define.keyNSDefaults.pastUrls) as! [String]
        }
        if (Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != "") {
            buttonLogin.hidden = true
        }
        pagingImage()
        resetTimer()
    }
    
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    func resetTimer() {
        timer?.invalidate()
        let nextTimer = NSTimer.scheduledTimerWithTimeInterval(5.0, target: self, selector: #selector(ViewController.handleIdleEventAutoSlide(_:)), userInfo: nil, repeats: true)
        timer = nextTimer
    }
    
    func loadInformationData(){
        //showloading(Define.MessageString.PleaseWait)
        let data = Context.getDataDefasults(Define.keyNSDefaults.userInfor)
        let respone = Mapper<LoginResponse>().map(data)
        
        UserService.getDetailCompanyByUser((respone?.user!.UID)!) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let detailCompanyResponse = Mapper<DetailCompanyResponse>().map(response.result.value) {
                            if detailCompanyResponse.message == "success"  {
                               // self!.hideLoading()
                                let companyInfor = Mapper().toJSON(detailCompanyResponse)
                                
                                if(detailCompanyResponse.data.count > 0){
                                    Context.setDataDefaults(companyInfor, key: Define.keyNSDefaults.companyInfor)
                                }
                            }else{
                                //self!.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    //self!.hideLoading()
                    self?.showMessageNoNetwork()
                }
                
            }
        }
        
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
                page += 1
            }else{
                autoSlide(page + 1)
                page += 1
            }
        }
    }
    
    //page Controller
    func pagingImage(){
        self.pageTitles = NSArray(objects: "Explore","Lest","contruction","ss")
        self.pageImages = NSArray(objects: "truck","chef","construction","sore back")
        pageControl.numberOfPages = pageImages.count
        self.pageViewController = self.storyboard?.instantiateViewControllerWithIdentifier("PageViewController") as! UIPageViewController
        self.pageViewController.dataSource = self
        
        let startVC = self.viewControllerAtIndex(0) as ContentViewController
        let viewControllers = NSArray(object: startVC)
        
        self.pageViewController.setViewControllers(viewControllers as? [UIViewController], direction: .Forward, animated: true, completion: nil)
        
        self.pageViewController.view.frame = CGRectMake(0, 0, self.view.frame.width, self.view.frame.size.height)
        
        self.addChildViewController(self.pageViewController)
        self.viewPaging.addSubview(self.pageViewController.view)
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
        
        if index < pageImages.count {
            vc.imageFile = self.pageImages[index] as! String
            vc.titleText = self.pageTitles[index] as! String
            vc.pageIndex = index
            vc.delegate = self
        }
        return vc
        
        
    }
    
    // Giap: - Page View Controller Data Source
    
    func pageViewController(pageViewController: UIPageViewController, viewControllerBeforeViewController viewController: UIViewController) -> UIViewController?
    {
        
        let vc = viewController as! ContentViewController
        var index = vc.pageIndex as Int
        
        
        if (index == 0 || index == NSNotFound)
        {
            return nil
            
        }
        
        index -= 1
        return self.viewControllerAtIndex(index)
        
    }
    
    func pageViewController(pageViewController: UIPageViewController, viewControllerAfterViewController viewController: UIViewController) -> UIViewController? {
        
        let vc = viewController as! ContentViewController
        var index = vc.pageIndex as Int
        
        if (index == NSNotFound)
        {
            return nil
        }
        
        index += 1
        
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
    
    
    //send data by segue
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        if segue.identifier == "TreatmentSegue" {
            let submitViewController = segue.destinationViewController as! SubmitInjuryViewController
            submitViewController.pastUrls = pastUrls
            submitViewController.NavigateBarTitle = "Rehab"
            submitViewController.Rehab = "Y"
        }else if segue.identifier == "specialistSegue" {
            let submitViewController = segue.destinationViewController as! SubmitInjuryViewController
            submitViewController.pastUrls = pastUrls
            submitViewController.NavigateBarTitle = "Specialist Clinic"
            submitViewController.specialist = "Y"
        }else if segue.identifier == "generalSegue" {
            let submitViewController = segue.destinationViewController as! SubmitInjuryViewController
            submitViewController.pastUrls = pastUrls
            submitViewController.NavigateBarTitle = "General Clinic"
            submitViewController.GP = "Y"
        }else if segue.identifier == "FAQsSegue"{
            let data = segue.destinationViewController as! FAQsViewController
            data.fileName = "FAQs"
            data.navigationBarString = "FAQs"
        }else if segue.identifier == "UrgentCareSegue"{
            let data = segue.destinationViewController as! FAQsViewController
            data.fileName = "UrgentCare"
            data.navigationBarString = "ABOUT REDIMED"
            
        }
        
    }
    
    @IBAction func CallUsButton(sender: AnyObject) {
         UIApplication.sharedApplication().openURL(NSURL(string: "tel://0892300900")!)
    }
    
    @IBAction func acctionSetting(sender: AnyObject) {
        let setting :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("SettingViewControllerID") as! SettingViewController
        self.navigationController?.pushViewController(setting, animated: true)
    }
    @IBAction func actionLogin(sender: AnyObject) {
        let setting :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("RegisterViewControllerID") as! RegisterViewController
        self.navigationController?.pushViewController(setting, animated: false)
    }
    // load data from JSON file
    func loadDataJson(){
        if let path = NSBundle.mainBundle().pathForResource("Suburb", ofType: "json") {
            do {
                let data = try NSData(contentsOfURL: NSURL(fileURLWithPath: path), options: NSDataReadingOptions.DataReadingMappedIfSafe)
                let jsonObj = JSON(data: data)
                if jsonObj != JSON.null {
                    for i in 0 ..< jsonObj["suburb"].count {
                        let a = jsonObj["suburb"][i]["name"].string
                        pastUrls.append(a!)
                    }
                Context.setDataDefaults(pastUrls, key: Define.keyNSDefaults.pastUrls)
                } else {
                    print("could not get json from file, make sure that file contains valid json.")
                }
            } catch let error as NSError {
                print(error.localizedDescription)
            }
        } else {
            print("Invalid filename/path.")
        }
    }
    
}

