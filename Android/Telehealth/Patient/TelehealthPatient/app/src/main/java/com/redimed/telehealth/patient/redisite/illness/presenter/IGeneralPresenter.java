package com.redimed.telehealth.patient.redisite.illness.presenter;

import android.support.v4.app.Fragment;
import android.view.View;

/**
 * Created by MeditekMini on 6/15/16.
 */
public interface IGeneralPresenter {

    void displayDatePickerDialog();

    void changeFragment(Fragment fragment);

    boolean validatedAllElement(View view);
}
