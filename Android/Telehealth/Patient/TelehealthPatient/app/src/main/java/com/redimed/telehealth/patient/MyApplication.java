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
import android.support.multidex.MultiDex;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ArrayAdapter;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.network.RetrofitErrorHandler;
import com.redimed.telehealth.patient.receiver.BootReceiver;
import com.redimed.telehealth.patient.services.RegistrationIntentService;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by luann on 9/23/2015.
 */
public class MyApplication extends Application {

    private Gson gson;
    private RegisterApi registerApi;
    private FragmentActivity currentActivity;
    private static MyApplication myApplication;
    private static SharedPreferences.Editor editor;
    private static SharedPreferences appPreferences;
    private static final String TAG = "=====APPLICATION=====";

    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        initVariable();
        detectScreen();
        checkScreenDevice();
        isBackgroundCall();
    }

    public FragmentActivity getCurrentActivity() {
        return currentActivity;
    }

    public void setCurrentActivity(FragmentActivity mCurrentActivity){
        this.currentActivity = mCurrentActivity;
    }

    private void initVariable(){
        gson = new Gson();
        myApplication = this;
        RESTClient.InitRESTClient(this);
        registerApi = RESTClient.getRegisterApi();
        startService(new Intent(getApplicationContext(), RegistrationIntentService.class));

        // Preferences to store all ready created or not finding purpose.
        appPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        if (!(appPreferences.getBoolean("isShortcutCreated", false))) {
            AddShortcut();
        }

        createdJsonDataSuburb();
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

    /*
    * Change view with param
    * @param fragment
    * @param fragmentName
    * @param fragmentNameBackStack
    */
    public void replaceFragment(Fragment fragment) {
        if (fragment != null){
            final FragmentManager fragmentManager = getCurrentActivity().getSupportFragmentManager();
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

    public void createdJsonDataSuburb() {
        File file = new File("/data/data/" + getApplicationContext().getPackageName() + "/" +
                getResources().getString(R.string.fileSuburb));
        if (!file.exists()) {
            RestAdapter restAdapter = new RestAdapter.Builder()
                    .setLogLevel(RestAdapter.LogLevel.BASIC)
                    .setEndpoint("http://testapp.redimed.com.au:3001/api/urgent-care")
                    .setErrorHandler(new RetrofitErrorHandler(getApplicationContext()))
                    .build();

            registerApi = restAdapter.create(RegisterApi.class);
            registerApi.getListSuburb(new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    try {
                        FileWriter file = new FileWriter(
                                "/data/data/" + getApplicationContext().getPackageName() + "/" +
                                        getResources().getString(R.string.fileSuburb));
                        file.write(String.valueOf(jsonObject));
                        file.flush();
                        file.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d(TAG, error.getLocalizedMessage());
                }
            });
        }
    }

    public ArrayAdapter<String> loadJsonData() {
        ArrayAdapter<String> adapter = null;
        try {
            File file = new File("/data/data/" + getApplicationContext().getPackageName() + "/" + getResources().getString(R.string.fileSuburb));
            if (file.exists()) {
                FileInputStream is = new FileInputStream(file);
                int size = is.available();
                byte[] buffer = new byte[size];
                is.read(buffer);
                is.close();
                String mResponse = new String(buffer);

                JsonParser parser = new JsonParser();
                JsonObject obj = (JsonObject) parser.parse(mResponse);
                String[] suburbs = gson.fromJson(obj.get("data"), String[].class);
                adapter = new ArrayAdapter<>(MyApplication.this, R.layout.cardview_list_item, suburbs);
                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return adapter;
    }

    public boolean detectScreen() {
        WindowManager windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        DisplayMetrics metrics = new DisplayMetrics();
        windowManager.getDefaultDisplay().getMetrics(metrics);

        int widthPixels = metrics.widthPixels;
        int heightPixels = metrics.heightPixels;

        float scaleFactor = metrics.density;
        float widthDp = widthPixels / scaleFactor;
        float heightDp = heightPixels / scaleFactor;
        float smallestWidth = Math.min(widthDp, heightDp);
        if (smallestWidth > 600) {
             Log.d(TAG, "Success Access Redisite");
             return true;
        } else {
            return false;
        }
    }

    //Get all elements inside layout
    public ArrayList<View> getAllChildren(View v) {
        if (!(v instanceof ViewGroup)) {
            ArrayList<View> viewArrayList = new ArrayList<>();
            viewArrayList.add(v);
            return viewArrayList;
        }

        ArrayList<View> result = new ArrayList<>();
        ViewGroup vg = (ViewGroup) v;
        for (int i = 0; i < vg.getChildCount(); i++) {

            View child = vg.getChildAt(i);

            ArrayList<View> viewArrayList = new ArrayList<>();
            viewArrayList.add(v);
            viewArrayList.addAll(getAllChildren(child));

            result.addAll(viewArrayList);
        }
        return result;
    }

    public ArrayList<EFormData> getSelectedServices() {
        ArrayList<EFormData> eFormDataServices = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormDatas()) {
            switch (eFormData.getName()) {
                case "service1":
                    eFormDataServices.add(eFormData);
                    break;
                case "service2":
                    eFormDataServices.add(eFormData);
                    break;
                case "service3":
                    eFormDataServices.add(eFormData);
                    break;
                case "service4":
                    eFormDataServices.add(eFormData);
                    break;
                case "service5":
                    eFormDataServices.add(eFormData);
                    break;
                case "service6":
                    eFormDataServices.add(eFormData);
                    break;
                case "service7":
                    eFormDataServices.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataServices;
    }

    public ArrayList<EFormData> getSelectedInjury() {
        ArrayList<EFormData> eFormDataInjury = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormInjury()) {
            switch (eFormData.getName()) {
                case "is_sprain":
                    eFormDataInjury.add(eFormData);
                    break;
                case "is_laceration":
                    eFormDataInjury.add(eFormData);
                    break;
                case "is_crush":
                    eFormDataInjury.add(eFormData);
                    break;
                case "is_fall":
                    eFormDataInjury.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataInjury;
    }

    public ArrayList<EFormData> getSelectedMedicalHistory() {
        ArrayList<EFormData> eFormDataMedicalHistory = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormMedicalHistory()) {
            switch (eFormData.getName()) {
                case "medic_his1":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his2":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his3":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his4":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his5":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his6":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his7":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his8":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                case "medic_his9":
                    eFormDataMedicalHistory.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataMedicalHistory;
    }

    public ArrayList<EFormData> getSelectedInjurySymptoms() {
        ArrayList<EFormData> eFormDataInjurySymptoms = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormInjurySymptoms()) {
            switch (eFormData.getName()) {
                case "inj_sym1":
                    eFormDataInjurySymptoms.add(eFormData);
                    break;
                case "inj_sym2":
                    eFormDataInjurySymptoms.add(eFormData);
                    break;
                case "inj_sym3":
                    eFormDataInjurySymptoms.add(eFormData);
                    break;
                case "inj_sym4":
                    eFormDataInjurySymptoms.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataInjurySymptoms;
    }

    public ArrayList<EFormData> getSelectedBodyParts() {
        ArrayList<EFormData> eFormDataBodyParts = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormBodyParts()) {
            switch (eFormData.getName()) {
                case "part1":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part2":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part3":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part4":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part5":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part6":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part7":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part8":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part9":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part10":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part11":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part12":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part13":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part14":
                    eFormDataBodyParts.add(eFormData);
                    break;
                case "part15":
                    eFormDataBodyParts.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataBodyParts;
    }

    public ArrayList<EFormData> getSelectedSymptoms() {
        ArrayList<EFormData> eFormDataSymptoms = new ArrayList<>();
        for (EFormData eFormData : Singleton.getInstance().getEFormSymptoms()) {
            switch (eFormData.getName()) {
                case "sym1":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym2":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym3":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym4":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym5":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym6":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym7":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym8":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym9":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym10":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym11":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym12":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym13":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym14":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym15":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym16":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym17":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym18":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym19":
                    eFormDataSymptoms.add(eFormData);
                    break;
                case "sym20":
                    eFormDataSymptoms.add(eFormData);
                    break;
                default:
                    break;
            }
        }
        return eFormDataSymptoms;
    }

    public String getCurrentDateSystem() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z", Locale.ENGLISH);
        return simpleDateFormat.format(new Date());
    }
}