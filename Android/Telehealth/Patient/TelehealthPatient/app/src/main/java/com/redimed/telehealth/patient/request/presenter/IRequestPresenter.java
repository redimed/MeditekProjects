package com.redimed.telehealth.patient.request.presenter;

import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

/**
 * Created by Fox on 1/22/2016.
 */
public interface IRequestPresenter {
    ArrayAdapter loadJsonData();
    ArrayAdapter<String> setDataApptType();
    Patient[] loadDataInfoExists();
    void displayDatePickerDialog();
    void hideKeyboardFragment(View v);
    void setImageGallery(String[] allPath);
    void changeFragment(Fragment fragment);
    void uploadImage(ArrayList<CustomGallery> customGalleries, ArrayList<EditText> arrEditText, String suburb, String apptType);

    void saveBitmapSign(SignaturePad signaturePad);

    EditText checkDataField(View v);
}
