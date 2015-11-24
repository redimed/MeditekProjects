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
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.TaskStackBuilder;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;

import com.google.android.gms.gcm.GcmListenerService;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.R;

public class MyGcmListenerService extends GcmListenerService {

    private static final String TAG = "MyGcmListenerService";

    @Override
    public void onMessageReceived(String from, Bundle data) {
        Log.d(TAG, data.toString() );

        String message = data.getString("message");
        Log.d(TAG, "From: " + from);
        Log.d(TAG, "Message: " + message);
        if (message != null){
            sendNotification(message);
        }
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

        RemoteViews contentView = new RemoteViews(getPackageName(), R.layout.custom_notification_call);
        contentView.setTextViewText(R.id.title, "Custom notification");
        contentView.setTextViewText(R.id.text, "This is a custom layout");
        contentView.setOnClickPendingIntent(R.id.btnEnd, contentIntent);

        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(100, builder.build());
    }
}
