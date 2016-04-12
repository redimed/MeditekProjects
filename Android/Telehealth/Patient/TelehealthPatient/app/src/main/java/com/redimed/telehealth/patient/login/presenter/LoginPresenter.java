package com.redimed.telehealth.patient.login.presenter;

import android.app.Activity;
import android.content.Context;
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
import com.redimed.telehealth.patient.login.view.ILoginView;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public class LoginPresenter implements ILoginPresenter {

    private Gson gson;
    private Context context;
    private String phoneNumber;
    private boolean isActivated;
    private ILoginView iLoginView;
    private JsonObject patientJSON;
    private SharedPreferences spDevice;
    private TelehealthUser telehealthUser;
    private IMainPresenter iMainPresenter;
    private SharedPreferences.Editor editor;
    private RegisterApi registerApi, registerApiLogin;
    private static final String TAG = "=ACTIVATION_PRESENTER=";

    //Constructor
    public LoginPresenter(ILoginView iLoginView, Context context, FragmentActivity activity) {
        this.iLoginView = iLoginView;
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
//    @Override
//    public void validatedPhone(String code, String phoneNumber) {
//        String result;
//        if (phoneNumber.length() == 0) {
//            result = "wrong";
//        } else {
//            String expression = "^(/+61|0061|0)?4[0-9]{8}$";
//            Pattern pattern = Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
//            Matcher matcher = pattern.matcher(phoneNumber);
//            if (matcher.matches()) {
//                String mobile = null;
//                String subStringMobile = phoneNumber.substring(0, 4);
//                if (subStringMobile.equalsIgnoreCase("0061")) {
//                    mobile = code + phoneNumber.substring(4, phoneNumber.length());
//                } else {
//                    char subPhone = phoneNumber.charAt(0);
//                    switch (subPhone) {
//                        case '0':
//                            mobile = code + phoneNumber.substring(1);
//                            break;
//                        case '4':
//                            mobile = code + phoneNumber;
//                            break;
//                        case '+':
//                            mobile = code + phoneNumber;
//                            break;
//                    }
//                }
//                result = mobile;
//            } else {
//                result = "wrong";
//            }
//        }
//        iLoginView.onValidate(result);
//    }

    //Register phone number with get token device
//    @Override
//    public void requestCode(String phoneNumber) {
//        telehealthUser.setPhone(phoneNumber);
//        patientJSON.addProperty("data", gson.toJson(telehealthUser));
//        if (spDevice.getBoolean("sendToken", false)) {
//            registerApi.activation(patientJSON, new Callback<JsonObject>() {
//                @Override
//                public void success(JsonObject jsonObject, Response response) {
//                    String msg = jsonObject.get("status").getAsString();
//                    if (msg.equalsIgnoreCase("success")) {
//                        iLoginView.onRequestCode();
//                    }
//                }
//
//                @Override
//                public void failure(RetrofitError error) {
//                    iLoginView.onLoadError(error.getLocalizedMessage());
//                }
//            });
//
//        } else {
//            iLoginView.onLoadError("SERVICE NOT AVAILABLE");
//            context.startService(new Intent(context, RegistrationIntentService.class));
//        }
//    }

    @Override
    public void verifyLogin(Bundle bundle, String code) {
        if (bundle != null){
            isActivated = bundle.getBoolean("isActivated");
            phoneNumber = bundle.getString("phoneNumber");
            Log.d(TAG, isActivated + "");
            if (isActivated){
                // TODO: 3/25/2016 Login by PIN
            } else {
                verifyCode(code);
            }
        }
    }

    //Compare code input with code receive from server and login
//    @Override
    private void verifyCode(String verifyCode) {
        if (!verifyCode.equalsIgnoreCase("")){
            telehealthUser.setPhone(phoneNumber);
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
                    iLoginView.onLoadError(error.getLocalizedMessage());
                }
            });
        } else {
            iLoginView.onLoadError("Please Input Code");
        }
    }

    private void login(JsonObject jsonObject) {
        registerApiLogin.login(initJsonLogin(jsonObject), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                editor.putString("token", jsonObject.get("token").isJsonNull() ? "" : jsonObject.get("token").getAsString());
                editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? "" : jsonObject.get("refreshCode").getAsString());
                editor.putString("deviceID", spDevice.getString("deviceID", ""));
                editor.apply();

                JsonObject userJson = jsonObject.get("user").getAsJsonObject();
                GetTelehealthUID(userJson.get("UID").isJsonNull() ? "" : userJson.get("UID").getAsString());

//                Log.d(TAG, jsonObject + "");
            }

            @Override
            public void failure(RetrofitError error) {
                iLoginView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private void GetTelehealthUID(String userUID) {
        if (!userUID.equalsIgnoreCase("")){
            registerApi.getTelehealthUID(userUID, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    editor.putString("uid", jsonObject.get("UID").isJsonNull() ? "" : jsonObject.get("UID").getAsString());
                    editor.apply();

                    // TODO: 3/24/2016 Storage local patient is Activated
                    SharedPreferences.Editor editorIsLogin = context.getSharedPreferences("isLogin", Context.MODE_PRIVATE).edit();
                    editorIsLogin.putBoolean("isLogin", true);
                    editorIsLogin.apply();

                    iLoginView.onLogin();
                }

                @Override
                public void failure(RetrofitError error) {
                    iLoginView.onLoadError(error.getLocalizedMessage());
                }
            });
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
