package patient.telehealth.redimed.workinjury.work.view;

import patient.telehealth.redimed.workinjury.model.ModelCompany;
import patient.telehealth.redimed.workinjury.model.ModelPatient;

/**
 * Created by PhanQuocChien on 6/27/16.
 */
public interface IWorkView {
    void LoadSiteDetail(ModelCompany modelCompany);
    void LoadStaffDetail(ModelPatient modelPatient);
}
