package com.redimed.telehealth.patient.appointment_tabs.view;

import java.util.ArrayList;

/**
 * Created by MeditekMini on 6/1/16.
 */
public interface ITabsAppointmentView {

    void onLoadError(String msg);

    void onLoadSuccess(ArrayList<String> listImage);
}
