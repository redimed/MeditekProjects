package com.redimed.telehealth.patient.appointment.presenter;

import android.support.v4.app.Fragment;

/**
 * Created by Fox on 1/19/2016.
 */
public interface IAppointmentPresenter {

    void viewStatus();

    void changeFragment(Fragment fragment);

    void getAppointmentDetails(String appointmentUID);

}
