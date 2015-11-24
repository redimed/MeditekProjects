/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 * <p/>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p/>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p/>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.redimed.telehealth.patient.service;

import android.app.Activity;
import android.app.IntentService;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.content.WakefulBroadcastReceiver;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import com.redimed.telehealth.patient.utils.Config;

public class    RegistrationIntentService extends IntentService {

    private static String TAG = "RegIntentService";
    private static SharedPreferences.Editor editor;

    public RegistrationIntentService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(Config.GCMSenderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            String deviceId = ((TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();

            editor = getSharedPreferences("DeviceInfo", MODE_PRIVATE).edit();
            editor.putBoolean("sendToken", true);
            editor.putString("systemType", "Android");
            editor.putString("deviceID", deviceId);
            editor.putString("gcmToken", token);
            editor.apply();

            Log.d(TAG, "GCM Registration Token: " + token);
            Log.d(TAG, "Device ID: " + deviceId);

        } catch (Exception e) {
            editor.putBoolean("sendToken", false);
            Log.d(TAG, "Failed to complete token refresh", e);
        }
        GcmBroadcastReceiver.completeWakefulIntent(intent);
    }
}

class GcmBroadcastReceiver extends WakefulBroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // Explicitly specify that RegistrationIntentService will handle the intent.
        ComponentName comp = new ComponentName(context.getPackageName(),  RegistrationIntentService.class.getName());
        // Start the service, keeping the device awake while it is launching.
        startWakefulService(context, (intent.setComponent(comp)));
        setResultCode(Activity.RESULT_OK);
    }
}
