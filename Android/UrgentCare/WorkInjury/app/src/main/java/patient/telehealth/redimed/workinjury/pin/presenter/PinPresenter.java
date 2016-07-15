package patient.telehealth.redimed.workinjury.pin.presenter;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import com.google.gson.JsonObject;

import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.pin.view.IPinView;
import patient.telehealth.redimed.workinjury.utils.Key;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PinPresenter implements IPinPresenter {

    private String TAG = Key.Pin.TAG;
    private IPinView iPinView;

    public PinPresenter(IPinView iPinView) {
        this.iPinView = iPinView;
    }

    @Override
    public EditText checkDataField(View v) {
        EditText invalid = null;
        if (v instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) v).getChildCount(); i++) {
                Object child = ((ViewGroup) v).getChildAt(i);
                if (child instanceof EditText) {
                    EditText e = (EditText) child;
                    if (e.getText().length() < 6) {    // Whatever logic here to determine if valid.
                        iPinView.onResultField(e);
                        return e;   // Stops at first invalid one. But you could add this to a list.
                    } else {
                        switch (e.getId()) {
                            case R.id.txtConfirmPin:
                                String newPin = ((EditText) v.findViewById(R.id.txtNewPin)).getText().toString();
                                String oldPin = ((EditText) v.findViewById(R.id.txtCurrentPin)).getText().toString();

                                if (!(e.getText().toString()).equalsIgnoreCase(newPin)) {
                                    iPinView.onLoadError(Key.Pin.pinNotMatch);
                                } else {
                                    Log.d(TAG, oldPin + " == " + newPin);
                                    updatePin(oldPin, newPin);
                                }
                                break;
                        }
                    }
                } else if (child instanceof ViewGroup) {
                    invalid = checkDataField((ViewGroup) child);  // Recursive call.
                    if (invalid != null) {
                        break;
                    }
                }
            }
        }
        return invalid;
    }

    private void updatePin(String oldPin, String newPin) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty(Key.Pin.oldpin, oldPin);
        jsonObject.addProperty(Key.Pin.newpin, newPin);

        RESTClient.getTelehealthApi().updatePin(jsonObject, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iPinView.onLoadSuccess();
            }

            @Override
            public void failure(RetrofitError error) {
                iPinView.onLoadError(error.getLocalizedMessage());
            }
        });
    }
}
