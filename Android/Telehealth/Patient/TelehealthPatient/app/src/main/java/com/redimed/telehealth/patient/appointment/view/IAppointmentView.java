package com.redimed.telehealth.patient.appointment.view;

import com.google.gson.JsonObject;

/**
 * Created by Fox on 1/19/2016.
 */
public interface IAppointmentView {

    void onLoadError(String msg);

    void onLoadAppointment(JsonObject dataAppt);
}
