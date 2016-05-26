package com.redimed.telehealth.patient.model;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.model.presenter.IModelPresenter;
import com.redimed.telehealth.patient.model.presenter.ModelPresenter;
import com.redimed.telehealth.patient.model.view.IModelView;
import com.redimed.telehealth.patient.models.FileUpload;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utlis.CountingTypedFile;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;

import java.io.File;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class ModelActivity extends AppCompatActivity implements IModelView, View.OnClickListener {

    private int rotation;
    private boolean shouldFinish = false;
    private IModelPresenter iModelPresenter;
    private static SharedPreferences uidTelehealth;
    private String picturePath, appointmentUID, bodyPart, TAG = "=====MODEL=====";

    @Bind(R.id.btnUpload)
    Button btnUpload;
    @Bind(R.id.imgUpload)
    ImageView imgUpload;
    @Bind(R.id.progressBarUpload)
    ProgressBar progressBarUpload;
    @Bind(R.id.btnRotate)
    Button btnRotate;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_model);
        ButterKnife.bind(this);
        initData();
        if (savedInstanceState != null) {
            rotation = savedInstanceState.getInt("ANGLE");
        }

        btnRotate.setOnClickListener(this);
        btnUpload.setOnClickListener(this);
    }

    private void initData() {
        Intent i = getIntent();
        if (i.getExtras() != null) {
            picturePath = i.getExtras().getString("picturePath");
            appointmentUID = i.getExtras().getString("appointmentUID");

            iModelPresenter = new ModelPresenter(this, this);
            iModelPresenter.getScaledBitmap(BitmapFactory.decodeFile(picturePath), rotation);
            uidTelehealth = getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt("ANGLE", rotation);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnUpload:
                btnUpload.setVisibility(View.GONE);
                progressBarUpload.setVisibility(View.VISIBLE);
                iModelPresenter.uploadProgress(progressBarUpload, picturePath, appointmentUID, bodyPart, uidTelehealth, this);
                break;
            case R.id.btnRotate:
                rotation += 90;
                rotation %= 360;
                iModelPresenter.getScaledBitmap(BitmapFactory.decodeFile(picturePath), rotation);
                break;
            default:
                break;
        }
    }

    @Override
    public void onLoadImage(Bitmap bitmap) {
        if (bitmap != null) {
            imgUpload.setImageBitmap(bitmap);
        } else {
            Glide.with(this).load(R.drawable.icon_error_image).into(imgUpload);
        }
    }

    @Override
    public void onResultUpload(String msg) {
        if (msg.equalsIgnoreCase("success")){
            Intent returnIntent = new Intent();
            setResult(Activity.RESULT_OK, returnIntent);
            finish();
        } else if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(this).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(this, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            new DialogAlert(this, DialogAlert.State.Error, msg).show();
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
