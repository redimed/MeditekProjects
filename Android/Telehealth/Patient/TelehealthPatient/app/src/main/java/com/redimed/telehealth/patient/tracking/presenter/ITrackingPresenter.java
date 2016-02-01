package com.redimed.telehealth.patient.tracking.presenter;

import android.support.v4.app.Fragment;

/**
 * Created by Fox on 1/18/2016.
 */
public interface ITrackingPresenter {
    void getListAppointment();
    void changeFragment(Fragment fragment);
    void setProgressBarVisibility(int visibility);
}
