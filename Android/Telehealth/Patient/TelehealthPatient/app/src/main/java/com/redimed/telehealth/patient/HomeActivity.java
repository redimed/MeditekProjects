package com.redimed.telehealth.patient;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.redimed.telehealth.patient.service.SocketService;

import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    private ActionBarDrawerToggle actionDrawerToggle;
    private boolean shouldFinish = false;
    private SocketService socketOpenTok;
    private BroadcastReceiver receiverDataSocketService;

    @Bind(R.id.txtHomeTitle) TextView txtHomeTitle;
    @Bind(R.id.patientDrawer) DrawerLayout patientDrawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        ButterKnife.bind(this);

        txtHomeTitle.setOnClickListener(this);

        DisplayDrawer();

        IntentFilter intentFilter = new IntentFilter("android.intent.action.MessageSocket");
        receiverDataSocketService = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String messageSocket = intent.getStringExtra("messageTransfer");
                Log.i("====MessageTransfer====", messageSocket);
            }
        };
        this.registerReceiver(receiverDataSocketService, intentFilter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        this.unregisterReceiver(this.receiverDataSocketService);
    }

    //Initialize Drawer
    private void DisplayDrawer() {
        actionDrawerToggle = new ActionBarDrawerToggle(this, patientDrawer, null, R.string.drawer_open, R.string.drawer_close){
            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                super.onDrawerSlide(drawerView, slideOffset);
                patientDrawer.bringChildToFront(drawerView);
                drawerView.requestLayout();
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
            }

            @Override
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
            }
        };
        patientDrawer.setDrawerListener(actionDrawerToggle);
        actionDrawerToggle.syncState();
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.txtHomeTitle:
                DisplayCall();
                break;
        }
    }

    private void DisplayCall() {
//        Intent i = new Intent(getApplicationContext(), CallActivity.class);
//        startActivity(i);
//        this.finish();

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", "+841234567890");
        params.put("to", "+84908618694");
        params.put("message", "call");
        try {
            SocketService.sendData("/telehealth/socket/messageTransfer", params);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        Log.i("Transfer",params.toString());
    }

    @Override
    public void onBackPressed() {
        if (!shouldFinish){
            Toast.makeText(getApplicationContext(), R.string.confirm_exit, Toast.LENGTH_SHORT).show();
            shouldFinish = true;
        }
        else {
            super.onBackPressed();
        }
    }
}
