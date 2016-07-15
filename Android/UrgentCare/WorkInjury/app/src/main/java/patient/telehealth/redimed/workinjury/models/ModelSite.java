package patient.telehealth.redimed.workinjury.models;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by phanq on 04/13/2016.
 */
public class ModelSite implements Parcelable {
    private String ID;
    private String UID;
    private String CompanyID;
    private String SiteName;
    private String Address1;
    private String Address2;
    private String Postcode;
    private String Suburb;
    private String State;
    private String Country;
    private String Email;
    private String HomePhoneNumber;
    private String FaxNumber;
    private String ContactName;
    private String Enable;
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

    public String getCompanyID() {
        return CompanyID;
    }

    public void setCompanyID(String companyID) {
        CompanyID = companyID;
    }

    public String getSiteName() {
        return SiteName;
    }

    public void setSiteName(String siteName) {
        SiteName = siteName;
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

    public String getCountry() {
        return Country;
    }

    public void setCountry(String country) {
        Country = country;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String homePhoneNumber) {
        HomePhoneNumber = homePhoneNumber;
    }

    public String getFaxNumber() {
        return FaxNumber;
    }

    public void setFaxNumber(String faxNumber) {
        FaxNumber = faxNumber;
    }

    public String getContactName() {
        return ContactName;
    }

    public void setContactName(String contactName) {
        ContactName = contactName;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
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
        dest.writeString(CompanyID);
        dest.writeString(SiteName);
        dest.writeString(Address1);
        dest.writeString(Address2);
        dest.writeString(Postcode);
        dest.writeString(Suburb);
        dest.writeString(State);
        dest.writeString(Country);
        dest.writeString(Email);
        dest.writeString(HomePhoneNumber);
        dest.writeString(FaxNumber);
        dest.writeString(ContactName);
        dest.writeString(Enable);
        dest.writeString(CreatedDate);
        dest.writeString(CreatedBy);
        dest.writeString(ModifiedDate);
        dest.writeString(ModifiedBy);
    }

    public ModelSite(Parcel in){
        ID = in.readString();
        UID = in.readString();
        CompanyID = in.readString();
        SiteName = in.readString();
        Address1 = in.readString();
        Address2 = in.readString();
        Postcode = in.readString();
        Suburb = in.readString();
        State = in.readString();
        Country = in.readString();
        Email = in.readString();
        HomePhoneNumber = in.readString();
        FaxNumber = in.readString();
        ContactName = in.readString();
        Enable = in.readString();
        CreatedDate = in.readString();
        CreatedBy = in.readString();
        ModifiedDate = in.readString();
        ModifiedBy = in.readString();
    }

    public static final Parcelable.Creator<ModelSite> CREATOR = new Creator<ModelSite>() {
        @Override
        public ModelSite createFromParcel(Parcel source) {
            return new ModelSite(source);
        }

        @Override
        public ModelSite[] newArray(int size) {
            return new ModelSite[size];
        }

    };
}
