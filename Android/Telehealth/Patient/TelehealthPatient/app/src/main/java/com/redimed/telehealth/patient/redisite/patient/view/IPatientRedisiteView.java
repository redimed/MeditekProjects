package com.redimed.telehealth.patient.redisite.patient.view;

import android.widget.EditText;

/**
 * Created by MeditekMini on 6/9/16.
 */
public interface IPatientRedisiteView {

    void onLoadErrorSpinner();

    void onLoadDOB(String dob);

    void onLoadExpiry(String expiry);

    void onLoadErrorField(EditText editText);

}
