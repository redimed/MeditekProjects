package com.redimed.telehealth.patient.tracking.presenter;

import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;

import com.redimed.telehealth.patient.models.Appointment;

import java.util.List;

/**
 * Created by Fox on 1/18/2016.
 */
public interface ITrackingPresenter {

    void initToolbar(Toolbar toolbar);

    void changeFragment(Fragment fragment);

    void setProgressBarVisibility(int visibility);

    List<Appointment> getListAppointment(int offset);


}
