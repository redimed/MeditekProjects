package patient.telehealth.redimed.workinjury.model;

import com.google.gson.annotations.SerializedName;

public class UrgentRequestModel {

    @SerializedName("firstName")
    public String FirstName;

    @SerializedName("lastName")
    public String LastName;

    @SerializedName("phoneNumber")
    public String ContactPhone;

    @SerializedName("suburb")
    public String Suburb;

    @SerializedName("requestDate")
    public String RequestDate;

    @SerializedName("DOB")
    public String DOB;

    @SerializedName("email")
    public String email;

    @SerializedName("description")
    public String Description;

    @SerializedName("GPReferral")
    public String GPReferral;

    @SerializedName("physiotherapy")
    public String PhysioTherapy;

    @SerializedName("specialist")
    public String SpecialList;

    @SerializedName("handTherapy")
    public String HandTherapy;

    @SerializedName("rehab")
    public String Rehab;

    @SerializedName("GP")
    public String GeneralClinic;

    @SerializedName("urgentRequestType")
    public String ServiceType;

    @SerializedName("companyName")
    public String CompanyName;

    @SerializedName("contactPerson")
    public String ContactPerson;

    @SerializedName("companyPhoneNumber")
    public String CompanyPhone;

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

    public String getServiceType() {
        return ServiceType;
    }

    public void setServiceType(String serviceType) {
        ServiceType = serviceType;
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
