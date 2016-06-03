package com.redimed.telehealth.patient.status_appointment.presenter;

import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;

/**
 * Created by Fox on 1/20/2016.
 */
public interface IStatusPresenter {

    void initToolbar(Toolbar toolbar);

    void changeFragment(Fragment fragment);
}
