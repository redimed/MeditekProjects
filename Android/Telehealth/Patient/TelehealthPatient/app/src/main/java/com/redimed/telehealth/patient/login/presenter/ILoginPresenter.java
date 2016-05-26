package com.redimed.telehealth.patient.login.presenter;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;
import android.view.View;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public interface ILoginPresenter {

    void initToolbar(Toolbar toolbar);

    void hideKeyboardFragment(View v);

    void changeFragment(Fragment fragment);

    void verifyLogin(Bundle bundle, String code);

}
