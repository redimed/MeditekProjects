package com.redimed.telehealth.patient.setting.presenter;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
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
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.services.RegistrationIntentService;
import com.redimed.telehealth.patient.setting.view.ISettingView;

import java.io.File;

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
    private RegisterApi restClient;
    private ISettingView iSettingView;
    private IMainPresenter iMainPresenter;
    private static final String TAG = "===SETTING_PRESENTER===";

    public SettingPresenter(ISettingView iSettingView, Context context, FragmentActivity activity) {
        this.context = context;
        this.iSettingView = iSettingView;

        gson = new Gson();
        restClient = RESTClient.getRegisterApi();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public void getInfoPatient(String teleUID) {
        restClient.getDetailsPatient(teleUID, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    patients = gson.fromJson(jsonObject.get("data").toString(), Patient[].class);
                    iSettingView.displayShortInfo(patients);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                iSettingView.onLoadError(error.getLocalizedMessage());
            }
        });
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
    public void logout(final String uid) {
        final AlertDialog alertDialog = new android.support.v7.app.AlertDialog.Builder(context).create();
        alertDialog.setTitle(context.getResources().getString(R.string.logout));
        alertDialog.setMessage(context.getResources().getString(R.string.un_title));

        alertDialog.setButton(Dialog.BUTTON_NEGATIVE, "Logout", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                clearApplication();
                clearDataServer(uid);
                context.startService(new Intent(context, RegistrationIntentService.class));
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

    private void clearDataServer(String uid) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("uid", uid);

        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("data", gson.toJson(jsonObject));

        restClient.logout(dataJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d(TAG, error.getLocalizedMessage());
            }
        });
    }


    private void clearApplication() {
        File cache = context.getCacheDir();
        File appDir = new File(cache.getParent());
        if (appDir.exists()) {
            //Get all folder include /data/data/com.redimed.telehealth.patient
            String[] children = appDir.list();
            for (String s : children) {
                if (s.equals("shared_prefs")) {
                    clearSharedPreferences(new File(appDir, s));
                }
            }
        }
    }

    private void clearSharedPreferences(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            //Get child in each folder
            for (String aChildren : children) {
                String prefName = aChildren.substring(0, aChildren.length() - 4);
                SharedPreferences pref = context.getApplicationContext().getSharedPreferences(prefName, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = pref.edit();
                editor.clear().apply();
            }
        }
    }

//    private void clearApplication() {
//        File cache = context.getCacheDir();
//        File appDir = new File(cache.getParent());
//        if (appDir.exists()) {
//            //Get all folder include /data/data/com.redimed.telehealth.patient
//            String[] children = appDir.list();
//            for (String s : children) {
//                if (!s.equals("lib")) {
//                    deleteDir(new File(appDir, s));
//                }
//            }
//        }
//    }
//
//    private static boolean deleteDir(File dir) {
//        if (dir != null && dir.isDirectory()) {
//            String[] children = dir.list();
//            //Get child in each folder
//            for (String aChildren : children) {
//                boolean success = deleteDir(new File(dir, aChildren));
//                if (!success) {
//                    return false;
//                }
//            }
//        }
//        return dir.delete();
//    }
}
