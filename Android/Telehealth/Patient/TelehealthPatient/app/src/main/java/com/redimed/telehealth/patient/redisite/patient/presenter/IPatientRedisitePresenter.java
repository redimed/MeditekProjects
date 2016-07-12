package com.redimed.telehealth.patient.redisite.patient.presenter;

import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.EditText;

import java.util.ArrayList;

/**
 * Created by MeditekMini on 6/9/16.
 */
public interface IPatientRedisitePresenter {

    void displayDatePickerDialog();

    void hideKeyboardFragment(View view);

    void changeFragment(Fragment fragment);

    /* Return value */
    ArrayAdapter loadSuburb();

    ArrayAdapter<String> getListSalutation();

    boolean validatedAllElement(View view, String salutation);

}
