package com.redimed.telehealth.patient.main.presenter;

import android.content.Context;
import android.content.SharedPreferences;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.widget.ArrayAdapter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.main.view.IMainView;
import com.redimed.telehealth.patient.network.RESTClient;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by Fox on 1/14/2016.
 */
public class MainPresenter implements IMainPresenter {

    private Context context;
    private IMainView iMainView;
    private FragmentActivity activity;
    private static final String TAG = "=====MAIN=====";

    //Constructor
    public MainPresenter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
    }

    @Override
    public void replaceFragment(Fragment fragment) {
        if (fragment != null){
            final FragmentManager fragmentManager = activity.getSupportFragmentManager();
            final int newBackStackLength = fragmentManager.getBackStackEntryCount() + 1;

            fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment)
                    .addToBackStack(null)
                    .commit();

            fragmentManager.addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
                @Override
                public void onBackStackChanged() {
                    int nowCount = fragmentManager.getBackStackEntryCount();
                    if (newBackStackLength != nowCount) {
                        fragmentManager.removeOnBackStackChangedListener(this);

                        if (newBackStackLength > nowCount) {
                            fragmentManager.popBackStackImmediate();
                        }
                    }
                }
            });
        }
    }
}
