package com.redimed.telehealth.patient.redisite.patient.presenter;

import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;

/**
 * Created by MeditekMini on 6/9/16.
 */
public interface IPatientRedisitePresenter {

    void displayDatePickerDialog();

    void hideKeyboardFragment(View view);

    void changeFragment(Fragment fragment);

    ArrayAdapter loadSuburb();

    ArrayAdapter<String> getListSalutation();

}
