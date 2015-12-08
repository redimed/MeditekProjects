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

import android.app.IntentService;
import android.app.KeyguardManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.receiver.GcmBroadcastReceiver;
import com.redimed.telehealth.patient.utils.Config;

import org.json.JSONObject;

public class RegistrationIntentService extends IntentService {

    private Notification notification;
    private SharedPreferences uidTelehealth;
    private static int CALL_NOTIFICATION_ID = 0;
    private static SharedPreferences.Editor editor;
    private static String TAG = "RegIntentService";
    private NotificationManager notificationManager;

    public RegistrationIntentService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        editor = getSharedPreferences("DeviceInfo", MODE_PRIVATE).edit();
        try {
            InstanceID instanceID = InstanceID.getInstance(this);
            String token = instanceID.getToken(Config.GCMSenderID, GoogleCloudMessaging.INSTANCE_ID_SCOPE, null);
            String serialNumber = Build.SERIAL + Build.DEVICE;
            String deviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID) + serialNumber;

            editor.putBoolean("sendToken", true);
            editor.putString("systemType", "Android");
            editor.putString("deviceID", deviceId);
            editor.putString("gcmToken", token);
            editor.apply();

        Bundle data = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);
        String messageType = gcm.getMessageType(intent);
        if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
            Log.d("MESSAGE TYPE SEND ERROR", messageType);
        } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
            Log.d("MESSAGE TYPE DELETED", messageType);
        } else {
            if (data != null) {
                SendNotification(data.getString("data"));
            }
        }

        } catch (Exception e) {
            editor.putBoolean("sendToken", false);
            Log.d(TAG, "Failed to complete token refresh", e);
        }
        GcmBroadcastReceiver.completeWakefulIntent(intent);
    }

    private void SendNotification(String message) {
        Log.d(TAG, "Message: " + message);
        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        try {
            JSONObject msg = new JSONObject(message);
            Intent intent = new Intent(this, CallActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("apiKey", msg.get("apiKey").toString());
            intent.putExtra("sessionId", msg.get("sessionId").toString());
            intent.putExtra("token", msg.get("token").toString());
            intent.putExtra("to", msg.get("from").toString());
            intent.putExtra("from", uidTelehealth.getString("uid", null));
            intent.putExtra("message", msg.get("message").toString());
            intent.putExtra("fromName", msg.get("fromName").toString());

            PendingIntent contentIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

            //         Remote view and intent for my button
            RemoteViews contentView = new RemoteViews(getPackageName(), R.layout.custom_notification);
            contentView.setImageViewResource(R.id.imgLogo, R.mipmap.ic_launcher);
            contentView.setTextViewText(R.id.lblTitle, "REDIMED");
            contentView.setTextViewText(R.id.lblMessage, "This is a custom layout");

            notification = new NotificationCompat.Builder(this)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(getResources().getString(R.string.not_title))
                    .setContentText("You have message")
                    .setPriority(NotificationCompat.PRIORITY_MAX) // On top task bar
                    .setVibrate(new long[]{500, 1000})
                    .setLights(Color.BLUE, 3000, 3000)
                    .setSound(Settings.System.DEFAULT_NOTIFICATION_URI)
                    .setDefaults(Notification.DEFAULT_LIGHTS | Notification.DEFAULT_SOUND)
                    .setOngoing(true) //Do not clear the notification
//                    .setContent(contentView)
                    .setContentIntent(contentIntent)
                    .setWhen(System.currentTimeMillis())
                    .setAutoCancel(true)
                    .build();

            notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            notificationManager.cancelAll();
            notificationManager.notify(CALL_NOTIFICATION_ID, notification);

            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP
                    | PowerManager.ON_AFTER_RELEASE | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "INFO");
            wakeLock.acquire();
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
        }
    }
}
