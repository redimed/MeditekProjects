package patient.telehealth.redimed.workinjury.redisite.patient.view;

import android.widget.EditText;

import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;

/**
 * Created by MeditekMini on 6/9/16.
 */
public interface IPatientRedisiteView {

    void onLoadErrorSpinner();

    //void onLoadDOB(String dob);

    //void onLoadExpiry(String expiry);

    void onLoadErrorField(EditText editText);

    void LoadSiteDetail(ModelCompany modelCompany);
    void LoadStaffDetail(ModelPatient modelPatient);

}
