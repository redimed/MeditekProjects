package com.redimed.telehealth.patient;

import android.app.Activity;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.RectF;
import android.net.Uri;
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
import com.redimed.telehealth.patient.fragment.AppointmentDetails;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CountingTypedFile;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.squareup.picasso.Picasso;

import java.io.File;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class ModelActivity extends AppCompatActivity implements View.OnClickListener {

    private Intent i;
    private Gson gson;
    private int rotation;
    private long totalSize = 0;
    private boolean shouldFinish = false;
    private String picturePath, appointmentUID;
    private static SharedPreferences uidTelehealth;
    private RegisterApi registerApiCore, registerApi;
    private String userUID, bodyPart, TAG = "MODEL";

    @Bind(R.id.btnUpload)
    Button btnUpload;
    @Bind(R.id.imgUpload)
    ImageView imgUpload;
    @Bind(R.id.progressBarUpload)
    ProgressBar progressBarUpload;
    @Bind(R.id.logo)
    ImageView logo;
    @Bind(R.id.btnRotate)
    Button btnRotate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_model);
        ButterKnife.bind(this);
        Picasso.with(this).load(R.drawable.logo_redimed).into(logo);

        registerApiCore = RESTClient.getRegisterApiCore();
        registerApi = RESTClient.getRegisterApi();
        gson = new Gson();

        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        if (savedInstanceState != null) {
            rotation = savedInstanceState.getInt("ANGLE");
        }
        LoadImageUpload();

        btnUpload.setOnClickListener(this);
    }

    private void LoadImageUpload() {
        i = getIntent();
        if (i.getExtras() != null) {
            appointmentUID = i.getExtras().getString("appointmentUID");
            picturePath = i.getExtras().getString("picturePath");

            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = false;

            final Bitmap bitmap = BitmapFactory.decodeFile(picturePath, options);
            imgUpload.setImageBitmap(getScaledBitmap(bitmap));

            btnRotate.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    rotation += 90;
                    rotation %= 360;
                    imgUpload.setImageBitmap(getScaledBitmap(bitmap));
                }
            });
        }
    }

    private Bitmap getScaledBitmap(Bitmap bm) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        int newWidth = 1000, newHeight = 800;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // CREATE A MATRIX FOR THE MANIPULATION
        Matrix matrix = new Matrix();
        // RESIZE THE BITMAP
        matrix.postScale(scaleWidth, scaleHeight);
        if (rotation % 360 == 0) {
            return Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
        }
        else {
            // ROTATE THE BITMAP
            matrix.postRotate(rotation);
            return Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putInt("ANGLE", rotation);
        super.onSaveInstanceState(outState);
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

    private class UploadProgress extends AsyncTask<Integer, Integer, Void> {

        private CountingTypedFile.ProgressListener listener;
        private ProgressBar pb;

        public UploadProgress(ProgressBar progressBarUpload) {
            this.pb = progressBarUpload;
        }

        @Override
        protected Void doInBackground(Integer... params) {

            final String fileType = "MedicalImage";
            String description = " ";
            userUID = uidTelehealth.getString("userUID", null);
            final File file = new File(picturePath);
            // TODO: 12/8/2015 Rotate image upload
            totalSize = file.length();

            listener = new CountingTypedFile.ProgressListener() {
                @Override
                public void transferred(long num) {
                    publishProgress((int) ((num / (float) totalSize) * 100));
                }
            };

            registerApiCore.uploadFile(userUID, fileType, bodyPart, description, new CountingTypedFile("image/*", file, listener), new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {

                        FileUpload fileUpload = new FileUpload();
                        fileUpload.setFileUID(jsonObject.get("fileUID").getAsString());
                        fileUpload.setApptUID(appointmentUID);

                        JsonObject fileJson = new JsonObject();
                        fileJson.addProperty("data", gson.toJson(fileUpload));

                        registerApi.addAppointmentFile(fileJson, new Callback<JsonObject>() {
                            @Override
                            public void success(JsonObject jsonObject, Response response) {
                                String status = jsonObject.get("status").getAsString();
                                if (status.equalsIgnoreCase("success")) {
                                    Intent returnIntent = new Intent();
                                    setResult(Activity.RESULT_OK, returnIntent);
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
    protected void onResume() {
        super.onResume();
    }

    @Override
    public void onBackPressed() {
        if (!shouldFinish) {
            Toast.makeText(this, R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        } else {
            finish();
            super.onBackPressed();
        }
    }
}
