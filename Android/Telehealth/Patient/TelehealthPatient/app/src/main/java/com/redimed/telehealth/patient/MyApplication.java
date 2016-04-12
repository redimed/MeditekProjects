package com.redimed.telehealth.patient;

import android.app.ActivityManager;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;

import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.receiver.BootReceiver;
import com.redimed.telehealth.patient.services.RegistrationIntentService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;


/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application {

    private static MyApplication myApplication;
    private static SharedPreferences.Editor editor;
    private static SharedPreferences appPreferences;
    private static final String TAG = "=====APPLICATION=====";

    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        initVariable();
        checkScreenDevice();
        isBackgroundCall();
    }

    private void initVariable(){
        myApplication = this;
        RESTClient.InitRESTClient(this);
        startService(new Intent(getApplicationContext(), RegistrationIntentService.class));

        // Preferences to store all ready created or not finding purpose.
        appPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (!(appPreferences.getBoolean("isShortcutCreated", false))) {
            AddShortcut();
        }
    }

    private void isBackgroundCall() {
        SharedPreferences callPreferences = this.getSharedPreferences("FlagCall", MODE_PRIVATE);
        editor = callPreferences.edit();
        editor.putBoolean("isBackground", true);
        editor.apply();
    }

    private void checkScreenDevice() {
        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_SCREEN_OFF);
        BroadcastReceiver receiver = new BootReceiver();
        registerReceiver(receiver, intentFilter);
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    @NonNull
    public String ConvertDate(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date myDate = null;
        String finalDate = "NONE";
        try {
            myDate = dateFormat.parse(dataTime);
            SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy");
            timeFormat.setTimeZone(TimeZone.getDefault());
            finalDate = timeFormat.format(myDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

    @NonNull
    public String ConvertTime(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        Date myDate = null;
        String finalDate = "NONE";
        try {
            myDate = dateFormat.parse(dataTime);
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
            timeFormat.setTimeZone(TimeZone.getDefault());
            finalDate = timeFormat.format(myDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

    public boolean IsMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    private void AddShortcut() {
        //Adding shortcut on Home screen
        Intent shortcutIntent = new Intent(getApplicationContext(), LauncherActivity.class);
        shortcutIntent.setAction(Intent.ACTION_MAIN);

        Intent addIntent = new Intent();
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_NAME, getResources().getString(R.string.app_name));
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE,
                Intent.ShortcutIconResource.fromContext(getApplicationContext(), R.mipmap.ic_launcher));
        addIntent.setAction("com.android.launcher.action.INSTALL_SHORTCUT");
        getApplicationContext().sendBroadcast(addIntent);

        editor = appPreferences.edit();
        editor.putBoolean("isShortcutCreated", true);
        editor.apply();
    }

    private void RemoveShortcut() {
        //Adding shortcut on Home screen
        Intent shortcutIntent = new Intent(getApplicationContext(), LauncherActivity.class);
        shortcutIntent.setAction(Intent.ACTION_MAIN);

        Intent addIntent = new Intent();
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_INTENT, shortcutIntent);
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_NAME, getResources().getString(R.string.app_name));
        addIntent.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE,
                Intent.ShortcutIconResource.fromContext(getApplicationContext(), R.mipmap.ic_launcher));
        addIntent.setAction("com.android.launcher.action.UNINSTALL_SHORTCUT"); // Deleting shortcut on Home screen
        getApplicationContext().sendBroadcast(addIntent);

        editor = appPreferences.edit();
        editor.putBoolean("isShortcutCreated", false);
        editor.apply();
    }
}