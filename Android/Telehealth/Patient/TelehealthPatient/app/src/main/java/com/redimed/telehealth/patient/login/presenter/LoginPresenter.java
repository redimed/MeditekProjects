package com.redimed.telehealth.patient.login.presenter;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.login.view.ILoginView;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by LamNguyen on 12/31/2015.
 */
public class LoginPresenter implements ILoginPresenter {

    private Context context;
    private ILoginView iLoginView;
    private FragmentActivity activity;
    private IMainPresenter iMainPresenter;
    private SharedPreferences.Editor editor;
    private SharedPreferences spTele;
    private RegisterApi registerApi, registerApiLogin;
    private static final String TAG = "=ACTIVATION_PRESENTER=";

    //Constructor
    public LoginPresenter(ILoginView iLoginView, Context context, FragmentActivity activity) {
        this.iLoginView = iLoginView;
        this.context = context;
        this.activity = activity;

        //init variable
        registerApi = RESTClient.getRegisterApi();
        registerApiLogin = RESTClient.getRegisterApiLogin();
        iMainPresenter = new MainPresenter(context, activity);
        spTele = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void verifyLogin(Bundle bundle, String code) {
        if (bundle != null) {
            login(code);
        }
    }

    private JsonObject initJsonLogin(String pinNumber) {
        JsonObject jsonLogin = new JsonObject();
        jsonLogin.addProperty("UserName", "1");
        jsonLogin.addProperty("Password", "1");
        jsonLogin.addProperty("PinNumber", pinNumber);
        jsonLogin.addProperty("UserUID", spTele.getString("userUID", ""));
        jsonLogin.addProperty("DeviceID", spTele.getString("deviceID", ""));
        jsonLogin.addProperty("AppID", "com.redimed.telehealth.patient");
        return jsonLogin;
    }

    private void login(String pin) {
        registerApiLogin.login(initJsonLogin(pin), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                editor = spTele.edit();
                editor.putString("token", jsonObject.get("token").isJsonNull() ? "" : jsonObject.get("token").getAsString());
                editor.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ? "" : jsonObject.get("refreshCode").getAsString());
                editor.apply();

                JsonObject userJson = jsonObject.get("user").getAsJsonObject();
                GetTelehealthUID(userJson.get("UID").isJsonNull() ? "" : userJson.get("UID").getAsString());
            }

            @Override
            public void failure(RetrofitError error) {
                iLoginView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private void GetTelehealthUID(String userUID) {
        if (!userUID.equalsIgnoreCase("")) {
            registerApi.getTelehealthUID(userUID, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    editor = spTele.edit();
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
    public void initToolbar(Toolbar toolbar) {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) activity;
        appCompatActivity.setSupportActionBar(toolbar);

        ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(context.getResources().getString(R.string.login));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_material);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
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
}
