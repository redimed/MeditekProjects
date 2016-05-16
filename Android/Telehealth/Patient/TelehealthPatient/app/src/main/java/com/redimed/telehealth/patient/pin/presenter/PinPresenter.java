package com.redimed.telehealth.patient.pin.presenter;

import android.app.Activity;
import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.pin.view.IPinView;

import java.util.ArrayList;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PinPresenter implements IPinPresenter {

    private Context context;
    private IPinView iPinView;
    private RegisterApi restClient;
    private IMainPresenter iMainPresenter;
    private static final String TAG = "=====PIN_PRESENTER=====";

    public PinPresenter(IPinView iPinView, Context context, FragmentActivity activity) {
        this.context = context;
        this.iPinView = iPinView;

        restClient = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public void hideKeyboardFragment(View view) {
        //Set up touch listener for non-text box views to hide keyboard.
        if (!(view instanceof EditText)) {
            view.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    InputMethodManager inputMethodManager = (InputMethodManager)
                            context.getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(((Activity) context).getCurrentFocus().getWindowToken(), 0);
                    return false;
                }
            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                hideKeyboardFragment(innerView);
            }
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
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
                                    iPinView.onLoadError("Your Pin are not match");
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
        jsonObject.addProperty("oldpin", oldPin);
        jsonObject.addProperty("newpin", newPin);

        restClient.updatePin(jsonObject, new Callback<JsonObject>() {
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
