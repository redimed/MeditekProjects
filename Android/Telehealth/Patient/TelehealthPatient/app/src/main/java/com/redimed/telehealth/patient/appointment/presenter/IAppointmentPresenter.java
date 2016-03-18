package com.redimed.telehealth.patient.appointment.presenter;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.Fragment;

import com.google.gson.JsonObject;

/**
 * Created by Fox on 1/19/2016.
 */
public interface IAppointmentPresenter {

    Uri getOutputMediaFileUri(int type);

    void changeFragment(Fragment fragment);

    void getListImage(JsonObject jsonObject);

    void viewStatus(String status, String apptTime);

    void getAppointmentDetails(String appointmentUID);

}
