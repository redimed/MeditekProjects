/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.redimed.telehealth.patient.service;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;

import com.google.android.gms.gcm.GcmListenerService;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;

public class MyGcmListenerService extends GcmListenerService {

    private static final String TAG = "MyGcmListenerService";

    @Override
    public void onMessageReceived(String from, Bundle data) {
        if (data != null){
            //sendNotification(data.getString("data"));
        }
    }

    private void sendNotification(String message) {
        Log.d(TAG, "Message: " + message);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 0, new Intent(this, CallActivity.class), 0);

        //         Remote view and intent for my button
        RemoteViews contentView = new RemoteViews(this.getPackageName(), R.layout.custom_notification);
        contentView.setImageViewResource(R.id.imgLogo, R.mipmap.ic_launcher);
        contentView.setTextViewText(R.id.lblTitle, "REDIMED");
        contentView.setTextViewText(R.id.lblMessage, "This is a custom layout");

        Notification notification = new NotificationCompat.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(getResources().getString(R.string.not_title))
                .setPriority(NotificationCompat.PRIORITY_MAX) // On top bar
                .setVibrate(new long[]{1000, 1000, 1000, 1000, 1000})
                .setLights(Color.BLUE, 3000, 3000)
                .setSound(Settings.System.DEFAULT_NOTIFICATION_URI)
                .setDefaults(Notification.DEFAULT_LIGHTS | Notification.DEFAULT_SOUND)
                .setOngoing(true) //Do not clear the notification
                .setContentIntent(contentIntent)
                .setWhen(System.currentTimeMillis())
                .setAutoCancel(true)
//                .setContent(contentView)
                .build();

        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        notificationManager.notify(0, notification);
    }
}
