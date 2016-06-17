package com.redimed.telehealth.patient.appointment.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.StrictMode;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.appointment.view.IAppointmentView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.ClinicalDetails;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.appointment_status.StatusFragment;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/19/2016.
 */
public class AppointmentPresenter implements IAppointmentPresenter {

    private Context context;
    private RegisterApi registerApi;
    private FragmentActivity activity;
    private IMainPresenter iMainPresenter;
    private SharedPreferences spTelehealth;
    private IAppointmentView iAppointmentView;
    private String apptStatus, apptTime, apptUID;

    private static final String TAG = "===APPT_PRESENTER===";

    public AppointmentPresenter(Context context, IAppointmentView iAppointmentView, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iAppointmentView = iAppointmentView;

        registerApi = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
        spTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getAppointmentDetails(String appointmentUID) {
        registerApi.getAppointmentDetails(appointmentUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject != null) {
                    apptUID = jsonObject.get("data").getAsJsonObject().get("UID").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("UID").getAsString();

                    apptTime = jsonObject.get("data").getAsJsonObject().get("FromTime").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("FromTime").getAsString();

                    apptStatus = jsonObject.get("data").getAsJsonObject().get("Status").isJsonNull() ?
                            "NONE" : jsonObject.get("data").getAsJsonObject().get("Status").getAsString();
                    iAppointmentView.onLoadAppointment(jsonObject);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iAppointmentView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void viewStatus() {
        Bundle bundle = new Bundle();
        bundle.putString("apptUID", apptUID);
        bundle.putString("timeAppt", apptTime);
        bundle.putString("statusAppt", apptStatus);

        Fragment fragment = new StatusFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }
}
