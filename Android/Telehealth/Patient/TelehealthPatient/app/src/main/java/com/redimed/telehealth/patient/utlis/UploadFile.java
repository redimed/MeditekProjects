package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.ProgressBar;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;

import com.redimed.telehealth.patient.network.RESTClient;

import java.io.File;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 3/1/2016.
 */
public class UploadFile extends AsyncTask<Integer, Integer, Void> {

    private Gson gson;
    private ProgressBar pb;
    private Context context;
    private long totalSize = 0;
    private SharedPreferences uidTelehealth;
    private RegisterApi registerApiCore, registerApi;
    private String TAG = "UPLOAD_PROGRESS", picturePath, fileType;

    public UploadFile(Context context,
                      ProgressBar pb,
                      String fileType,
                      String picturePath) {
        this.pb = pb;
        this.context = context;
        this.fileType = fileType;
        this.picturePath = picturePath;

        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        registerApiCore = RESTClient.getRegisterApiCore();
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    protected Void doInBackground(final Integer... params) {
        String userUID = uidTelehealth.getString("userUID", "");

        final File file = new File(picturePath);
        totalSize = file.length();

        CountingTypedFile.ProgressListener listener = new CountingTypedFile.ProgressListener() {
            @Override
            public void transferred(long num) {
                publishProgress((int) ((num / (float) totalSize) * 100));
            }
        };

        registerApiCore.uploadFile(userUID, fileType, new CountingTypedFile("image/*", file, listener), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {

                    JsonObject fileUpload = new JsonObject();
                    fileUpload.addProperty("fileType", fileType);
                    fileUpload.addProperty("fileUID", jsonObject.get("fileUID").getAsString());
                    fileUpload.addProperty("Enable", "N");

                    ChangeStatusFile(fileUpload);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
        return null;
    }

    private void ChangeStatusFile(JsonObject fileUpload) {
        JsonObject jData = new JsonObject();
        jData.addProperty("data", gson.toJson(fileUpload));

        registerApi.changeEnableFile(jData, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, jsonObject.get("message").getAsString() + "");
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
        int progress = values[0];
        pb.setProgress(progress);
    }
}
