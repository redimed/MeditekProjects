package patient.telehealth.redimed.workinjury.redisite.injury.presenter;

import android.support.v4.app.Fragment;
import android.view.View;

/**
 * Created by MeditekMini on 6/13/16.
 */
public interface IInjuryPresenter {

    void displayDatePickerDialog();

    void hideKeyboardFragment(View view);

    void changeFragment(Fragment fragment);
}
