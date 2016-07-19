import Foundation
import UIKit

extension NSURL
{
    struct ValidationQueue {
        static var queue = NSOperationQueue()
    }
    
    class func validateUrl(urlString: String?, completion:(success: Bool, urlString: String? , error: NSString) -> Void)
    {
        var formattedUrlString : String?
        
        // Ignore Nils & Empty Strings
        if (urlString == nil || urlString == "")
        {
            completion(success: false, urlString: nil, error: "URL String was empty")
            return
        }
        
        // Ignore prefixes (including partials)
        let prefixes = ["http://www.", "https://www.", "www."]
        for prefix in prefixes
        {
            if ((prefix.rangeOfString(urlString!, options: NSStringCompareOptions.CaseInsensitiveSearch, range: nil, locale: nil)) != nil){
                completion(success: false, urlString: nil, error: "Url String was prefix only")
                return
            }
        }
        
        // Ignore URLs with spaces
        let range = urlString!.rangeOfCharacterFromSet(NSCharacterSet.whitespaceCharacterSet())
        if range != nil {
            completion(success: false, urlString: nil, error: "Url String cannot contain whitespaces")
            return
        }
        
        // Check that URL already contains required 'http://' or 'https://', prepend if it does not
        formattedUrlString = urlString
        if (!formattedUrlString!.hasPrefix("http://") && !formattedUrlString!.hasPrefix("https://"))
        {
            formattedUrlString = "http://"+urlString!
        }
        
        // Check that an NSURL can actually be created with the formatted string
        if let validatedUrl = NSURL(string: formattedUrlString!)
        {
            // Test that URL actually exists by sending a URL request that returns only the header response
            let request = NSMutableURLRequest(URL: validatedUrl)
            request.HTTPMethod = "HEAD"
            ValidationQueue.queue.cancelAllOperations()
            
            NSURLConnection.sendAsynchronousRequest(request, queue: ValidationQueue.queue, completionHandler:{ (response: NSURLResponse?, data: NSData?, error: NSError?) -> Void in
                let url = request.URL!.absoluteString
                
                // URL failed - No Response
                if (error != nil)
                {
                    completion(success: false, urlString: url, error: "The url: \(url) received no response")
                    return
                }
                
                // URL Responded - Check Status Code
                if let urlResponse = response as? NSHTTPURLResponse
                {
                    if ((urlResponse.statusCode >= 200 && urlResponse.statusCode < 400) || urlResponse.statusCode == 405)// 200-399 = Valid Responses, 405 = Valid Response (Weird Response on some valid URLs)
                    {
                        completion(success: true, urlString: url, error: "The url: \(url) is valid!")
                        return
                    }
                    else // Error
                    {
                        completion(success: false, urlString: url, error: "The url: \(url) received a \(urlResponse.statusCode) response")
                        return
                    }
                }
            })
        }
    }
}