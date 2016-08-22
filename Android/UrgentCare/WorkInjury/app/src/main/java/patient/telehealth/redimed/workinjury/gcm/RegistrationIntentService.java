package patient.telehealth.redimed.workinjury.gcm;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;


import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.utils.Config;

public class RegistrationIntentService extends IntentService {
    private static final String TAG = "RegIntentService";
    private MyApplication application;
    public RegistrationIntentService() {
        super(TAG);
        application = MyApplication.getInstance();
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(Config.SenderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            application.setDataSharedPreferences("deviceToken", token);
            Log.i(TAG, "GCM Registration Token: " + token);
        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
        }
    }
}
