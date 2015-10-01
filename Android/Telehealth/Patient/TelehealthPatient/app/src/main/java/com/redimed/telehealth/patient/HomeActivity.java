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
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;

import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    private static String TAG ="HOME";
    private ActionBarDrawerToggle actionDrawerToggle;
    private boolean shouldFinish = false;
    private BroadcastReceiver receiverDataSocketService;
    private RegisterApi restClient = RESTClient.getRegisterApi();
    private String sessionID;
    @Bind(R.id.testSocket) Button testSocket;
    @Bind(R.id.testSession) Button testSession;
    @Bind(R.id.patientDrawer) DrawerLayout patientDrawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        ButterKnife.bind(this);

        testSocket.setOnClickListener(this);
        testSession.setOnClickListener(this);

        DisplayDrawer();

        IntentFilter intentFilter = new IntentFilter("android.intent.action.MessageSocket");
        receiverDataSocketService = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String messageSocket = intent.getStringExtra("Message");
                Log.i("====Message====", messageSocket);
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
            case R.id.testSocket:
                DisplayCall();
                break;
            case R.id.testSession:
                TestSession();
                break;
        }
    }

    private void TestSession() {
        restClient.generateSession(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                Log.d("OK", jsonObject.toString());
                if (status.equalsIgnoreCase("success")){
                    sessionID = jsonObject.getAsJsonObject("data").get("sessionId").getAsString();
                    Log.d(TAG, sessionID);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                Log.d("Error", error.toString());
            }
        });
    }

    private void DisplayCall() {
//        Intent i = new Intent(getApplicationContext(), CallActivity.class);
//        startActivity(i);
//        this.finish();

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", "+84908618694");
        params.put("to", "+841267146714");
        params.put("message", "call");
        params.put("sessionId", sessionID);
        try {
            SocketService.sendData("socket/messageTransfer", params);
            Toast.makeText(this, "Clinic: " + params.toString(), Toast.LENGTH_LONG).show();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
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
