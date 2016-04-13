package patient.telehealth.redimed.workinjury.model;

import com.google.gson.annotations.SerializedName;

public class UrgentRequestModel {

    @SerializedName("firstName")
    private String FirstName;

    @SerializedName("lastName")
    private String LastName;

    @SerializedName("phoneNumber")
    private String ContactPhone;

    @SerializedName("suburb")
    private String Suburb;

    @SerializedName("requestDate")
    private String RequestDate;

    @SerializedName("DOB")
    private String DOB;

    @SerializedName("email")
    private String email;

    @SerializedName("description")
    private String Description;

    @SerializedName("GPReferral")
    private String GPReferral;

    @SerializedName("physiotherapy")
    private String PhysioTherapy;

    @SerializedName("specialist")
    private String SpecialList;

    @SerializedName("handTherapy")
    private String HandTherapy;

    @SerializedName("treatment")
    private String Rehab;

    @SerializedName("exerciseRehab")
    private String ExerciseRehab;

    @SerializedName("GP")
    private String GeneralClinic;

    @SerializedName("urgentRequestType")
    private String UrgentRequestType;

    @SerializedName("companyName")
    private String CompanyName;

    @SerializedName("contactPerson")
    private String ContactPerson;

    @SerializedName("companyPhoneNumber")
    private String CompanyPhone;

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public String getContactPhone() {
        return ContactPhone;
    }

    public void setContactPhone(String contactPhone) {
        ContactPhone = contactPhone;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String suburb) {
        Suburb = suburb;
    }

    public String getRequestDate() {
        return RequestDate;
    }

    public void setRequestDate(String requestDate) {
        RequestDate = requestDate;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getGPReferral() {
        return GPReferral;
    }

    public void setGPReferral(String GPReferral) {
        this.GPReferral = GPReferral;
    }

    public String getPhysioTherapy() {
        return PhysioTherapy;
    }

    public void setPhysioTherapy(String physioTherapy) {
        PhysioTherapy = physioTherapy;
    }

    public String getSpecialList() {
        return SpecialList;
    }

    public void setSpecialList(String specialList) {
        SpecialList = specialList;
    }

    public String getHandTherapy() {
        return HandTherapy;
    }

    public void setHandTherapy(String handTherapy) {
        HandTherapy = handTherapy;
    }

    public String getRehab() {
        return Rehab;
    }

    public void setRehab(String rehab) {
        Rehab = rehab;
    }

    public String getExerciseRehab() {
        return ExerciseRehab;
    }

    public void setExerciseRehab(String exerciseRehab) {
        ExerciseRehab = exerciseRehab;
    }

    public String getUrgentRequestType() {
        return UrgentRequestType;
    }

    public void setUrgentRequestType(String urgentRequestType) {
        UrgentRequestType = urgentRequestType;
    }

    public String getCompanyName() {
        return CompanyName;
    }

    public void setCompanyName(String companyName) {
        CompanyName = companyName;
    }

    public String getContactPerson() {
        return ContactPerson;
    }

    public void setContactPerson(String contactPerson) {
        ContactPerson = contactPerson;
    }

    public String getCompanyPhone() {
        return CompanyPhone;
    }

    public void setCompanyPhone(String companyPhone) {
        CompanyPhone = companyPhone;
    }

    public String getGeneralClinic() {
        return GeneralClinic;
    }

    public void setGeneralClinic(String generalClinic) {
        GeneralClinic = generalClinic;
    }
}
