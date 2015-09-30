package com.redimed.telehealth.patient;

import android.app.Application;
import android.content.Intent;

<<<<<<< HEAD
import com.redimed.telehealth.patient.models.TelehealthUser;
=======
>>>>>>> commit
import com.redimed.telehealth.patient.service.RegistrationIntentService;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application{

    private TelehealthUser telehealthUser;

    private static MyApplication myApplication;

    public static MyApplication getInstance(){
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
<<<<<<< HEAD
        startService(new Intent(getApplicationContext(), RegistrationIntentService.class));
=======

        Intent intent = new Intent(this, RegistrationIntentService.class);
        startService(intent);


>>>>>>> commit
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
