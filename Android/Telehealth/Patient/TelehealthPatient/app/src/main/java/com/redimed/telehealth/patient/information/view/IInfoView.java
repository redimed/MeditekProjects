package com.redimed.telehealth.patient.information.view;

import android.graphics.Bitmap;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoView {
    void displayInfo(Patient[] patient);
    void onLoadAvatar(Bitmap bitmap);
    void onLoadToolbar();
    void onLoadError(String msg);
    void onResultField(EditText editText);
    void onResultEmail(boolean email);
    void onLoadSignature(Bitmap bitmap);
    void onResultUpload(String msg);
}
