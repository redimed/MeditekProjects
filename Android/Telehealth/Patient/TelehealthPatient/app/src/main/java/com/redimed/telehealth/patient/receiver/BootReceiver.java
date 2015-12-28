package com.redimed.telehealth.patient.receiver;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.KeyguardManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.view.WindowManager;

import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.LauncherActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.service.SocketService;

import java.security.acl.LastOwnerException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by luann on 9/23/2015.
 */
public class BootReceiver extends BroadcastReceiver {

    private LocalBroadcastManager localBroadcastManager;

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
        if (keyguardManager.inKeyguardRestrictedInputMode()) {
            if (action.equals(Intent.ACTION_SCREEN_OFF) && MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
//                context.stopService(new Intent(context, SocketService.class));
            }
        }
        if (action.equals(Intent.ACTION_SCREEN_ON) && !MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
//            context.startService(new Intent(context, SocketService.class));
        }
        if (action.equalsIgnoreCase("notification_cancelled")) {
            if (!MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
                Log.d("BOOT", MyApplication.getInstance().IsMyServiceRunning(SocketService.class) + " ");
                context.startService(new Intent(context, SocketService.class));
            }
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("from", intent.getExtras().getString("from"));
            params.put("to", intent.getExtras().getString("to"));
            params.put("message", "decline");
            try {
                SocketService.sendData("socket/messageTransfer", params);
                if (isRunning(context)) {
                    localBroadcastManager = LocalBroadcastManager.getInstance(context);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.finish"));
                }
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        }
        Log.d("RECEIVER", action.toString());
    }

    public boolean isRunning(Context ctx) {
        ActivityManager activityManager = (ActivityManager) ctx.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> tasks = activityManager.getRunningTasks(Integer.MAX_VALUE);

        for (ActivityManager.RunningTaskInfo task : tasks) {
            if (ctx.getPackageName().equalsIgnoreCase(task.baseActivity.getPackageName())) {
                return true;
            }
        }
        return false;
    }
}
