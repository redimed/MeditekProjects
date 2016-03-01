package com.redimed.telehealth.patient.request.view;

import android.graphics.Bitmap;
import android.widget.ArrayAdapter;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.Patient;

import java.util.ArrayList;

/**
 * Created by Fox on 1/22/2016.
 */
public interface IRequestView {
    void onLoadToolbar();
    void onLoadDOB(String dob);
    void onErrorUpload(String msg);
    void onResultRequest(String msg);
    void onResultEmail(boolean email);
    void onResultMobile(boolean phone);
    void onResultSuburb(boolean suburb);
    void onResultApptType(boolean apptType);
    void onLoadSignature(Bitmap bitmap);
    void onLoadGallery(ArrayList<CustomGallery> customGalleries);

    void onResultField(EditText editText);
}
