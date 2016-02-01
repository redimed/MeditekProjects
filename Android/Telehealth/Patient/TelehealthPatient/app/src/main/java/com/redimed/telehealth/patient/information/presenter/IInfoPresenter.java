package com.redimed.telehealth.patient.information.presenter;

import android.support.v4.app.Fragment;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoPresenter {
    void getInfoPatient(String uid);
    void loadAvatar(String url);
    void changeFragment(Fragment fragment);
}
