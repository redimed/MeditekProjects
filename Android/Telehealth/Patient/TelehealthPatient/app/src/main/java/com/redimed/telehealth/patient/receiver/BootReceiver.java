package com.redimed.telehealth.patient.receiver;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.util.Log;
import android.view.WindowManager;

import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.service.SocketService;

/**
 * Created by luann on 9/23/2015.
 */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
        if (keyguardManager.inKeyguardRestrictedInputMode()){
            if (action.equals(Intent.ACTION_SCREEN_OFF) && MyApplication.getInstance().IsMyServiceRunning(SocketService.class)){
                context.stopService(new Intent(context, SocketService.class));
                Log.d("======Stop Socket===== ", MyApplication.getInstance().IsMyServiceRunning(SocketService.class) + "");
            }
        }else {
            if (action.equals(Intent.ACTION_SCREEN_ON)){
                context.startService(new Intent(context, SocketService.class));
                Log.d("=====Start Socket=====", MyApplication.getInstance().IsMyServiceRunning(SocketService.class) + "");
            }
        }
    }
}
