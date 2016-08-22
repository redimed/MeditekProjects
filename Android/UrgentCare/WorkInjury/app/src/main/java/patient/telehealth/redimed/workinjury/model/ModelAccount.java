package patient.telehealth.redimed.workinjury.model;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class ModelAccount {

    private int ID;
    private String UID;
    private int UserAccountID;
    private String Title;
    private String FirstName;
    private Object MiddleName;
    private String LastName;
    private String DOB;
    private String Gender;
    private Object Occupation;
    private String Address1;
    private Object Address2;
    private String Suburb;
    private String Postcode;
    private String State;
    private int CountryID1;
    private String Email1;
    private Object Email2;
    private Object HomePhoneNumber;
    private Object WorkPhoneNumber;
    private String Enable;
    private Object MaritalStatus;
    private Object PreferredName;
    private Object PreviousName;
    private Object Indigenous;
    private Object FaxNumber;
    private Object InterpreterRequired;
    private Object InterperterLanguage;
    private Object OtherSpecialNeed;
    private Object Education;
    private Object ProfileImage;
    private Object Signature;
    private String PhoneNumber;
    private String Email;
    private String CountryName;

    private UserAccountBean UserAccount;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public int getUserAccountID() {
        return UserAccountID;
    }

    public void setUserAccountID(int UserAccountID) {
        this.UserAccountID = UserAccountID;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String Title) {
        this.Title = Title;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String FirstName) {
        this.FirstName = FirstName;
    }

    public Object getMiddleName() {
        return MiddleName;
    }

    public void setMiddleName(Object MiddleName) {
        this.MiddleName = MiddleName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String LastName) {
        this.LastName = LastName;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public String getGender() {
        return Gender;
    }

    public void setGender(String Gender) {
        this.Gender = Gender;
    }

    public Object getOccupation() {
        return Occupation;
    }

    public void setOccupation(Object Occupation) {
        this.Occupation = Occupation;
    }

    public String getAddress1() {
        return Address1;
    }

    public void setAddress1(String Address1) {
        this.Address1 = Address1;
    }

    public Object getAddress2() {
        return Address2;
    }

    public void setAddress2(Object Address2) {
        this.Address2 = Address2;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String Suburb) {
        this.Suburb = Suburb;
    }

    public String getPostcode() {
        return Postcode;
    }

    public void setPostcode(String Postcode) {
        this.Postcode = Postcode;
    }

    public String getState() {
        return State;
    }

    public void setState(String State) {
        this.State = State;
    }

    public int getCountryID1() {
        return CountryID1;
    }

    public void setCountryID1(int CountryID1) {
        this.CountryID1 = CountryID1;
    }

    public String getEmail1() {
        return Email1;
    }

    public void setEmail1(String Email1) {
        this.Email1 = Email1;
    }

    public Object getEmail2() {
        return Email2;
    }

    public void setEmail2(Object Email2) {
        this.Email2 = Email2;
    }

    public Object getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(Object HomePhoneNumber) {
        this.HomePhoneNumber = HomePhoneNumber;
    }

    public Object getWorkPhoneNumber() {
        return WorkPhoneNumber;
    }

    public void setWorkPhoneNumber(Object WorkPhoneNumber) {
        this.WorkPhoneNumber = WorkPhoneNumber;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String Enable) {
        this.Enable = Enable;
    }

    public Object getMaritalStatus() {
        return MaritalStatus;
    }

    public void setMaritalStatus(Object MaritalStatus) {
        this.MaritalStatus = MaritalStatus;
    }

    public Object getPreferredName() {
        return PreferredName;
    }

    public void setPreferredName(Object PreferredName) {
        this.PreferredName = PreferredName;
    }

    public Object getPreviousName() {
        return PreviousName;
    }

    public void setPreviousName(Object PreviousName) {
        this.PreviousName = PreviousName;
    }

    public Object getIndigenous() {
        return Indigenous;
    }

    public void setIndigenous(Object Indigenous) {
        this.Indigenous = Indigenous;
    }

    public Object getFaxNumber() {
        return FaxNumber;
    }

    public void setFaxNumber(Object FaxNumber) {
        this.FaxNumber = FaxNumber;
    }

    public Object getInterpreterRequired() {
        return InterpreterRequired;
    }

    public void setInterpreterRequired(Object InterpreterRequired) {
        this.InterpreterRequired = InterpreterRequired;
    }

    public Object getInterperterLanguage() {
        return InterperterLanguage;
    }

    public void setInterperterLanguage(Object InterperterLanguage) {
        this.InterperterLanguage = InterperterLanguage;
    }

    public Object getOtherSpecialNeed() {
        return OtherSpecialNeed;
    }

    public void setOtherSpecialNeed(Object OtherSpecialNeed) {
        this.OtherSpecialNeed = OtherSpecialNeed;
    }

    public Object getEducation() {
        return Education;
    }

    public void setEducation(Object Education) {
        this.Education = Education;
    }

    public Object getProfileImage() {
        return ProfileImage;
    }

    public void setProfileImage(Object ProfileImage) {
        this.ProfileImage = ProfileImage;
    }

    public Object getSignature() {
        return Signature;
    }

    public void setSignature(Object Signature) {
        this.Signature = Signature;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String PhoneNumber) {
        this.PhoneNumber = PhoneNumber;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String Email) {
        this.Email = Email;
    }

    public String getCountryName() {
        return CountryName;
    }

    public void setCountryName(String CountryName) {
        this.CountryName = CountryName;
    }

    public UserAccountBean getUserAccount() {
        return UserAccount;
    }

    public void setUserAccount(UserAccountBean UserAccount) {
        this.UserAccount = UserAccount;
    }

    public static class UserAccountBean {
        private int ID;
        private String UID;
        private String UserName;
        private String Email;
        private String PhoneNumber;
        private String Password;
        private Object PasswordSalt;
        private Object PasswordHashAlgorithm;
        private String Activated;
        private String Enable;
        private Object UserType;
        private Object Token;
        private Object TokenExpired;
        private String CreatedDate;
        private Object CreatedBy;
        private String ModifiedDate;
        private Object ModifiedBy;
        private String PinNumber;
        private int ExpiryPin;

        public int getID() {
            return ID;
        }

        public void setID(int ID) {
            this.ID = ID;
        }

        public String getUID() {
            return UID;
        }

        public void setUID(String UID) {
            this.UID = UID;
        }

        public String getUserName() {
            return UserName;
        }

        public void setUserName(String UserName) {
            this.UserName = UserName;
        }

        public String getEmail() {
            return Email;
        }

        public void setEmail(String Email) {
            this.Email = Email;
        }

        public String getPhoneNumber() {
            return PhoneNumber;
        }

        public void setPhoneNumber(String PhoneNumber) {
            this.PhoneNumber = PhoneNumber;
        }

        public String getPassword() {
            return Password;
        }

        public void setPassword(String Password) {
            this.Password = Password;
        }

        public Object getPasswordSalt() {
            return PasswordSalt;
        }

        public void setPasswordSalt(Object PasswordSalt) {
            this.PasswordSalt = PasswordSalt;
        }

        public Object getPasswordHashAlgorithm() {
            return PasswordHashAlgorithm;
        }

        public void setPasswordHashAlgorithm(Object PasswordHashAlgorithm) {
            this.PasswordHashAlgorithm = PasswordHashAlgorithm;
        }

        public String getActivated() {
            return Activated;
        }

        public void setActivated(String Activated) {
            this.Activated = Activated;
        }

        public String getEnable() {
            return Enable;
        }

        public void setEnable(String Enable) {
            this.Enable = Enable;
        }

        public Object getUserType() {
            return UserType;
        }

        public void setUserType(Object UserType) {
            this.UserType = UserType;
        }

        public Object getToken() {
            return Token;
        }

        public void setToken(Object Token) {
            this.Token = Token;
        }

        public Object getTokenExpired() {
            return TokenExpired;
        }

        public void setTokenExpired(Object TokenExpired) {
            this.TokenExpired = TokenExpired;
        }

        public String getCreatedDate() {
            return CreatedDate;
        }

        public void setCreatedDate(String CreatedDate) {
            this.CreatedDate = CreatedDate;
        }

        public Object getCreatedBy() {
            return CreatedBy;
        }

        public void setCreatedBy(Object CreatedBy) {
            this.CreatedBy = CreatedBy;
        }

        public String getModifiedDate() {
            return ModifiedDate;
        }

        public void setModifiedDate(String ModifiedDate) {
            this.ModifiedDate = ModifiedDate;
        }

        public Object getModifiedBy() {
            return ModifiedBy;
        }

        public void setModifiedBy(Object ModifiedBy) {
            this.ModifiedBy = ModifiedBy;
        }

        public String getPinNumber() {
            return PinNumber;
        }

        public void setPinNumber(String PinNumber) {
            this.PinNumber = PinNumber;
        }

        public int getExpiryPin() {
            return ExpiryPin;
        }

        public void setExpiryPin(int ExpiryPin) {
            this.ExpiryPin = ExpiryPin;
        }
    }
}
