package com.redimed.telehealth.patient;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.redimed.telehealth.patient.models.UserAccount;
import com.redimed.telehealth.patient.service.MyInstanceIDListenerService;
import com.redimed.telehealth.patient.service.RegistrationIntentService;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application{

    private static MyApplication myApplication;

    private UserAccount currUser;

    public UserAccount getCurrUser() {
        return currUser;
    }

    public void setCurrUser(UserAccount currUser) {
        this.currUser = currUser;
    }


    public static MyApplication getInstance(){
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;

        Intent intent = new Intent(this, RegistrationIntentService.class);
        startService(intent);
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }
}
