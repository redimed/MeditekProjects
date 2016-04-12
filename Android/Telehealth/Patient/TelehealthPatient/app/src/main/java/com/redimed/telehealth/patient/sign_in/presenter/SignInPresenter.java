package com.redimed.telehealth.patient.sign_in.presenter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.login.LoginFragment;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.services.RegistrationIntentService;
import com.redimed.telehealth.patient.sign_in.view.ISignInView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 3/24/2016.
 */
public class SignInPresenter implements ISignInPresenter {

    private Gson gson;
    private Bundle bundle;
    private Context context;
    private Fragment fragment;
    private RegisterApi registerApi;
    private ISignInView iSignInView;
    private SharedPreferences spDevice;
    private IMainPresenter iMainPresenter;
    private static final String TAG = "===SIGN_PRESENTER===";

    public SignInPresenter(Context context, ISignInView iSignInView, FragmentActivity activity) {
        this.context = context;
        this.iSignInView = iSignInView;

        gson = new Gson();
        iMainPresenter = new MainPresenter(context, activity);
        spDevice = context.getSharedPreferences("DeviceInfo", Context.MODE_PRIVATE);
    }

    @Override
    public void register(String phone) {
        String code = context.getResources().getString(R.string.phone_code);
        String resultPhone = convertPhone(code, phone);
        if (!resultPhone.equals("wrong")) {
            String isActivated = "N";

            bundle = new Bundle();
            fragment = new LoginFragment();
            switch (isActivated) {
                case "Y":
                    bundle.putBoolean("isActivated", true);
                    bundle.putString("phoneNumber", resultPhone);
                    fragment.setArguments(bundle);
                    iMainPresenter.replaceFragment(fragment);
                    break;
                case "N":
                    requestCode(resultPhone);
                    break;
                default:
                    break;
            }
            iSignInView.onLoadSuccess();
        } else {
            iSignInView.onLoadError(context.getResources().getString(R.string.alert_login));
        }
    }

    private void requestCode(final String phoneNumber) {
        TelehealthUser telehealthUser = new TelehealthUser();
        telehealthUser.setPhone(phoneNumber);

        JsonObject patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        if (spDevice.getBoolean("sendToken", false)) {
            registerApi = RESTClient.getRegisterApi();
            registerApi.activation(patientJSON, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String msg = jsonObject.get("status").getAsString();
                    Log.d(TAG, msg);
                    if (msg.equalsIgnoreCase("success")) {

                        bundle.putBoolean("isActivated", false);
                        bundle.putString("phoneNumber", phoneNumber);
                        fragment.setArguments(bundle);

                        iMainPresenter.replaceFragment(fragment);
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    iSignInView.onLoadError(error.getLocalizedMessage());
                }
            });
        } else {
            context.startService(new Intent(context, RegistrationIntentService.class));
        }
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

    public String convertPhone(String code, String phoneNumber) {
        if (phoneNumber.length() == 0) {
            return "wrong";
        } else {
            String expression = "^(/+61|0061|0)?4[0-9]{8}$";
            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(phoneNumber);
            if (matcher.matches()) {
                String mobile = null;
                String subStringMobile = phoneNumber.substring(0, 4);
                if (subStringMobile.equalsIgnoreCase("0061")) {
                    mobile = code + phoneNumber.substring(4, phoneNumber.length());
                } else {
                    char subPhone = phoneNumber.charAt(0);
                    switch (subPhone) {
                        case '0':
                            mobile = code + phoneNumber.substring(1);
                            break;
                        case '4':
                            mobile = code + phoneNumber;
                            break;
                    }
                }
                return mobile;
            } else {
                return "wrong";
            }
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

}
