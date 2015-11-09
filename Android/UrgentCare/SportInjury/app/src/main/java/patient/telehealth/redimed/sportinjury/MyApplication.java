package patient.telehealth.redimed.sportinjury;

import android.app.Application;

import patient.telehealth.redimed.sportinjury.network.RESTClient;
import patient.telehealth.redimed.sportinjury.utils.TypefaceUtil;

/**
 * Created by Lam on 11/3/2015.
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
