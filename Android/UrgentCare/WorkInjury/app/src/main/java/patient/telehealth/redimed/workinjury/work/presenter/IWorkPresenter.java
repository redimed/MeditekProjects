package patient.telehealth.redimed.workinjury.work.presenter;

import android.os.Bundle;

import org.jdeferred.Promise;

import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentPatient;

/**
 * Created by PhanQuocChien on 6/27/16.
 */
public interface IWorkPresenter {
    Promise LoadJsonData();
    Promise MakeAppointmentCompany(ModelAppointmentCompany modelAppointmentCompany);
    Promise MakeAppointmentPatient(ModelAppointmentPatient modelAppointmentPatient);
    void LoadSiteData(Bundle bundle);
    void LoadStaffData(Bundle bundle);
}
