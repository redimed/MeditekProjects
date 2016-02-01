package com.redimed.telehealth.patient.tracking.view;

import com.redimed.telehealth.patient.models.Appointment;

import java.util.List;

/**
 * Created by Fox on 1/18/2016.
 */
public interface ITrackingView {
    void onLoadListAppt(List<Appointment> data);
    void onLoadToolbar();
    void onSetProgressBarVisibility(int visibility);
    void onLoadError(String msg);
}
