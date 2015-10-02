package com.redimed.telehealth.patient;

import android.app.Application;
import android.content.Intent;

import com.redimed.telehealth.patient.models.UserAccount;
import com.redimed.telehealth.patient.service.RegistrationIntentService;
import com.redimed.telehealth.patient.service.SocketService;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application{

    private UserAccount userAccount;
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

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
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
}
