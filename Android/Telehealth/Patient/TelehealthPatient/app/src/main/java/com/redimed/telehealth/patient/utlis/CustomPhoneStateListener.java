package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.content.Intent;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import com.redimed.telehealth.patient.services.SocketService;

/**
 * Created by LamNguyen on 1/6/2016.
 */
public class CustomPhoneStateListener extends PhoneStateListener {

    private Context context;
    public boolean flagPhoneState;

    public CustomPhoneStateListener(Context context) {
        super();
        this.context = context;
    }

    @Override
    public void onCallStateChanged(int state, String incomingNumber) {
        super.onCallStateChanged(state, incomingNumber);
        switch (state){
            case TelephonyManager.CALL_STATE_IDLE:
                //when Idle i.e no call
                flagPhoneState = true;
                context.stopService(new Intent(context, SocketService.class));
                Toast.makeText(context, "Phone state Idle", Toast.LENGTH_LONG).show();
                break;
            case TelephonyManager.CALL_STATE_OFFHOOK:
                //when Off hook i.e in call
                //Make intent and start your service here
                flagPhoneState = false;
                context.startService(new Intent(context, SocketService.class));
                Toast.makeText(context, "Phone state Off hook", Toast.LENGTH_LONG).show();
                break;
            case TelephonyManager.CALL_STATE_RINGING:
                //when Ringing
                flagPhoneState = true;
                context.stopService(new Intent(context, SocketService.class));
                Toast.makeText(context, "Phone state Ringing", Toast.LENGTH_LONG).show();
                break;
            default:
                break;
        }
    }
}
