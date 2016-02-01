package com.redimed.telehealth.patient.activation.presenter;

import android.support.v4.app.Fragment;
import android.view.View;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public interface IActivationPresenter {
    void validatedPhone(String code, String phoneNumber);
    void requestCode(String phoneNumber);
    void verifyCode(String verifyCode);
    void changeFragment(Fragment fragment);
    void hideKeyboardFragment(View v);
}
