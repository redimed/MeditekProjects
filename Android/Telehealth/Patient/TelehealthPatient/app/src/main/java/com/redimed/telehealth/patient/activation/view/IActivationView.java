package com.redimed.telehealth.patient.activation.view;

import android.view.View;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public interface IActivationView {
    void onValidate(String result);
    void onRequestCode();
    void onLogin();
    void onLoadError(String msg);
}
