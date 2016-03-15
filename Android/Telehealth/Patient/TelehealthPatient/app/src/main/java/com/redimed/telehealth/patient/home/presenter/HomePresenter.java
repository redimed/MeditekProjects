package com.redimed.telehealth.patient.home.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.activation.ActivationFragment;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.faq.FAQsFragment;
import com.redimed.telehealth.patient.home.view.IHomeView;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.network.RetrofitErrorHandler;
import com.redimed.telehealth.patient.request.RequestFragment;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.tracking.TrackingFragment;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/14/2016.
 */
public class HomePresenter implements IHomePresenter {

    private Gson gson;
    private Bundle bundle;
    private Context context;
    private Fragment fragment;
    private String dataPatient;
    private IHomeView iHomeView;
    private RegisterApi registerApi;
    private IMainPresenter iMainPresenter;
    private SharedPreferences uidTelehealth, spDevice, existsUser;
    private static final String TAG = "===HOME_PRESENTER===";

    //Constructor
    public HomePresenter(IHomeView iHomeView, Context context, FragmentActivity activity) {
        this.iHomeView = iHomeView;
        this.context = context;

        //init variable
        gson = new Gson();
        bundle = new Bundle();
        registerApi = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
        spDevice = context.getSharedPreferences("DeviceInfo", Context.MODE_PRIVATE);
        uidTelehealth = context.getSharedPreferences("TelehealthUser", Context.MODE_PRIVATE);
        existsUser = context.getSharedPreferences("ExistsUser", Context.MODE_PRIVATE);
    }

    //CreateJsonDataSuburb : if suburb.json file not exists then create file suburb.json
    @Override
    public void createJsonDataSuburb() {
        File file = new File("/data/data/" + context.getApplicationContext().getPackageName() + "/" +
                context.getResources().getString(R.string.fileName));
        if (!file.exists()) {
            RestAdapter restAdapter = new RestAdapter.Builder()
                    .setLogLevel(RestAdapter.LogLevel.BASIC)
                    .setEndpoint("http://testapp.redimed.com.au:3001/api/urgent-care")
                    .setErrorHandler(new RetrofitErrorHandler(context))
                    .build();

            registerApi = restAdapter.create(RegisterApi.class);
            registerApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    try {
                        FileWriter file = new FileWriter(
                                "/data/data/" + context.getApplicationContext().getPackageName() + "/" +
                                        context.getResources().getString(R.string.fileName));
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d(TAG, error.getLocalizedMessage());
                }
            });
        }
    }

    @Override
    public void checkExistsPatient() {
        SharedPreferences.Editor editor = existsUser.edit();
        File xmlUser = new File("/data/data/" + context.getPackageName() + "/shared_prefs/TelehealthUser.xml");
        if (xmlUser.exists()) {
            updateToken();
            iHomeView.changeView(true);
            context.startService(new Intent(context, SocketService.class));

            editor.putBoolean("exists", true);
        } else {
            editor.putBoolean("exists", false);
        }
        editor.apply();
    }

    public void updateToken() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("token", spDevice.getString("gcmToken", ""));
        jsonObject.addProperty("uid", uidTelehealth.getString("uid", ""));
        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("data", gson.toJson(jsonObject));

        RESTClient.getRegisterApi().updateToken(dataJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {}

            @Override
            public void failure(RetrofitError error) {}
        });
    }

    @Override
    public void login() {
        iMainPresenter.replaceFragment(new ActivationFragment());
    }

    @Override
    public void getInfoPatient() {
        registerApi.getDetailsPatient(uidTelehealth.getString("uid", ""), new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    dataPatient = jsonObject.get("data").toString();

                    SharedPreferences.Editor patientInfo = context.getSharedPreferences("PatientInfo", Context.MODE_PRIVATE).edit();
                    patientInfo.putString("info", dataPatient);
                    patientInfo.apply();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iHomeView.onLoadError(error.getLocalizedMessage());
            }
        });
    }

    @Override
    public void displayRequest() {
        bundle.putString("telehealthUID", uidTelehealth.getString("uid", ""));
        fragment = new RequestFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void displayTracking() {
        bundle.putString("telehealthUID", uidTelehealth.getString("uid", ""));
        fragment = new TrackingFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void displaySetting() {
        bundle.putString("telehealthUID", uidTelehealth.getString("uid", ""));
        bundle.putString("dataPatient", dataPatient);
        fragment = new SettingFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void displayFAQs(String content) {
        fragment = new FAQsFragment();
        switch (content){
            case "UR":
                bundle.putString("msg", "UR");
                fragment.setArguments(bundle);
                break;
            case "FAQs":
                bundle.putString("msg", "FAQs");
                fragment.setArguments(bundle);
                break;
            case "Service":
                bundle.putString("msg", "Service");
                fragment.setArguments(bundle);
                break;
            default:
                break;
        }
        iMainPresenter.replaceFragment(fragment);
    }


}
