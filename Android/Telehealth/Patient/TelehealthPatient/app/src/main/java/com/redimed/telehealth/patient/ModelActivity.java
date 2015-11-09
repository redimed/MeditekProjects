package com.redimed.telehealth.patient;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CountingTypedFile;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;

import java.io.File;

import butterknife.Bind;
import butterknife.ButterKnife;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class ModelActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "MODEL";
    private Intent i;
    private String picturePath, appointmentUID;
    private RegisterApi registerApiUpload, registerApi;
    private String accountUID, bodyPart, auth, deviceID;
    private long totalSize = 0;
    private boolean shouldFinish = false;
    private static SharedPreferences uidTelehealth;
    private Gson gson;

    @Bind(R.id.imgUpload)
    ImageView imgUpload;
    @Bind(R.id.progressBarUpload)
    ProgressBar progressBarUpload;
    @Bind(R.id.btnUpload)
    Button btnUpload;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_model);
        ButterKnife.bind(this);

        registerApiUpload = RESTClient.getRegisterApiUrl();
        registerApi = RESTClient.getRegisterApi();
        gson = new Gson();

        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        i = getIntent();
        if (i.getExtras() != null) {
            accountUID = i.getExtras().getString("accountUID");
            appointmentUID = i.getExtras().getString("appointmentUID");
            picturePath = i.getExtras().getString("picturePath");
            imgUpload.setImageBitmap(BitmapFactory.decodeFile(picturePath));
        }

        btnUpload.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnUpload:
                progressBarUpload.setVisibility(View.VISIBLE);
                btnUpload.setVisibility(View.GONE);
                new UploadProgress(progressBarUpload).execute();
        }
    }

    private class UploadProgress extends AsyncTask<Integer, Integer, Void>{

        private CountingTypedFile.ProgressListener listener;
        private ProgressBar pb;

        public UploadProgress(ProgressBar progressBarUpload) {
            this.pb = progressBarUpload;
        }

        @Override
        protected Void doInBackground(Integer... params) {

            final String fileType = "MedicalImage";
            String description = " ";
            auth = "Bearer " + uidTelehealth.getString("token", null);
            deviceID = uidTelehealth.getString("deviceID", null);

            final File file = new File(picturePath);
            totalSize = file.length();

            listener = new CountingTypedFile.ProgressListener() {
                @Override
                public void transferred(long num) {
                    publishProgress((int) ((num / (float) totalSize) * 100));
                }
            };

            registerApiUpload.uploadFile(auth, deviceID, "Android", accountUID, fileType, bodyPart, description, new CountingTypedFile("image/*", file, listener), new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {

                        FileUpload fileUpload = new FileUpload();
                        fileUpload.setFileUID(jsonObject.get("fileUID").getAsString());
                        fileUpload.setApptUID(appointmentUID);

                        Log.d(TAG, fileUpload.toString());
                        JsonObject fileJson = new JsonObject();
                        fileJson.addProperty("data", gson.toJson(fileUpload));
                        Log.d(TAG, fileJson.toString());

                        registerApi.addAppointmentFile(fileJson, new Callback<JsonObject>() {
                            @Override
                            public void success(JsonObject jsonObject, Response response) {
                                Log.d(TAG, jsonObject.toString());
                                String status = jsonObject.get("status").getAsString();
                                if (status.equalsIgnoreCase("success")){
                                    finish();
                                }
                            }

                            @Override
                            public void failure(RetrofitError error) {
                                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                                    new DialogConnection(ModelActivity.this).show();
                                } else {
                                    new CustomAlertDialog(ModelActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                                }
                            }
                        });
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                        new DialogConnection(ModelActivity.this).show();
                    } else {
                        new CustomAlertDialog(ModelActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                    }
                }
            });
            return null;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            int progress = values[0];
            pb.setProgress(progress);
        }
    }

    @Override
    public void onBackPressed() {
        if (!shouldFinish){
            Toast.makeText(this, R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        }else {
            finish();
            super.onBackPressed();
        }
    }
}
