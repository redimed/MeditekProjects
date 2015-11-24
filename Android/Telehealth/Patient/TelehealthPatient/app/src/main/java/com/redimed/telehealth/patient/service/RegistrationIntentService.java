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
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.content.WakefulBroadcastReceiver;
import android.support.v7.app.NotificationCompat;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;

import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.receiver.GcmBroadcastReceiver;
import com.redimed.telehealth.patient.utils.Config;

public class RegistrationIntentService extends IntentService {

    private static String TAG = "RegIntentService";
    private static SharedPreferences.Editor editor;

    public RegistrationIntentService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        editor = getSharedPreferences("DeviceInfo", MODE_PRIVATE).edit();
        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(Config.GCMSenderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
//            String deviceId = ((TelephonyManager)getSystemService(Context.TELEPHONY_SERVICE)).getDeviceId();

            String serialNumber = Build.SERIAL + Build.DEVICE;
            String deviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID) + serialNumber;

            editor.putBoolean("sendToken", true);
            editor.putString("systemType", "Android");
            editor.putString("deviceID", deviceId);
            editor.putString("gcmToken", token);
            editor.apply();

            Bundle data = intent.getExtras();
            if (data.getString("data") != null) {
                String message = data.getString("data");
                Log.d(TAG, message);
            }

        } catch (Exception e) {
            editor.putBoolean("sendToken", false);
            Log.d(TAG, "Failed to complete token refresh", e);
        }
        GcmBroadcastReceiver.completeWakefulIntent(intent);
    }

    private void sendNotification(String message) {
        Log.d(TAG, message);
        Intent intent = new Intent(getApplicationContext(), CallActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(getApplicationContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = (NotificationCompat.Builder) new NotificationCompat.Builder(getApplicationContext())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setTicker(getResources().getString(R.string.not_title))
                .setDefaults(Notification.DEFAULT_LIGHTS | Notification.DEFAULT_SOUND)
                .setContentIntent(contentIntent);
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
//            builder = builder.setContent(getComplexNotificationView());
//        } else {
//            builder = builder.setContentTitle(getTitle())
//                    .setContentText(getText())
//                    .setSmallIcon(android.R.drawable.ic_menu_gallery);
//        }

//        RemoteViews contentView = new RemoteViews(getPackageName(), R.layout.custom_notification);
//        contentView.setTextViewText(R.id.title, "Custom notification");
//        contentView.setTextViewText(R.id.text, "This is a custom layout");
//        contentView.setOnClickPendingIntent(R.id.btnEnd, contentIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(100, builder.build());
    }
}
