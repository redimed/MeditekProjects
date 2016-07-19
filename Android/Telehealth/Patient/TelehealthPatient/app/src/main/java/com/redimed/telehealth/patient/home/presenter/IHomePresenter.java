package com.redimed.telehealth.patient.home.presenter;


/**
 * Created by Fox on 1/14/2016.
 */
public interface IHomePresenter {

    void login();

    void getInfoPatient();

    void displaySetting();

    void displayRequest();

    void displayTracking();

    void checkExistsPatient();

    void createdJsonDataSuburb();

    void createdJsonDataCountry();

    void displayFAQs(String content);

}
