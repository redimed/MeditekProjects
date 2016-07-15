package patient.telehealth.redimed.workinjury.pin.view;

import android.widget.EditText;

/**
 * Created by MeditekPro on 5/12/16.
 */
public interface IPinView {

    void onLoadSuccess();

    void onLoadError(String msg);

    void onResultField(EditText editText);

}
