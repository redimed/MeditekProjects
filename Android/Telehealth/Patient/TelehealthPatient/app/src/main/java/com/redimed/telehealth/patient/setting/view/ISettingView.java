package com.redimed.telehealth.patient.setting.view;

import com.redimed.telehealth.patient.models.Patient;

/**
 * Created by Fox on 1/15/2016.
 */
public interface ISettingView {

    void onLoadError(String msg);

    void displayShortInfo(Patient[] patients);

}
