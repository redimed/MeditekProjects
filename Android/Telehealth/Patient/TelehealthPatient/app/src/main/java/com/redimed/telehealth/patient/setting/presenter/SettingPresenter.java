package com.redimed.telehealth.patient.setting.presenter;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Parcelable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AlertDialog;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.faq.FAQsFragment;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.information.InformationFragment;
import com.redimed.telehealth.patient.information.presenter.InfoPresenter;
import com.redimed.telehealth.patient.main.MainActivity;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.setting.view.ISettingView;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/15/2016.
 */
public class SettingPresenter implements ISettingPresenter {

    private Gson gson;
    private Context context;
    private Patient[] patients;
    private ISettingView iSettingView;
    private IMainPresenter iMainPresenter;
    private String TAG = "SETTING_PRESENTER";
    private RegisterApi restClient, registerApiLogin;

    public SettingPresenter(ISettingView iSettingView, Context context, FragmentActivity activity) {
        this.context = context;
        this.iSettingView = iSettingView;

        gson = new Gson();
        iSettingView.onLoadToolbar();
        restClient = RESTClient.getRegisterApi();
        registerApiLogin = RESTClient.getRegisterApiLogin();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public void getInfoPatient(String dataPatient) {
        patients = gson.fromJson(dataPatient, Patient[].class);
        iSettingView.displayShortInfo(patients);
    }

    @Override
    public void displayInfoPatient(String uid) {
        if (patients != null) {
            Bundle bundle = new Bundle();
            bundle.putString("telehealthUID", uid);

            Fragment fragment = new InformationFragment();
            fragment.setArguments(bundle);

            iMainPresenter.replaceFragment(fragment);
        }

    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null) {
            iMainPresenter.replaceFragment(fragment);
        }
    }

    @Override
    public void displayAbout() {
        FAQsFragment fragment = new FAQsFragment();
        Bundle bundle = new Bundle();
        bundle.putString("msg", "UR");
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public void logout() {
//        JsonObject jsonObject = new JsonObject();
//        jsonObject.addProperty("token", "");
//        jsonObject.addProperty("uid", uid);
//
//        JsonObject dataJson = new JsonObject();
//        dataJson.addProperty("data", gson.toJson(jsonObject));
//
//            registerApiLogin.logout(new Callback<JsonObject>() {
//                @Override
//                public void success(JsonObject jsonObject, Response response) {
//                    String message = jsonObject.get("status").getAsString();
//                    if (message.equals("success")) {
//                        clearApplication();
//                        context.startActivity(new Intent(context, MainActivity.class));
//                    }
//                }
//
//                @Override
//                public void failure(RetrofitError error) {
//                iSettingView.onLoadError(error.getLocalizedMessage());
//                }
//            }
//            });

        final AlertDialog alertDialog = new android.support.v7.app.AlertDialog.Builder(context).create();
        alertDialog.setTitle(context.getResources().getString(R.string.logout));
        alertDialog.setMessage(context.getResources().getString(R.string.un_title));

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Logout", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                clearApplication();
                iMainPresenter.replaceFragment(new HomeFragment());
            }
        });

        alertDialog.setButton(Dialog.BUTTON_POSITIVE, "Cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                alertDialog.cancel();
            }
        });
        alertDialog.show();
    }

    public void clearApplication() {
        File cache = context.getCacheDir();
        File appDir = new File(cache.getParent());

        if (appDir.exists()) {
            String[] children = appDir.list();
            for (String s : children) {
                if (!s.equals("lib")) {
                    deleteDir(new File(appDir, s));
                }
            }
        }
    }

    public static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (String aChildren : children) {
                boolean success = deleteDir(new File(dir, aChildren));
                if (!success) {
                    return false;
                }
            }
        }
        return dir.delete();
    }
}
