package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.widget.CheckBox;
import android.widget.ProgressBar;

import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

/**
 * Created by Fox on 3/2/2016.
 */
public interface IConfirmPresenter {

    void displayFAQs(Bundle bundle);

    void loadSignature(String url);

    String getCurrentDateSystem();

    void uploadNonLogin(String path);

    void changeFragment(Fragment fragment);

    void saveBitmapSign(SignaturePad signaturePad);

    void completeRequest(Bundle bundle, ArrayList<String> fileUploads, String currentDate);

    boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3);
}
