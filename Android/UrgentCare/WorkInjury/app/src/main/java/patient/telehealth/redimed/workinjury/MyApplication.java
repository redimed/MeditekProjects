package patient.telehealth.redimed.workinjury;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import patient.telehealth.redimed.workinjury.company.CompanyDetailFragment;
import patient.telehealth.redimed.workinjury.gcm.RegistrationIntentService;
import patient.telehealth.redimed.workinjury.home.HomeFragment;
import patient.telehealth.redimed.workinjury.login.LoginFragment;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.setting.SettingFragment;
import patient.telehealth.redimed.workinjury.staff.StaffListFragment;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;

/**
 * Created by Lam on 11/6/2015.
 */
public class MyApplication extends Application {
    private static MyApplication myApplication;
    private Gson gson;


    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        gson = new Gson();
        RESTClient.InitRESTClient(this);
        TypefaceUtil.overrideFont(getApplicationContext(), "serif", "fonts/Roboto-Regular.ttf");
        startService(new Intent(this, RegistrationIntentService.class));
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
    }

    public void replaceFragment(FragmentActivity activity, Fragment fragment, String fragmentName, String backStack) {
        try {
            if (fragment != null){
                FragmentManager fragmentManager = activity.getSupportFragmentManager();
                if (backStack != null){
                    fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment, fragmentName)
                    .addToBackStack(backStack)
                    .commit();
                }else {
                    fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment, fragmentName)
                    .commit();
                }
            }
        }catch (Exception e){
            Log.d("replaceFragment", e.getMessage());
        }
    }

    public void hidenKeyboard(final View view){
        try {
            //Set up touch listener for non-text box views to hide keyboard.
            if (!(view instanceof EditText)) {
                view.setOnTouchListener(new View.OnTouchListener() {
                    public boolean onTouch(View v, MotionEvent event) {
                        InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(Activity.INPUT_METHOD_SERVICE);
                        inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
                        return false;
                    }
                });
            }

            //If a layout container, iterate over children and seed recursion.
            if (view instanceof ViewGroup) {
                for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                    View innerView = ((ViewGroup) view).getChildAt(i);
                    hidenKeyboard(innerView);
                }
            }
        }catch (Exception e){
            Log.d("hidenKeyboard", e.getMessage());
        }
    }

    @SuppressLint("LongLogTag")
    public void setDataSharedPreferences(String name, Object value){
        try {
            SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
            if( value instanceof String ) {
                editor.putString(name, (String) value);
            }else if (value instanceof Boolean){
                editor.putBoolean(name, (Boolean) value);
            }
            editor.commit();
        }catch (Exception e){
            Log.e("setDataSharedPreferences",e.getMessage());
        }

    }

    @SuppressLint("LongLogTag")
    public Object getDataSharedPreferences(String name, Object defaultValue){
        try {
            SharedPreferences workInjury = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE);
            if( defaultValue instanceof String ) {
                return workInjury.getString(name, (String) defaultValue);
            }else if (defaultValue instanceof Boolean){
                return workInjury.getBoolean(name, (Boolean) defaultValue);
            }
        }catch (Exception e){
            Log.e("getDataSharedPreferences",e.getMessage());
        }
        return null;
    }

    @SuppressLint("LongLogTag")
    public void clearDataSharedPreferences(){
        try {
            SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
            editor.clear();
            editor.commit();
        }catch (Exception e){
            Log.e("clearDataSharedPreferences",e.getMessage());
        }

    }

    public String parseToJson(String[] arr){
        Map<String, String>  map = new HashMap<>();
        for(int i=0;i<arr.length;i++) {
            map.put(arr[i], arr[i+1]);
            i = i+1;
        }
        return gson.toJson(map, Map.class);
    }

    public JsonObject createJson(String[] arr){
        JsonObject object = new JsonObject();
        for(int i=0;i<arr.length;i++) {
            object.addProperty(arr[i],arr[i+1]);
            i = i+1;
        }
        return object;
    }

    public void createTooBar(View view, Activity activity, String title){
        try {
            //init toolbar
            AppCompatActivity appCompatActivity = (AppCompatActivity) activity;
            Toolbar toolbar = (Toolbar) view.findViewById(R.id.tool_bar);
            appCompatActivity.setSupportActionBar(toolbar);

            ActionBar actionBar = appCompatActivity.getSupportActionBar();
            if (actionBar != null) {
                actionBar.setHomeButtonEnabled(true);
                actionBar.setTitle(title);
                //actionBar.setLogo(img);
                actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
                actionBar.setDisplayHomeAsUpEnabled(true);
                actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
                actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

                // Change color image back, set a custom icon for the default home button abc_ic_clear_mtrl_alpha
//                final Drawable upArrow = ContextCompat.getDrawable(activity, R.drawable.abc_ic_clear_mtrl_alpha);
//                upArrow.setColorFilter(ContextCompat.getColor(activity, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
//                actionBar.setHomeAsUpIndicator(upArrow);
            }
        }catch (Exception e){
            Log.d("createTooBar",e.getMessage());
        }
    }

    public void BackFragment(Activity activity, String fragment, String backFragment){
        try {
            AppCompatActivity compatActivity = (AppCompatActivity) activity;
            FragmentActivity fragmentActivity = (FragmentActivity) activity;

            FragmentManager fragmentManager = compatActivity.getSupportFragmentManager();
            int count = fragmentManager.getBackStackEntryCount();
            FragmentManager.BackStackEntry entry = fragmentManager.getBackStackEntryAt(count -1);

            String name = (fragment != null) ? fragment : entry.getName();
            String back = backFragment;

            Log.d("BackFragment", name);
            Log.d("BackFragment", back+"");

            Fragment fragmentCreate = null;

            if (name.equalsIgnoreCase(getString(R.string.home))){
                fragmentCreate = new HomeFragment();
                back = null;
            }else if (name.equalsIgnoreCase(getString(R.string.setting))){
                fragmentCreate = new SettingFragment();
                if(back == null)
                    back = getString(R.string.home);
            }else if (name.equalsIgnoreCase(getString(R.string.login))){
                fragmentCreate = new LoginFragment();
                if (back == null)
                    back = getString(R.string.home);
            }else if (name.equalsIgnoreCase(getString(R.string.staff_list))){
                fragmentCreate = new StaffListFragment();
                if (back ==  null)
                    back = getString(R.string.staff_list);
            }else if (name.equalsIgnoreCase(Key.fmCompanyDetail)){
                fragmentCreate = new CompanyDetailFragment();
                if (back == null)
                    back = getString(R.string.setting);
            }
            Log.d("BackFragment", name);
            Log.d("BackFragment", back+"");
            Log.d("BackFragment", fragmentCreate+"");

            replaceFragment(fragmentActivity,fragmentCreate,name,back);
        }catch (Exception e){
            Log.e("BackFragment",e.getMessage());
        }
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
}
