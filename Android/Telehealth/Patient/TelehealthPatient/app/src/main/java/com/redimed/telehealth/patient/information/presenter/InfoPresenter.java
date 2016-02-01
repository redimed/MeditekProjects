package com.redimed.telehealth.patient.information.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.information.view.IInfoView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/14/2016.
 */
public class InfoPresenter implements IInfoPresenter {

    private Gson gson;
    private Context context;
    private Patient[] patients;
    private IInfoView iInfoView;
    private RegisterApi restClient;
    private IMainPresenter iMainPresenter;
    private SharedPreferences patientSharedPreferences;
    private String TAG = "INFORMATION_PRESENTER";

    public InfoPresenter(IInfoView iInfoView, Context context, FragmentActivity activity) {
        this.context = context;
        this.iInfoView = iInfoView;

        gson = new Gson();
        iInfoView.onLoadToolbar();
        restClient = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
        patientSharedPreferences = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
    }

    @Override
    public void getInfoPatient(String uid) {
        restClient.getDetailsPatient(uid, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    patients = gson.fromJson(jsonObject.get("data").toString(), Patient[].class);
                    iInfoView.displayInfo(patients);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iInfoView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void loadAvatar(String url) {
        GlideUrl glideUrl = new GlideUrl(url, new LazyHeaders.Builder()
                .addHeader("SystemType", "ARD")
                .addHeader("AppID", "com.redimed.telehealth.patient")
                .addHeader("Cookie", patientSharedPreferences.getString("cookie", ""))
                .addHeader("DeviceID", patientSharedPreferences.getString("deviceID", ""))
                .addHeader("Authorization", "Bearer " + patientSharedPreferences.getString("token", ""))
                .build());

        int myWidth = 300;
        int myHeight = 300;
        Glide.with(context).load(glideUrl)
                .asBitmap()
                .into(new SimpleTarget<Bitmap>(myWidth, myHeight) {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation glideAnimation) {
                        iInfoView.onLoadAvatar(resource);
                    }

                    @Override
                    public void onLoadFailed(Exception e, Drawable errorDrawable) {
                        Bitmap errorBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.icon_error_image);
                        iInfoView.onLoadAvatar(errorBitmap);
                    }
                });
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null){
            iMainPresenter.replaceFragment(fragment);
        }
    }
}
