package patient.telehealth.redimed.workinjury.utils;

/**
 * Created by PhanQuocChien on 6/17/16.
 */
public class Key {

    public static final String token = "token";
    public static final String fontRoboto = "fonts/Roboto-Regular.ttf";
    public static final String confirmExit = "Press Back button again to exit";
    public static final String defalt = "";
    public static final String space = " ";
    public static final String defaltNA = "N/A";
    public static final String refreshCode = "refreshCode";
    public static final String useruid = "useruid";
    public static final String username = "username";
    public static final String teleUid = "TeleUID";
    public static final String isAuthenticated = "isAuthenticated";
    public static final String isTypeCompany = "isTypeCompany";
    public static final String deviceToken = "deviceToken";
    public static final String typeNameCompany = "ORGANIZATION";
    public static final String fmHome = "Home";
    public static final String fmSetting = "Setting";
    public static final String companyUid = "companyUid";
    public static final String companyName = "companyName";
    public static final String fmLogin = "Login";
    public static final String uRType = "URType";
    public static final String rehab = "rehab";
    public static final String specialist = "specialist";
    public static final String gp = "gp";
    public static final String UR = "UR";
    public static final String telCall = "tel:0892300900";
    public static final String fileSuburb = "/suburb.json";
    public static final String locationFileSuburb = "/data/data/";
    public static final String fmFAQs = "FAQs";
    public static final String fmChangePin = "Change Pin";
    public static final String fmAccount = "Account";
    public static final String fmSiteList = "Site List";
    public static final String fmStaffDetail = "Staff Detail";
    public static final String fmStaffList = "Staff List";
    public static final String fmCompanyDetail = "Company Detail";
    public static final String networkError = "Network Error";
    public static final String tokenExpiredError = "TokenExpiredError";


    public class Login {
        public static final String TAG = "GetTelehealthUser";
        public static final String data = "data";
        public static final String phone = "phone";
        public static final String UserUID = "UserUID";
        public static final String PinNumber = "PinNumber";
        public static final String UserName = "UserName";
        public static final String Password = "Password";
        public static final String DefaultPassword = "1";
        public static final String DefaultUserName = "1";
        public static final String token = "token";
        public static final String refreshCode = "refreshCode";
        public static final String user = "user";
        public static final String uid = "uid";
        public static final String telehealthUser = "TelehealthUser";
        public static final String UID = "UID";
    }

    public class Home {
        public static final String TAG = "HomePresenter";
        public static final String data = "data";
        public static final String UID = "UID";
        public static final String CompanyName = "CompanyName";
        public static final String msg = "msg";
    }

    public class FAQ {
        public static final String msg = "msg";
        public static final String fileFAQ = "file:///android_asset/FAQs.html";
        public static final String fileAboutUs = "file:///android_asset/AboutUs.html";
        public static final String fileOther = "file:///android_asset/Other.html";
        public static final String titleAboutUs = "About Us";
        public static final String titleFAQs = "FAQs";
        public static final String titleService = "Service";
        public static final String titleConfirmFAQs = "Confirm FAQs";
    }

    public class Pin {
        public static final String TAG = "PinPresenter";
        public static final String pinNotMatch = "Your Pin are not match";
        public static final String oldpin = "oldpin";
        public static final String newpin = "newpin";
    }

    public class Site {
        public static final String TAG = "SiteListPresenter";
        public static final String data = "data";
        public static final String siteUid = "siteUid";

    }

    public class Account {
        public static final String TAG = "AccountPresenter";
        public static final String data = "data";
        public static final String updatePatientSuccess = "Update patient success!";
        public static final String updatePatientError = "Update patient error!";
        public static final String success = "Success";
        public static final String error = "Error";
    }
}
