package com.redimed.telehealth.patient.appointment_tabs.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.StrictMode;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.appointment_tabs.view.ITabsAppointmentView;
import com.redimed.telehealth.patient.models.ClinicalDetails;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utlis.DefineKey;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by MeditekMini on 6/1/16.
 */
public class TabsAppointmentPresenter implements ITabsAppointmentPresenter {

    private Gson gson;
    private Context context;
    private RegisterApi registerApi;
    private FragmentActivity activity;
    private SharedPreferences spTelehealth;
    private ArrayList<String> listUrl, listImage;
    private ITabsAppointmentView iTabsAppointmentView;
    private static final String TAG = "==TAB_APPT_PRESENTER==";

    protected MyApplication application;

    public TabsAppointmentPresenter(Context context, FragmentActivity activity, ITabsAppointmentView iTabsAppointmentView) {
        this.context = context;
        this.activity = activity;
        this.iTabsAppointmentView = iTabsAppointmentView;
        this.application = (MyApplication) context.getApplicationContext();

        gson = new Gson();
        listUrl = new ArrayList<>();
        listImage = new ArrayList<>();
        application.setCurrentActivity(activity);
        registerApi = RESTClient.getRegisterApi();
        spTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void initToolbar(Toolbar toolbar) {
        AppCompatActivity appCompatActivity = (AppCompatActivity) activity;
        appCompatActivity.setSupportActionBar(toolbar);

        final ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(context.getResources().getString(R.string.appt_title));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
    }

    @Override
    public void getAppointmentDetails(String uidAppt) {
        registerApi.getAppointmentDetails(uidAppt, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                if (jsonObject != null) {
                    getListImage(jsonObject);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iTabsAppointmentView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    private void getListImage(JsonObject jsonObject) {
        //Get image from ClinicalDetails
        String strClinicDetail = jsonObject.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("ClinicalDetails").toString();
        Log.d(TAG, strClinicDetail);
        ClinicalDetails[] clinicalDetails = gson.fromJson(strClinicDetail, ClinicalDetails[].class);
        for (ClinicalDetails clinical : clinicalDetails) {
            FileUpload[] files = clinical.getFileUpload();
            for (FileUpload file : files) {
                if (file != null) {
                    listUrl.add(file.getUID());
                }
            }
        }

        //Get image from Appointment
        try {
            String strImgAppt = jsonObject.get("data").getAsJsonObject().get("FileUploads").toString();
            List<FileUpload> listImgAppt = gson.fromJson(strImgAppt, new TypeToken<List<FileUpload>>() {
            }.getType());
            for (int i = 0; i < listImgAppt.size(); i++) {
                listUrl.add(listImgAppt.get(i).getUID());
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
        GetFileUpload(listUrl);
    }

    //Add data url to list
    private void GetFileUpload(List<String> fileUploads) {
        for (int i = 0; i < fileUploads.size(); i++) {
            if (GetResponseCode(Config.apiURLImageResize + fileUploads.get(i)) == 200) {
                listImage.add(Config.apiURLImageResize + fileUploads.get(i));
            }
        }
        iTabsAppointmentView.onLoadSuccess(listImage);
    }

    //Check url available
    public int GetResponseCode(String urlString) {
        int res = 0;
        try {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
            URL url = new URL(urlString);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestProperty("AppID", DefineKey.AppID);
            urlConnection.setRequestProperty("SystemType", DefineKey.SystemType);
            urlConnection.setRequestProperty("Cookie", spTelehealth.getString("cookie", ""));
            urlConnection.setRequestProperty("DeviceID", spTelehealth.getString("deviceID", ""));
            urlConnection.setRequestProperty("Authorization", "Bearer " + spTelehealth.getString("token", ""));
            urlConnection.connect();
            res = urlConnection.getResponseCode();
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage() + " ");
        }
        return res;
    }
}
