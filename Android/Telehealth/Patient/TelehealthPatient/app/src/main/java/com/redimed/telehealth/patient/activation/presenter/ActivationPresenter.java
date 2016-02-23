package com.redimed.telehealth.patient.activation.presenter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.activation.view.IActivationView;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.RegistrationIntentService;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public class ActivationPresenter implements IActivationPresenter {

    private Gson gson;
    private Context context;
    private JsonObject patientJSON;
    private SharedPreferences spDevice;
    private TelehealthUser telehealthUser;
    private IMainPresenter iMainPresenter;
    private SharedPreferences.Editor editor;
    private IActivationView iActivationView;
    private RegisterApi registerApi, registerApiLogin;
    private String TAG = "ACTIVATION_PRESENTER";

    //Constructor
    public ActivationPresenter(IActivationView iActivationView, Context context, FragmentActivity activity) {
        this.iActivationView = iActivationView;
        this.context = context;

        //init variable
        gson = new Gson();
        patientJSON = new JsonObject();
        telehealthUser = new TelehealthUser();
        registerApi = RESTClient.getRegisterApi();
        registerApiLogin = RESTClient.getRegisterApiLogin();
        iMainPresenter = new MainPresenter(context, activity);
        spDevice = context.getSharedPreferences("DeviceInfo", Context.MODE_PRIVATE);
    }

    //Validated phone number match 10-15 digit numbers
    @Override
    public void validatedPhone(String code, String phoneNumber) {
        String result;
        if (phoneNumber.length() == 0) {
            result = "wrong";
        } else {
            String expression = "^(9|0061|0)?4[0-9]{8}$";
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
                        case '9':
                            mobile = "+84908618694";

                            break;
                    }
                }
                result = mobile;
            } else {
                result = "wrong";
            }
        }
        iActivationView.onValidate(result);
    }

    //Register phone number with get token device
    @Override
    public void requestCode(String phoneNumber) {
        telehealthUser.setPhone(phoneNumber);
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        if (spDevice.getBoolean("sendToken", false)) {
            registerApi.activation(patientJSON, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String msg = jsonObject.get("status").getAsString();
                    if (msg.equalsIgnoreCase("success")) {
                        iActivationView.onRequestCode();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    iActivationView.onLoadError(error.getLocalizedMessage());
                }
            });

        } else {
            iActivationView.onLoadError("SERVICE NOT AVAILABLE");
            context.startService(new Intent(context, RegistrationIntentService.class));
        }
    }

    //Compare code input with code receive from server and login
    @Override
    public void verifyCode(String verifyCode) {
        if (!verifyCode.equalsIgnoreCase("")){
            telehealthUser.setCode(verifyCode);
            patientJSON.addProperty("data", gson.toJson(telehealthUser));

            registerApi.verify(patientJSON, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    editor = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE).edit();
                    editor.putString("userUID", jsonObject.get("userUID").isJsonNull() ? "" : jsonObject.get("userUID").getAsString());
                    editor.putString("patientUID", jsonObject.get("patientUID").isJsonNull() ? "" : jsonObject.get("patientUID").getAsString());
                    editor.apply();
                    login(jsonObject);
                }

                @Override
                public void failure(RetrofitError error) {
                    iActivationView.onLoadError(error.getLocalizedMessage());
                }
            });
        } else {
            iActivationView.onLoadError("Please Input Code");
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
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

    private void login(JsonObject jsonObject) {
        registerApiLogin.login(initJsonLogin(jsonObject), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                JsonObject userJson = jsonObject.get("user").getAsJsonObject();
                editor.putString("token", jsonObject.get("token").isJsonNull() ? "" : jsonObject.get("token").getAsString());
                editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? "" : jsonObject.get("refreshCode").getAsString());
                editor.putString("deviceID", spDevice.getString("deviceID", ""));
                editor.apply();

                getTelehealthUID(userJson.get("UID").isJsonNull() ? "" : userJson.get("UID").getAsString());
            }

            @Override
            public void failure(RetrofitError error) {
                iActivationView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private void getTelehealthUID(String userUID) {
        if (!userUID.equalsIgnoreCase("")){
            registerApi.getTelehealthUID(userUID, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String uid = jsonObject.get("UID").isJsonNull() ? "" : jsonObject.get("UID").getAsString();
                    editor.putString("uid", uid);
                    editor.apply();

                    iActivationView.onLogin();
                }

                @Override
                public void failure(RetrofitError error) {
                    iActivationView.onLoadError(error.getLocalizedMessage());
                }
            });
        }
    }

    private JsonObject initJsonLogin(JsonObject jsonObject){
        JsonObject jsonLogin = new JsonObject();
        jsonLogin.addProperty("UserName", "android");
        jsonLogin.addProperty("Password", "android");
        jsonLogin.addProperty("UserUID", jsonObject.get("userUID").isJsonNull() ?
                "" : jsonObject.get("userUID").getAsString());
        jsonLogin.addProperty("DeviceID", spDevice.getString("deviceID", ""));
        jsonLogin.addProperty("VerificationToken", jsonObject.get("verifyCode").isJsonNull() ?
                "" : jsonObject.get("verifyCode").getAsString());
        jsonLogin.addProperty("AppID", "com.redimed.telehealth.patient");
        return jsonLogin;
    }
}
