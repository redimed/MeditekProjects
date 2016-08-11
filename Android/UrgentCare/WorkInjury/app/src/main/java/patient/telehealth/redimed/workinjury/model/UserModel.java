package patient.telehealth.redimed.workinjury.model;

/**
 * Created by MeditekMini on 4/21/16.
 */
public class UserModel {
    private String ID;
    private String UID;
    private String UserName;
    private String Activated;
    private RolesModel[] roles;
    private TelehealthUserModel TelehealthUser;

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

    public String getActivated() {
        return Activated;
    }

    public void setActivated(String activated) {
        Activated = activated;
    }

    public TelehealthUserModel getTelehealthUser() {
        return TelehealthUser;
    }

    public void setTelehealthUser(TelehealthUserModel telehealthUser) {
        TelehealthUser = telehealthUser;
    }

    public RolesModel[] getRoles() {
        return roles;
    }

    public void setRoles(RolesModel[] roles) {
        this.roles = roles;
    }
}
