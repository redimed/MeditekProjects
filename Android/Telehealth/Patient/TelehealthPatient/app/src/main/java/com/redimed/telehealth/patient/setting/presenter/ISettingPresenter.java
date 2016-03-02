package com.redimed.telehealth.patient.setting.presenter;

import android.support.v4.app.Fragment;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/15/2016.
 */
public interface ISettingPresenter {
    void getInfoPatient(String dataPatient);
    void displayInfoPatient(String teleUID);
    void changeFragment(Fragment fragment);
    void displayAbout();
    void logout();
}
