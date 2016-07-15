package patient.telehealth.redimed.workinjury.models;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by phanq on 04/13/2016.
 */
public class ModelStaff implements Parcelable{
    private String ID;
    private String UID;
    private String UserAccountID;
    private String Title;
    private String MaritalStatus;
    private String FirstName;
    private String MiddleName;
    private String LastName;
    private String PreferredName;
    private String PreviousName;
    private String DOB;
    private String Gender;
    private String Indigenous;
    private String Occupation;
    private String Address1;
    private String Address2;
    private String Postcode;
    private String Suburb;
    private String State;
    private String CountryID1;
    private String CountryID2;
    private String Email1;
    private String Email2;
    private String HomePhoneNumber;
    private String WorkPhoneNumber;
    private String FaxNumber;
    private String InterpreterRequired;
    private String InterperterLanguage;
    private String OtherSpecialNeed;
    private String Enable;
    private String Education;
    private String Signature;
    private String CreatedDate;
    private String CreatedBy;
    private String ModifiedDate;
    private String ModifiedBy;

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getUserAccountID() {
        return UserAccountID;
    }

    public void setUserAccountID(String userAccountID) {
        UserAccountID = userAccountID;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getMaritalStatus() {
        return MaritalStatus;
    }

    public void setMaritalStatus(String maritalStatus) {
        MaritalStatus = maritalStatus;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getMiddleName() {
        return MiddleName;
    }

    public void setMiddleName(String middleName) {
        MiddleName = middleName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public String getPreferredName() {
        return PreferredName;
    }

    public void setPreferredName(String preferredName) {
        PreferredName = preferredName;
    }

    public String getPreviousName() {
        return PreviousName;
    }

    public void setPreviousName(String previousName) {
        PreviousName = previousName;
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

    public void setGender(String gender) {
        Gender = gender;
    }

    public String getIndigenous() {
        return Indigenous;
    }

    public void setIndigenous(String indigenous) {
        Indigenous = indigenous;
    }

    public String getOccupation() {
        return Occupation;
    }

    public void setOccupation(String occupation) {
        Occupation = occupation;
    }

    public String getAddress1() {
        return Address1;
    }

    public void setAddress1(String address1) {
        Address1 = address1;
    }

    public String getAddress2() {
        return Address2;
    }

    public void setAddress2(String address2) {
        Address2 = address2;
    }

    public String getPostcode() {
        return Postcode;
    }

    public void setPostcode(String postcode) {
        Postcode = postcode;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String suburb) {
        Suburb = suburb;
    }

    public String getState() {
        return State;
    }

    public void setState(String state) {
        State = state;
    }

    public String getCountryID1() {
        return CountryID1;
    }

    public void setCountryID1(String countryID1) {
        CountryID1 = countryID1;
    }

    public String getCountryID2() {
        return CountryID2;
    }

    public void setCountryID2(String countryID2) {
        CountryID2 = countryID2;
    }

    public String getEmail1() {
        return Email1;
    }

    public void setEmail1(String email1) {
        Email1 = email1;
    }

    public String getEmail2() {
        return Email2;
    }

    public void setEmail2(String email2) {
        Email2 = email2;
    }

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String homePhoneNumber) {
        HomePhoneNumber = homePhoneNumber;
    }

    public String getWorkPhoneNumber() {
        return WorkPhoneNumber;
    }

    public void setWorkPhoneNumber(String workPhoneNumber) {
        WorkPhoneNumber = workPhoneNumber;
    }

    public String getFaxNumber() {
        return FaxNumber;
    }

    public void setFaxNumber(String faxNumber) {
        FaxNumber = faxNumber;
    }

    public String getInterpreterRequired() {
        return InterpreterRequired;
    }

    public void setInterpreterRequired(String interpreterRequired) {
        InterpreterRequired = interpreterRequired;
    }

    public String getInterperterLanguage() {
        return InterperterLanguage;
    }

    public void setInterperterLanguage(String interperterLanguage) {
        InterperterLanguage = interperterLanguage;
    }

    public String getOtherSpecialNeed() {
        return OtherSpecialNeed;
    }

    public void setOtherSpecialNeed(String otherSpecialNeed) {
        OtherSpecialNeed = otherSpecialNeed;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
    }

    public String getEducation() {
        return Education;
    }

    public void setEducation(String education) {
        Education = education;
    }

    public String getSignature() {
        return Signature;
    }

    public void setSignature(String signature) {
        Signature = signature;
    }

    public String getCreatedDate() {
        return CreatedDate;
    }

    public void setCreatedDate(String createdDate) {
        CreatedDate = createdDate;
    }

    public String getCreatedBy() {
        return CreatedBy;
    }

    public void setCreatedBy(String createdBy) {
        CreatedBy = createdBy;
    }

    public String getModifiedDate() {
        return ModifiedDate;
    }

    public void setModifiedDate(String modifiedDate) {
        ModifiedDate = modifiedDate;
    }

    public String getModifiedBy() {
        return ModifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        ModifiedBy = modifiedBy;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(ID);
        dest.writeString(UID);
        dest.writeString(UserAccountID);
        dest.writeString(Title);
        dest.writeString(MaritalStatus);
        dest.writeString(FirstName);
        dest.writeString(MiddleName);
        dest.writeString(LastName);
        dest.writeString(PreferredName);
        dest.writeString(PreviousName);
        dest.writeString(DOB);
        dest.writeString(Gender);
        dest.writeString(Indigenous);
        dest.writeString(Occupation);
        dest.writeString(Address1);
        dest.writeString(Address2);
        dest.writeString(Postcode);
        dest.writeString(Suburb);
        dest.writeString(State);
        dest.writeString(CountryID1);
        dest.writeString(CountryID2);
        dest.writeString(Email1);
        dest.writeString(Email2);
        dest.writeString(HomePhoneNumber);
        dest.writeString(FaxNumber);
        dest.writeString(WorkPhoneNumber);
        dest.writeString(InterpreterRequired);
        dest.writeString(InterperterLanguage);
        dest.writeString(OtherSpecialNeed);
        dest.writeString(Enable);
        dest.writeString(Education);
        dest.writeString(Signature);
        dest.writeString(CreatedDate);
        dest.writeString(CreatedBy);
        dest.writeString(ModifiedDate);
        dest.writeString(ModifiedBy);
    }

    public ModelStaff(Parcel in) {
        ID = in.readString();
        UID = in.readString();
        UserAccountID = in.readString();
        Title = in.readString();
        MaritalStatus = in.readString();
        FirstName = in.readString();
        MiddleName = in.readString();
        LastName = in.readString();
        PreferredName = in.readString();
        PreviousName = in.readString();
        DOB = in.readString();
        Gender = in.readString();
        Indigenous = in.readString();
        Occupation = in.readString();
        Address1 = in.readString();
        Address2 = in.readString();
        Postcode = in.readString();
        Suburb = in.readString();
        State = in.readString();
        CountryID1 = in.readString();
        CountryID2 = in.readString();
        Email1 = in.readString();
        Email2 = in.readString();
        HomePhoneNumber = in.readString();
        FaxNumber = in.readString();
        WorkPhoneNumber = in.readString();
        InterpreterRequired = in.readString();
        InterperterLanguage = in.readString();
        OtherSpecialNeed = in.readString();
        Enable = in.readString();
        Education = in.readString();
        Signature = in.readString();
        CreatedDate = in.readString();
        CreatedBy = in.readString();
        ModifiedDate = in.readString();
        ModifiedBy = in.readString();
    }

    public static final Parcelable.Creator<ModelStaff> CREATOR = new Creator<ModelStaff>() {
        @Override
        public ModelStaff createFromParcel(Parcel source) {
            return new ModelStaff(source);
        }

        @Override
        public ModelStaff[] newArray(int size) {
            return new ModelStaff[size];
        }

    };
}
