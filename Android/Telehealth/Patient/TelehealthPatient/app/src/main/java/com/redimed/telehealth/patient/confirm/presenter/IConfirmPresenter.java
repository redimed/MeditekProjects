package com.redimed.telehealth.patient.confirm.presenter;

import android.content.Intent;
import android.support.v4.app.Fragment;
import android.widget.CheckBox;
import android.widget.ProgressBar;

import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

/**
 * Created by Fox on 3/2/2016.
 */
public interface IConfirmPresenter {

    void loadSignature(String url);

    String getCurrentDateSystem();

    void uploadNonLogin(String path);

    void saveBitmapSign(SignaturePad signaturePad);

    void completeRequest(Intent i, ArrayList<String> fileUploads, String currentDate);

    boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3);
}
