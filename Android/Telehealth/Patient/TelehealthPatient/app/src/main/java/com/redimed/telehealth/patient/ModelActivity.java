package com.redimed.telehealth.patient;

import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.fragment.TelehealthFragment;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedFile;

public class ModelActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG = "MODEL";
    private Intent i;
    private String picturePath;
    private RegisterApi registerApiUpload;
    private String patientUID;

    @Bind(R.id.imgUpload)
    ImageView imgUpload;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;
    @Bind(R.id.txtPercentage)
    TextView txtPercentage;
    @Bind(R.id.btnUpload)
    Button btnUpload;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_model);
        ButterKnife.bind(this);
        registerApiUpload = RESTClient.getRegisterApiUrl();
        i = getIntent();

        if (i.getExtras() != null) {
            patientUID = i.getExtras().getString("patientUID");
            picturePath = i.getExtras().getString("picturePath");
            imgUpload.setImageBitmap(BitmapFactory.decodeFile(picturePath));

        }

        btnUpload.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnUpload:
                UploadFile();
        }
    }

    private void UploadFile() {
        TypedFile uploadFile = new TypedFile("multipart/form-data", new File(picturePath));
        String fileType = "MedicalImage";
        Log.d(TAG, patientUID);
        registerApiUpload.uploadFile(uploadFile, fileType, patientUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                Log.d(TAG, "Success");
                finish();
            }

            @Override
            public void failure(RetrofitError error) {
                if (error != null) {
                    Log.d(TAG, error.getMessage());
                }
            }
        });
    }
}
