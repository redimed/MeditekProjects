package patient.telehealth.redimed.workinjury.receiver;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.socket.SocketService;
import patient.telehealth.redimed.workinjury.utils.CustomPhoneStateListener;

/**
 * Created by luann on 9/23/2015.
 */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();

        //Check state phone
        TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        telephonyManager.listen(new CustomPhoneStateListener(context), PhoneStateListener.LISTEN_CALL_STATE);

        //Check screen and device lock or not
//        KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
//        if (keyguardManager.inKeyguardRestrictedInputMode()) {
//            if (action.equals(Intent.ACTION_SCREEN_OFF) && MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
//                // when screen lock do requirements for device screen off and socket service running
//            }
//        }
//        if (action.equals(Intent.ACTION_SCREEN_ON) && !MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
//            // do requirements for device screen on and socket service not running
//        }
        if (action.equalsIgnoreCase("notification_cancelled")) {
            if (!MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
                context.startService(new Intent(context, SocketService.class));
            }
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("from", intent.getExtras().getString("from"));
            params.put("to", intent.getExtras().getString("to"));
            params.put("message", "decline");
            try {
                SocketService.sendData("socket/messageTransfer", params);
                if (isRunning(context)) {
                    LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(context);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.finish"));
                }
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        }
        if (action.equalsIgnoreCase("android.intent.action.BOOT_COMPLETED")){
            context.startService(new Intent(context, SocketService.class));
        }
        Log.d("RECEIVER", action + "");
    }

    //Check service running
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
