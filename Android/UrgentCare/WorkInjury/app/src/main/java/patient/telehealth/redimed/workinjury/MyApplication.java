package patient.telehealth.redimed.workinjury;

import android.app.Application;
import android.content.Intent;
import android.util.Log;

import patient.telehealth.redimed.workinjury.gcm.RegistrationIntentService;
import patient.telehealth.redimed.workinjury.network.RESTClient;
import patient.telehealth.redimed.workinjury.utils.TypefaceUtil;

/**
 * Created by Lam on 11/6/2015.
 */
public class MyApplication extends Application {
    private String TAG = "MyApplication";
    private static MyApplication myApplication;


    public static MyApplication getInstance() {
        return myApplication;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        myApplication = this;
        RESTClient.InitRESTClient(this);
        TypefaceUtil.overrideFont(getApplicationContext(), "serif", "fonts/Roboto-Regular.ttf");
        startService(new Intent(this, RegistrationIntentService.class));
        Log.d(TAG, "RUN APPLICATION");
        Log.d("chien", android.os.Build.MANUFACTURER+android.os.Build.MODEL);
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
