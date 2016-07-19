package com.redimed.telehealth.patient.request.presenter;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
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

    String getCurrentDateSystem();

    Patient[] loadDataInfoExists();

    ArrayAdapter<String> setDataApptType();

    void returnData(Bundle bundle);

    void getValueSign(String sign);

    void displayDatePickerDialog();

    void uploadNonLogin(String path);

    void hideKeyboardFragment(View v);

    void setImageGallery(String[] allPath);

    void changeFragment(Fragment fragment);

    void saveBitmapSign(SignaturePad signaturePad);

    void displayFAQs(ArrayList<CustomGallery> customGalleries);

    void completeRequest(ArrayList<CustomGallery> customGalleries);

    void checkFields(ArrayList<EditText> arrEditText, String suburb, String apptType);

    boolean isCheckPatientConsent(CheckBox checkBox1, CheckBox checkBox2, CheckBox checkBox3);
}