package com.redimed.telehealth.patient.information.presenter;

import android.net.Uri;
import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.EditText;

import com.redimed.telehealth.patient.views.SignaturePad;

import java.util.ArrayList;

/**
 * Created by Fox on 1/14/2016.
 */
public interface IInfoPresenter {

    ArrayAdapter loadJsonSuburb();

    ArrayAdapter loadJsonCountry();

    void loadAvatar(String url);

    void displayDatePickerDialog();

    void getInfoPatient(String uid);

    Uri getOutputMediaFileUri(int type);

    void hideKeyboardFragment(View view);

    void downloadSignature(String url);

    void changeFragment(Fragment fragment);

    void saveBitmapSign(SignaturePad signaturePad);

    void updateProfile(ArrayList<EditText> arrEditText, String suburb, String country);

}
