package com.redimed.telehealth.patient.tracking.presenter;

import android.support.v4.app.Fragment;

import com.redimed.telehealth.patient.models.Appointment;

import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * Created by Fox on 1/18/2016.
 */
public interface ITrackingPresenter {

    List<Appointment> getListAppointment(int offset);

    void changeFragment(Fragment fragment);

    void setProgressBarVisibility(int visibility);

}
