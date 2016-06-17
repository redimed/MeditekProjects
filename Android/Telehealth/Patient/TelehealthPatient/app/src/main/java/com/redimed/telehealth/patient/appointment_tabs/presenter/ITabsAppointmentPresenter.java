package com.redimed.telehealth.patient.appointment_tabs.presenter;

import android.support.v4.app.Fragment;
import android.support.v7.widget.Toolbar;

/**
 * Created by MeditekMini on 6/1/16.
 */
public interface ITabsAppointmentPresenter {

    void initToolbar(Toolbar toolbar);

    void changeFragment(Fragment fragment);

    void getAppointmentDetails(String uidAppt);

}
