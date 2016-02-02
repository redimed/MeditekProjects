package com.redimed.telehealth.patient.home.presenter;


import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IHomePresenter {
    void createJsonDataSuburb();
    void checkExistsPatient();
    void login();
    void getInfoPatient();
    void displayRequest();
    void displayTracking();
    void displaySetting();
    void displayFAQs(String content);
}
