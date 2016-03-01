package com.redimed.telehealth.patient.service;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.IBinder;
import android.util.Log;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;

import java.io.File;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

public class UploadService extends Service {

    private int serverResponseCode = 0;
    private RegisterApi registerApiCore;
    private SharedPreferences.Editor editor;
    private SharedPreferences sharedPref, uidTelehealth;
    private String TAG = "UPLOAD_SERVICE";

    @Override
    public void onCreate() {
        registerApiCore = RESTClient.getRegisterApiCore();

        sharedPref = getSharedPreferences("fileUploads", Context.MODE_PRIVATE);
        uidTelehealth = getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Runnable runnable = new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < 3; i++) {
                    synchronized (this) {
                        try {
                            uploadFile(sharedPref.getString(String.valueOf(i), ""));
                        } catch (Exception e) {
                            Log.d(TAG, e.getLocalizedMessage());
                        }
                    }
                }
                stopSelf();
            }
        };
        Thread thread = new Thread(runnable);
        thread.start();
        return Service.START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    private void uploadFile(String sdcardPath) {
//        TypedFile typedFile;
//        final FileUpload fileUpload = new FileUpload();
//        typedFile = new TypedFile("multipart/form-data", new File(sdcardPath));
        //// TODO: 2/26/2016
//        registerApiCore.uploadFile(uidTelehealth.getString("userUID", ""), "MedicalImage", "", "", typedFile, new Callback<JsonObject>() {
//            @Override
//            public void success(JsonObject jsonObject, Response response) {
//                String status = jsonObject.get("status").getAsString();
//                if (status.equalsIgnoreCase("success")) {
//                    fileUpload.setFileUID(jsonObject.get("fileUID").getAsString());
////                    fileUploads.add(fileUpload);
//                }
//            }
//
//            @Override
//            public void failure(RetrofitError error) {
////                iRequestView.onErrorUpload(error.getLocalizedMessage());
//            }
//        });
    }
}
