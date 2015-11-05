package com.redimed.urgentcare.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by phanq on 09/22/2015.
 */
public class UrgentRequestModel {

    public String firstName;
    public String lastName;
    @SerializedName("phoneNumber")
    public String contactPhone;
    public String suburb;
    public String requestDate;
    public String DOB;
    public String email;
    public String description;
    @SerializedName("GPReferral")
    public String gpReferral;
    public String physiotherapy;
    public String specialist;
    public String handTherapy;
    public String GP;
    @SerializedName("urgentRequestType")
    public String serviceType;
    public String companyName;
    public String contactPerson;
    @SerializedName("companyPhoneNumber")
    public String companyPhone;

    public void setPhysiotherapy(String physiotherapy) {
        this.physiotherapy = physiotherapy;
    }

    public void setSpecialist(String specialist) {
        this.specialist = specialist;
    }

    public void setHandTherapy(String handTherapy) {
        this.handTherapy = handTherapy;
    }

    public void setGP(String GP) {
        this.GP = GP;
    }

    public void setCompanyPhone(String companyPhone) {
        this.companyPhone = companyPhone;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public void setSuburb(String suburb) {
        this.suburb = suburb;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setGpReferral(String gpReferral) {
        this.gpReferral = gpReferral;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }
}
