package com.redimed.telehealth.patient;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
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
        mApplication = (MyApplication) getApplicationContext();

        DisplayDrawer();
        ListenSocket();
    }

    //Listen action response when clinic make a call
    private void ListenSocket() {
        DisplayDrawer();

        IntentFilter intentFilter = new IntentFilter("android.intent.action.MessageSocket");
        receiverDataSocketService = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String message = "";
                String strSocket = intent.getStringExtra("Message");
                try {
                    JSONObject jsonSocket = new JSONObject(strSocket);
                    message = jsonSocket.get("message").toString();
                    Log.i("====Message====", message);
                    if (message.equalsIgnoreCase("call")){
                        intent = new Intent(HomeActivity.this, CallActivity.class);
                        intent.putExtra("apiKey", jsonSocket.get("apiKey").toString());
                        intent.putExtra("sessionId", jsonSocket.get("sessionId").toString());
                        intent.putExtra("token", jsonSocket.get("token").toString());
                        intent.putExtra("to", jsonSocket.get("from").toString());
                        intent.putExtra("from", mApplication.getUserAccount().getPhoneNumber());
                        startActivity(intent);
                        HomeActivity.this.finish();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
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
                    jsonObjectGlobal = jsonObject.getAsJsonObject("data");
                    Log.d(TAG, sessionID);
                }
            }
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
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", "+84908618694");
        //params.put("to", "+841267146714");
        params.put("to", "+84988880682");
        params.put("to", "+841267146714");
        params.put("message", "call");
        params.put("sessionId", sessionID);
        try {
            SocketService.sendData("socket/messageTransfer", params);
            SharedPreferences.Editor editor = (SharedPreferences.Editor) getApplicationContext().getSharedPreferences("Clinic", MODE_PRIVATE).edit();
            editor.putString("apiKey", jsonObjectGlobal.get("apiKey").toString());
            editor.putString("sessionId", jsonObjectGlobal.get("sessionId").toString());
            editor.putString("token", jsonObjectGlobal.get("token").toString());
            editor.commit();
            startActivity(new Intent(HomeActivity.this, CallActivity.class));
            HomeActivity.this.finish();
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
