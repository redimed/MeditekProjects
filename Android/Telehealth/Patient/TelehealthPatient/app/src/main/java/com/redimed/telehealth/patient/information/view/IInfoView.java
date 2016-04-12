package com.redimed.telehealth.patient.information.view;

import android.graphics.Bitmap;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoView {

    void onReload();

    void onLoadToolbar();

    void onLoadDOB(String dob);

    void onLoadError(String msg);

    void onLoadAvatar(Bitmap bitmap);

    void onResultEmail(boolean email);

    void displayInfo(Patient[] patient);

    void onResultField(EditText editText);

//    void onResultSignature(Bitmap bitmap);

    void onLoadSignature(Bitmap bitmap, String pathSign);
}
