package com.redimed.telehealth.patient.sign_in.view;

/**
 * Created by Fox on 3/24/2016.
 */
public interface ISignInView {

    void onLoadError(String msg);

    void onValidated(String result);

}
