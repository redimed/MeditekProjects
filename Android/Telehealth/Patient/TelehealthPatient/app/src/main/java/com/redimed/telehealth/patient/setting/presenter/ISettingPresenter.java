package com.redimed.telehealth.patient.setting.presenter;

import android.support.v4.app.Fragment;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/15/2016.
 */
public interface ISettingPresenter {

    void displayAbout();

    void logout(String uid);

    void displayInfoPatient(String teleUID);

    void changeFragment(Fragment fragment);

    void getInfoPatient(String dataPatient);

}
