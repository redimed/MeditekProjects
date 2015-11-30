package com.redimed.telehealth.patient.receiver;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.support.v7.app.NotificationCompat;
import android.util.Log;
import android.widget.RemoteViews;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.R;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by LamNguyen on 11/30/2015.
 */
public class NotifyServiceReceiver extends BroadcastReceiver {

    private Notification notification;
    private int MY_NOTIFICATION_ID_1 = 1;
    private int MY_NOTIFICATION_ID_2 = 2;
    private int BASIC_NOTIFICATION_ID = 0;
    private int RQS_SEND_NOTIFICATION_1 = 1;
    private int RQS_SEND_NOTIFICATION_2 = 2;
    private SharedPreferences uidTelehealth;
    private String TAG = "NotifyServiceReceiver";
    private NotificationManager notificationManager;

    @Override
    public void onReceive(Context context, Intent intent) {
//        int rqs = intent.getIntExtra("id", 0);
//        if (rqs == RQS_SEND_NOTIFICATION_1) {
//            String msg = intent.getStringExtra("message");
//            SendNotification(MY_NOTIFICATION_ID_1, msg, context);
//
//        } else if (rqs == RQS_SEND_NOTIFICATION_2) {
//            String msg = intent.getStringExtra("TARGET");
//            SendNotification(MY_NOTIFICATION_ID_2, msg, context);
//        }

        Bundle data = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(context);
        String messageType = gcm.getMessageType(intent);
        if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
        } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
        } else {
            if (data != null) {
                SendNotification(0, data.getString("data"), context);
            }
        }
    }

    private void SendNotification(int id, String message, Context context) {
        uidTelehealth = context.getSharedPreferences("TelehealthUser", context.MODE_PRIVATE);
        Log.d(TAG, message);
        try {
            JSONObject msg = new JSONObject(message);
            Intent intent = new Intent(context, CallActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            intent.putExtra("apiKey", msg.get("apiKey").toString());
            intent.putExtra("sessionId", msg.get("sessionId").toString());
            intent.putExtra("token", msg.get("token").toString());
            intent.putExtra("to", msg.get("from").toString());
            intent.putExtra("from", uidTelehealth.getString("uid", null));
            intent.putExtra("message", msg.get("message").toString());
            intent.putExtra("fromName", msg.get("fromName").toString());

            PendingIntent contentIntent = PendingIntent.getActivity(
                    context, BASIC_NOTIFICATION_ID, intent, PendingIntent.FLAG_UPDATE_CURRENT
            );

            //         Remote view and intent for my button
            RemoteViews contentView = new RemoteViews(context.getPackageName(), R.layout.custom_notification);
            contentView.setImageViewResource(R.id.imgLogo, R.mipmap.ic_launcher);
            contentView.setTextViewText(R.id.lblTitle, "REDIMED");
            contentView.setTextViewText(R.id.lblMessage, "This is a custom layout");

            notification = new NotificationCompat.Builder(context)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setPriority(NotificationCompat.PRIORITY_MAX)
                    .setVibrate(new long[]{1000, 1000, 1000, 1000, 1000})
                    .setLights(Color.BLUE, 3000, 3000)
                    .setSound(Settings.System.DEFAULT_NOTIFICATION_URI)
                    .setDefaults(Notification.DEFAULT_LIGHTS | Notification.DEFAULT_SOUND)
                    .setOngoing(true) //Do not clear the notification
                    .setContent(contentView)
                    .setContentIntent(contentIntent)
                    .setWhen(System.currentTimeMillis())
                    .setAutoCancel(true).build();

            notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(id, notification);

            PowerManager pm = (PowerManager) context.getApplicationContext().getSystemService(Context.POWER_SERVICE);
            PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.FULL_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP
                    | PowerManager.ON_AFTER_RELEASE | PowerManager.SCREEN_BRIGHT_WAKE_LOCK, "INFO");
            wakeLock.acquire();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
