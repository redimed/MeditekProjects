package com.redimed.telehealth.patient.pin.presenter;

import android.support.v4.app.Fragment;
import android.text.Editable;
import android.view.View;
import android.widget.EditText;

import java.util.ArrayList;

/**
 * Created by MeditekPro on 5/12/16.
 */
public interface IPinPresenter {

    EditText checkDataField(View v);

    void hideKeyboardFragment(View v);

    void changeFragment(Fragment fragment);

}
