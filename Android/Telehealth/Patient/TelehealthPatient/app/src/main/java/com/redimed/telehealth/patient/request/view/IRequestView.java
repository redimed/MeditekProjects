package com.redimed.telehealth.patient.request.view;

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
    void onLoadSuburb(String[] suburbs);
    void onResultSuburb(boolean suburb);
    void onLoadData(Patient[] patients);
    void onResultField(EditText editText);
    void onLoadGallery(ArrayList<CustomGallery> customGalleries);
}
