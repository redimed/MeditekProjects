package com.redimed.telehealth.patient.sign_in.presenter;

import android.support.v4.app.Fragment;
import android.view.View;

/**
 * Created by Fox on 3/24/2016.
 */
public interface ISignInPresenter {

    void hideKeyboardFragment(View v);

    void requestCode(String phoneNumber);

    void changeFragment(Fragment fragment);

    void validatedPhone(String phoneNumber);
}
