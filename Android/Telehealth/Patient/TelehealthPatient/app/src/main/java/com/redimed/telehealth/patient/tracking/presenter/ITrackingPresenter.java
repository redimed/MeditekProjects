package com.redimed.telehealth.patient.tracking.presenter;

import android.support.v4.app.Fragment;

import com.redimed.telehealth.patient.models.Appointment;

import java.util.List;

/**
 * Created by Fox on 1/18/2016.
 */
public interface ITrackingPresenter {

    void getListAppointment(int offset);

    void changeFragment(Fragment fragment);

    void getListMoreAppointment(int offset);

    void setProgressBarVisibility(int visibility);

}
