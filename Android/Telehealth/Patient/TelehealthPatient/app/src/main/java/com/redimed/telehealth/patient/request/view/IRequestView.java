package com.redimed.telehealth.patient.request.view;

import android.content.Intent;
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

    void onFieldOk();

    void onLoadToolbar();

    void onLoadDOB(String dob);

    void onLoadSign(Bitmap bitmap);

    void onResultEmail(boolean email);

    void onResultMobile(boolean phone);

    void startActivityResult(Intent i);

    void onResultSuburb(boolean suburb);

    void onLoadSignature(Bitmap bitmap);

    void onResultField(EditText editText);

    void onResultApptType(boolean apptType);

    void onLoadGallery(ArrayList<CustomGallery> customGalleries);
}
