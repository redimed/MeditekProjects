package patient.telehealth.redimed.workinjury;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.util.HashMap;
import java.util.Map;
import patient.telehealth.redimed.workinjury.gcm.RegistrationIntentService;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;

/**
 * Created by Lam on 11/6/2015.
 */
public class MyApplication extends Application {
    private String TAG = "MyApplication";
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

    public void replaceFragment(FragmentActivity activity, Fragment fragment) {
        if (fragment != null){
            final FragmentManager fragmentManager = activity.getSupportFragmentManager();
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

    public void hidenKeyboard(View view){
        InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }

    public void setDataSharedPreferences(String name, Object value){
        SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
        if( value instanceof String ) {
            editor.putString(name, (String) value);
        }else if (value instanceof Boolean){
            editor.putBoolean(name, (Boolean) value);
        }
        editor.commit();
    }

    public Object getDataSharedPreferences(String name, Object defaultValue){
        SharedPreferences workInjury = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE);
        if( defaultValue instanceof String ) {
            return workInjury.getString(name, (String) defaultValue);
        }else if (defaultValue instanceof Boolean){
            return workInjury.getBoolean(name, (Boolean) defaultValue);
        }
        return null;
    }

    public void clearDataSharedPreferences(){
        SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", Context.MODE_PRIVATE).edit();
        editor.clear();
        editor.commit();
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
}
