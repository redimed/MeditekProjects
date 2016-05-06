package patient.telehealth.redimed.workinjury.gcm;

import android.app.IntentService;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import patient.telehealth.redimed.workinjury.utils.Config;

public class RegistrationIntentService extends IntentService {
    private static final String TAG = "RegIntentService";
    public RegistrationIntentService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(Config.SenderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            SharedPreferences.Editor editor = getSharedPreferences("WorkInjury", MODE_PRIVATE).edit();
            editor.putString("deviceToken", token);
            editor.apply();
            Log.i(TAG, "GCM Registration Token: " + token);
        } catch (Exception e) {
            Log.d(TAG, "Failed to complete token refresh", e);
        }
    }
}
