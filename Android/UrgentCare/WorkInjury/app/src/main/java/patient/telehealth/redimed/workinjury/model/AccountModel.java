package patient.telehealth.redimed.workinjury.model;

/**
 * Created by phanq on 04/13/2016.
 */
public class AccountModel {
    private String ID;
    private String UID;
    private String UserName;
    private String Email;
    private String PhoneNumber;
    private String Activated;
    private String Enable;
    private String UserType;
    private String Token;
    private String TokenExpired;
    private String CreatedBy;
    private String ModifiedDate;
    private String ModifiedBy;

    public AccountModel(String ID, String UID) {
        this.ID = ID;
        this.UID = UID;
    }

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

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public String getActivated() {
        return Activated;
    }

    public void setActivated(String activated) {
        Activated = activated;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
    }

    public String getUserType() {
        return UserType;
    }

    public void setUserType(String userType) {
        UserType = userType;
    }

    public String getToken() {
        return Token;
    }

    public void setToken(String token) {
        Token = token;
    }

    public String getTokenExpired() {
        return TokenExpired;
    }

    public void setTokenExpired(String tokenExpired) {
        TokenExpired = tokenExpired;
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
}
