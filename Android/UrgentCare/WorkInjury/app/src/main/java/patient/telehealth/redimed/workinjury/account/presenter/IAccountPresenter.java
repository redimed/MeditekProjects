package patient.telehealth.redimed.workinjury.account.presenter;

import org.jdeferred.Promise;

import patient.telehealth.redimed.workinjury.models.ModelAccount;

/**
 * Created by MeditekMini on 6/15/16.
 */
public interface IAccountPresenter {
    void getAccountInfo();
    Promise UpdatePatientInfo(ModelAccount modelPatient);
}
