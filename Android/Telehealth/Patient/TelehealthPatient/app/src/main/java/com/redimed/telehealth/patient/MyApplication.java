package com.redimed.telehealth.patient;

import android.app.Application;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application{
    private static MyApplication myApplication;

    public static MyApplication getInstance(){
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
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
