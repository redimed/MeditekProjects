package com.redimed.telehealth.patient.activation.view;

/**
 * Created by Fox on 3/24/2016.
 */
public interface ISignInView {

    void onLoadError(String msg);

    void onValidated(String result);

}
