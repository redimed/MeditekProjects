package com.redimed.telehealth.patient.appointment.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.StrictMode;
import android.provider.MediaStore;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.widget.Button;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
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
    private List<String> listUrl;
    private List<String> listImage;
    private RegisterApi registerApi;
    private SharedPreferences spTelehealth;
    private IMainPresenter iMainPresenter;
    private IAppointmentView iAppointmentView;

    private Uri fileUri;
    private static final int RESULT_PHOTO = 1;
    private static final int RESULT_CAMERA = 2;
    private static final int RESULT_RELOAD = 3;
    private static final int MEDIA_TYPE_IMAGE = 1;
    private String TAG = "APPT_PRESENTER";

    public AppointmentPresenter(Context context, IAppointmentView iAppointmentView, FragmentActivity activity) {
        this.context = context;
        this.iAppointmentView = iAppointmentView;

        gson = new Gson();
        iAppointmentView.onLoadToolbar();
        listUrl = new ArrayList<String>();
        listImage = new ArrayList<String>();
        registerApi = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
        spTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getAppointmentDetails(String appointmentUID) {
        registerApi.getAppointmentDetails(appointmentUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                iAppointmentView.onLoadAppointment(jsonObject, "success");
            }

            @Override
            public void failure(RetrofitError error) {
                iAppointmentView.onLoadAppointment(null, error.getLocalizedMessage());
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
    public void uploadPhotos(int requestCode, Intent data, Fragment fragment) {
        Cursor cursor;
        int columnIndex;
        String picturePath = "";
        boolean flagLayout = false;
        try {
            switch (requestCode) {
                case RESULT_PHOTO:
                    //Get uri image
                    Uri selectedImage = data.getData();
                    String[] filePathColumn = {MediaStore.Images.Media.DATA};
                    //Get cursor
                    cursor = context.getContentResolver().query(selectedImage, filePathColumn, null, null, null);
                    cursor.moveToFirst();
                    //Get path form cursor index
                    columnIndex = cursor.getColumnIndex(filePathColumn[0]);
                    picturePath = cursor.getString(columnIndex);
                    cursor.close();
                    flagLayout = true;
                    break;

                case RESULT_CAMERA:
                    // Downsizing image as it throws OutOfMemory Exception for larger images
                    picturePath = fileUri.getPath();
                    flagLayout = true;
                    break;

                case RESULT_RELOAD:
                    flagLayout = false;
                    FragmentTransaction ft = fragment.getFragmentManager().beginTransaction();
                    ft.detach(fragment).attach(fragment).commit();
                    break;
            }
            iAppointmentView.onResultUpload(picturePath, flagLayout);
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
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
    public void viewStatus(String status, String apptTime) {
        if (status != null) {
            Bundle bundle = new Bundle();
            bundle.putString("statusAppt", status);
            bundle.putString("timeAppt", apptTime);
            Fragment fragment = new StatusFragment();
            fragment.setArguments(bundle);
            iMainPresenter.replaceFragment(fragment);
        }

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