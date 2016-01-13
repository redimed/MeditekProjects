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
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.receiver.BootReceiver;
import com.redimed.telehealth.patient.service.RegistrationIntentService;
import com.redimed.telehealth.patient.service.SocketService;
import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application {

    private BroadcastReceiver receiver;
    private static MyApplication myApplication;
    private String TAG = "MyApplication", result;
    private static SharedPreferences.Editor editor;
    private static SharedPreferences appPreferences, callPreferences, uidTelehealth;

    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        RESTClient.InitRESTClient(this);

        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_SCREEN_ON);
        intentFilter.addAction(Intent.ACTION_SCREEN_OFF);
        receiver = new BootReceiver();
        registerReceiver(receiver, intentFilter);

        startService(new Intent(getApplicationContext(), RegistrationIntentService.class));

        uidTelehealth = this.getSharedPreferences("TelehealthUser", MODE_PRIVATE);

        // Preferences to store all ready created or not finding purpose.
        appPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (!(appPreferences.getBoolean("isShortcutCreated", false))) {
            AddShortcut();
        }

        callPreferences = this.getSharedPreferences("FlagCall", MODE_PRIVATE);
        editor = callPreferences.edit();
        editor.putBoolean("isBackground", true);
        editor.commit();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    public void clearApplication() {
        File cache = getCacheDir();
        File appDir = new File(cache.getParent());

        if (appDir.exists()) {
            String[] children = appDir.list();
            for (String s : children) {
                if (!s.equals("lib")) {
                    deleteDir(new File(appDir, s));
                    SocketService.closeSockets();
                }
            }
        }
    }

    public static boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }
        return dir.delete();
    }

    public String Logout() {
        Gson gson = new Gson();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("token", "null");
        jsonObject.addProperty("uid", uidTelehealth.getString("uid", null));

        JsonObject dataJson = new JsonObject();
        dataJson.addProperty("data", gson.toJson(jsonObject));

        RESTClient.getRegisterApi().updateToken(dataJson, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("status").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    RESTClient.getRegisterApiLogin().logout(new Callback<JsonObject>() {
                        @Override
                        public void success(JsonObject jsonObject, Response response) {
                            String message = jsonObject.get("status").getAsString();
                            if (message.equals("success")) {
                                clearApplication();
                                result = message;
                            }
                        }

                        @Override
                        public void failure(RetrofitError error) {
                            result = error.getLocalizedMessage();
                        }
                    });
                }
            }

            @Override
            public void failure(RetrofitError error) {
            }
        });
        clearApplication();
        return result = "success";
    }

    @NonNull
    public String ConvertDate(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date myDate = null;
        String finalDate = " ";
        try {
            myDate = dateFormat.parse(dataTime);
            SimpleDateFormat timeFormat = new SimpleDateFormat("dd/MM/yyyy");
            finalDate = timeFormat.format(myDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return finalDate;
    }

    @NonNull
    public String ConvertTime(String dataTime) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Date myDate = null;
        String finalDate = " ";
        try {
            myDate = dateFormat.parse(dataTime);
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");
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

        SharedPreferences.Editor editor = appPreferences.edit();
        editor.putBoolean("isShortcutCreated", true);
        editor.commit();
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

        SharedPreferences.Editor editor = appPreferences.edit();
        editor.putBoolean("isShortcutCreated", false);
        editor.commit();
    }
}