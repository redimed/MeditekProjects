/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package patient.telehealth.redimed.workinjury.notification;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.PowerManager;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;


import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.receiver.BootReceiver;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.waiting.WaitingActivity;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private Notification notification;
    private PendingIntent contentIntent;
    private NotificationCompat.Builder builder;
    private static final String TAG = "MyFirebaseMsgService";
    private MyApplication application;

    /**
     * Called when message is received.
     *
     * @param remoteMessage Object representing the message received from Firebase Cloud Messaging.
     */
    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        application = MyApplication.getInstance();
        // If the application is in the foreground handle both data and notification messages here.
        // Also if you intend on generating your own notifications as a result of a received FCM
        // message, here is where that should be initiated. See sendNotification method below.
        Log.d(TAG, "Notification Message Body: " + remoteMessage.getData());
        sendNotification(String.valueOf(remoteMessage.getData().get("data")));
    }
    // [END receive_message]

    /**
     * Create and show a simple notification containing the received FCM message.
     *
     * @param messageBody FCM message body received.
     */
    private void sendNotification(String messageBody) {
        Intent intent;
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        try {
            JSONObject msg = new JSONObject(messageBody);
            Log.d("sendNotification", msg.get("message").toString());
            if (msg.get("message").toString().equalsIgnoreCase("call")) {
                intent = new Intent(this, WaitingActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("apiKey", msg.get("apiKey").toString());
                intent.putExtra("sessionId", msg.get("sessionId").toString());
                intent.putExtra("token", msg.get("token").toString());
                intent.putExtra("to", msg.get("from").toString());
                intent.putExtra("from", String.valueOf(application.getDataSharedPreferences(Key.teleUid, Key.defalt)));
                intent.putExtra("message", msg.get("message").toString());
                intent.putExtra("fromName", msg.get("fromName").toString());

                contentIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);

                builder = (NotificationCompat.Builder) new NotificationCompat.Builder(this)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle(getResources().getString(R.string.not_title))
                        .setContentText("You have message")
                        .setPriority(android.support.v7.app.NotificationCompat.PRIORITY_MAX) // On top task bar
                        .setVibrate(new long[]{500, 1000})
                        .setLights(Color.BLUE, 3000, 3000)
//                        .setSound(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.ringtone))
                        .setDefaults(Notification.DEFAULT_LIGHTS | Notification.DEFAULT_VIBRATE) // Defaults Light and Sound
                        .setContentIntent(contentIntent)
                        .setWhen(System.currentTimeMillis())
                        .setDeleteIntent(deleteIntent(msg));

                notification = builder.build();
                notification.flags |= Notification.FLAG_AUTO_CANCEL;
                notification.flags |= Notification.FLAG_INSISTENT;

                int CALL_NOTIFICATION_ID = 0;
                notificationManager.notify(CALL_NOTIFICATION_ID, notification);

                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK
                        | PowerManager.ACQUIRE_CAUSES_WAKEUP
                        | PowerManager.ON_AFTER_RELEASE
                        | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "INFO");
                wakeLock.acquire();
            }
            if (msg.get("message").toString().equalsIgnoreCase("cancel")) {
                notificationManager.cancel(0);
            }
        } catch (Exception e) {
            Log.d(TAG, e.getLocalizedMessage());
        }
    }

    private PendingIntent deleteIntent(JSONObject msg) {
        Intent intent = new Intent(this, BootReceiver.class);
        try {
            intent.putExtra("from", String.valueOf(application.getDataSharedPreferences(Key.teleUid, Key.defalt)));
            intent.putExtra("to", msg.get("from").toString());
            intent.setAction("notification_cancelled");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
    }

    @Override
    protected Intent zzaa(Intent intent) {
        return null;
    }
}
