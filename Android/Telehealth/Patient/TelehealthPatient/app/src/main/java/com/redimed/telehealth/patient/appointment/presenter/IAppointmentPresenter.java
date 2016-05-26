package com.redimed.telehealth.patient.appointment.presenter;

import android.net.Uri;
import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;

import com.google.gson.JsonObject;

/**
 * Created by Fox on 1/19/2016.
 */
public interface IAppointmentPresenter {

    Uri getOutputMediaFileUri(int type);

    void viewStatus();

    void initToolbar(Toolbar toolbar);

    void changeFragment(Fragment fragment);

    void getListImage(JsonObject jsonObject);

    void getAppointmentDetails(String appointmentUID);

}
