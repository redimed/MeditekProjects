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
import com.redimed.telehealth.patient.status_appointment.StatusFragment;

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

    private Gson gson;
    private Context context;
    private Fragment fragment;
    private List<String> listUrl;
    private List<String> listImage;
    private RegisterApi registerApi;
    private FragmentActivity activity;
    private IMainPresenter iMainPresenter;
    private SharedPreferences spTelehealth;
    private IAppointmentView iAppointmentView;
    private String apptStatus, apptTime, apptUID;

    private static final int MEDIA_TYPE_IMAGE = 1;
    private static final String TAG = "===APPT_PRESENTER===";

    public AppointmentPresenter(Context context, IAppointmentView iAppointmentView, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iAppointmentView = iAppointmentView;

        gson = new Gson();
        listUrl = new ArrayList<>();
        listImage = new ArrayList<>();
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
    public void initToolbar(Toolbar toolbar) {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) activity;
        appCompatActivity.setSupportActionBar(toolbar);

        ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(context.getResources().getString(R.string.appt_title));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_mtrl_am_alpha);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }
    }

    @Override
    public Uri getOutputMediaFileUri(int type) {
        return Uri.fromFile(getOutputMediaFile(type));
    }

    private static File getOutputMediaFile(int type) {
        // Create a media file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        File mediaFile = null;

        // External sdcard location
        File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "Telehealth");
        // Create the storage directory if it does not exist
        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                mediaStorageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
                return mediaFile;
            }
        }

        if (type == MEDIA_TYPE_IMAGE) {
            mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
        } else {
            return null;
        }
        return mediaFile;
    }

    @Override
    public void getListImage(JsonObject jsonObject) {
        //Get image from ClinicalDetails
        String strClinicDetail = jsonObject.get("data").getAsJsonObject().get("TelehealthAppointment").getAsJsonObject().get("ClinicalDetails").toString();
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

    @Override
    public void viewStatus() {
        Bundle bundle = new Bundle();
        bundle.putString("apptUID", apptUID);
        bundle.putString("timeAppt", apptTime);
        bundle.putString("statusAppt", apptStatus);


        fragment = new StatusFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    //Add data url to list
    private void GetFileUpload(List<String> fileUploads) {
        for (int i = 0; i < fileUploads.size(); i++) {
            if (GetResponseCode(Config.apiURLImageResize + fileUploads.get(i)) == 200) {
                listImage.add(Config.apiURLImageResize + fileUploads.get(i));
            }
        }
        iAppointmentView.onLoadListImage(listImage, spTelehealth);
    }

    //Check url available
    public int GetResponseCode(String urlString) {
        int res = 0;
        try {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
            URL url = new URL(urlString);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestProperty("SystemType", "ARD");
            urlConnection.setRequestProperty("AppID", "com.redimed.telehealth.patient");
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
