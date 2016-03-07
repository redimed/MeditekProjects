package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.widget.CheckBox;

import java.util.ArrayList;

/**
 * Created by Fox on 3/2/2016.
 */
public interface IConfirmPresenter {

    String getCurrentDateSystem();

    void changeFragment(Fragment fragment);

    void completeRequest(Intent i, ArrayList<String> fileUploads, String currentDate);

    boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3);
}
