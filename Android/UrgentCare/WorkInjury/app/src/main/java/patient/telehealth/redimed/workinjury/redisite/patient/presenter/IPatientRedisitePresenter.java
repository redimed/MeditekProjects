package patient.telehealth.redimed.workinjury.redisite.patient.presenter;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.View;
import android.widget.ArrayAdapter;

/**
 * Created by MeditekMini on 6/9/16.
 */
public interface IPatientRedisitePresenter {

    void changeFragment(Fragment fragment);

    /* Return value */
    ArrayAdapter loadSuburb();

    ArrayAdapter<String> getListSalutation();

    boolean validatedAllElement(View view, String salutation);

    void LoadSiteData(Bundle bundle);
    void LoadStaffData(Bundle bundle);
}
