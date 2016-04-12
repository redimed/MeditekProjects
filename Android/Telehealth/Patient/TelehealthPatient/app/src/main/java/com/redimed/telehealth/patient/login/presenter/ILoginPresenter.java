package com.redimed.telehealth.patient.login.presenter;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.View;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public interface ILoginPresenter {

    void verifyLogin(Bundle bundle, String code);

    void hideKeyboardFragment(View v);

//    void verifyCode(String verifyCode);

//    void requestCode(String phoneNumber);

    void changeFragment(Fragment fragment);

//    void validatedPhone(String code, String phoneNumber);

}
