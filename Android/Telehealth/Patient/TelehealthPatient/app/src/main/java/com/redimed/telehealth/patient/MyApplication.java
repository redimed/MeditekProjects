package com.redimed.telehealth.patient;

import android.app.Application;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.util.Log;

import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.RegistrationIntentService;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application {

    private String TAG = "MyApplication";
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

    public void clearApplication(){
        File cache = getCacheDir();
        File appDir = new File(cache.getParent());

        if (appDir.exists()){
            String[] children = appDir.list();

            for (String s : children){
                if (!s.equals("lib")){
                    deleteDir(new File(appDir, s));
                }
            }
        }
    }

    public static boolean deleteDir(File dir) {
        if(dir != null && dir.isDirectory()){
            String[] children = dir.list();

            for (int i = 0; i < children.length; i++){
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success){
                    return false;
                }
            }
        }
        return dir.delete();
    }

    @NonNull
    public String ConvertDateTime(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date myDate = null;
        try {
            myDate = dateFormat.parse(dataTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String finalDate = timeFormat.format(myDate);
        return finalDate;
    }
}