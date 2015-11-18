package com.redimed.telehealth.patient;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import com.redimed.telehealth.patient.api.RegisterApi;
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

import static android.graphics.BitmapFactory.*;

public class ModelActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "MODEL";
    private Intent i;
    private String picturePath, appointmentUID;
    private RegisterApi registerApiCore, registerApi;
    private String bodyPart, auth, deviceID, userUID, cookie;
    private long totalSize = 0;
    private boolean shouldFinish = false;
    private static SharedPreferences uidTelehealth, spDevice;
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

        registerApiCore = RESTClient.getRegisterApiCore();
        registerApi = RESTClient.getRegisterApi();
        gson = new Gson();

        spDevice = getSharedPreferences("DeviceInfo", MODE_PRIVATE);
        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        i = getIntent();
        if (i.getExtras() != null) {
            appointmentUID = i.getExtras().getString("appointmentUID");
            picturePath = i.getExtras().getString("picturePath");
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeFile(picturePath, options);
            int imageHeight = options.outHeight;
            int imageWidth = options.outWidth;
            if (imageWidth > imageHeight) {
                options.inSampleSize = calculateInSampleSize(options, 512, 256);//if landscape
            } else {
                options.inSampleSize = calculateInSampleSize(options, 256, 512);//if portrait
            }
            options.inJustDecodeBounds = false;
            Bitmap bitmap = BitmapFactory.decodeFile(picturePath, options);
            imgUpload.setImageBitmap(bitmap);
        }

        btnUpload.setOnClickListener(this);
    }

    public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        // Raw height and width of image
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            // Calculate ratios of height and width to requested height and width
            final int heightRatio = Math.round((float) height / (float) reqHeight);
            final int widthRatio = Math.round((float) width / (float) reqWidth);

            // Choose the smallest ratio as inSampleSize value, this will guarantee
            // a final image with both dimensions larger than or equal to the
            // requested height and width.
            inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
        }
        return inSampleSize;
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
            auth = "Bearer " + uidTelehealth.getString("token", null);
            deviceID = spDevice.getString("deviceID", null);
            userUID = uidTelehealth.getString("userUID", null);
            cookie = uidTelehealth.getString("cookie", null);
            final File file = new File(picturePath);
            totalSize = file.length();

            listener = new CountingTypedFile.ProgressListener() {
                @Override
                public void transferred(long num) {
                    publishProgress((int) ((num / (float) totalSize) * 100));
                }
            };

            registerApiCore.uploadFile(auth, deviceID, "ARD", cookie, userUID, fileType, bodyPart, description, new CountingTypedFile("image/*", file, listener), new Callback<JsonObject>() {
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
                                if (status.equalsIgnoreCase("success")) {
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
        if (!shouldFinish) {
            Toast.makeText(this, R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        } else {
            finish();
            super.onBackPressed();
        }
    }
}
