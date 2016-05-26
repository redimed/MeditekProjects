package com.redimed.telehealth.patient.setting.presenter;

import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/15/2016.
 */
public interface ISettingPresenter {

    void displayAbout();

    void logout(String uid);

    void displayPin(String uid);

    void initToolbar(Toolbar toolBar);

    void getInfoPatient(String teleUID);

    void changeFragment(Fragment fragment);

    void displayInfoPatient(String teleUID);

}
