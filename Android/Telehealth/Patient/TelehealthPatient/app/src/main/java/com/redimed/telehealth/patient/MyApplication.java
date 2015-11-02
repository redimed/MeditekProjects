package com.redimed.telehealth.patient;

import android.app.Application;
import android.content.Intent;

import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.RegistrationIntentService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application {

    private TelehealthUser telehealthUser;

    private static MyApplication myApplication;

    public static MyApplication getInstance() {
        return myApplication;
    }

    public TelehealthUser getTelehealthUser() {
        return telehealthUser;
    }

    public void setTelehealthUser(TelehealthUser telehealthUser) {
        this.telehealthUser = telehealthUser;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        RESTClient.InitRESTClient(this);
        startService(new Intent(getApplicationContext(), RegistrationIntentService.class));
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    public boolean isJSONValid(String test) {
        try {
            new JSONObject(test);
        } catch (JSONException ex) {
            try {
                new JSONArray(test);
            } catch (JSONException ex1) {
                return false;
            }
        }
        return true;
    }
}