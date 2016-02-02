package com.redimed.telehealth.patient.request.presenter;

import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.EditText;

import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

/**
 * Created by Fox on 1/22/2016.
 */
public interface IRequestPresenter {
    void loadJsonData();
    void loadDataInfoExists();
    void displayDatePickerDialog();
    void hideKeyboardFragment(View v);
    void setImageGallery(String[] allPath);
    void changeFragment(Fragment fragment);
    EditText checkDataField(View v);
    void uploadImage(ArrayList<CustomGallery> customGalleries, ArrayList<EditText> arrEditText, String suburb);
}
