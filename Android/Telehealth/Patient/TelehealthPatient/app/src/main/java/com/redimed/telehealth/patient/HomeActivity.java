package com.redimed.telehealth.patient;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.RVAdapter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    private String TAG ="HOME";
    private ActionBarDrawerToggle actionDrawerToggle;
    private boolean shouldFinish = false;
    private RegisterApi restClient;
    private String sessionID, token, apiKey;
    private MyApplication mApplication;
    private LinearLayoutManager layoutManagerCategories;
    private RVAdapter rvAdapter;
    private List<Category> categories;

    @Bind(R.id.testSocket) Button testSocket;
    @Bind(R.id.testSession) Button testSession;
    @Bind(R.id.drawerCategories) DrawerLayout drawerCategories;
    @Bind(R.id.rvCategories) RecyclerView rvCategories;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        restClient = RESTClient.getRegisterApi();

        ButterKnife.bind(this);
        SocketService.JoinRoom();
        initializeData();

        rvCategories.setHasFixedSize(true);
        layoutManagerCategories = new LinearLayoutManager(getApplicationContext());
        rvCategories.setLayoutManager(layoutManagerCategories);
        rvAdapter = new RVAdapter(categories);
        rvCategories.setAdapter(rvAdapter);

        testSocket.setOnClickListener(this);
        testSession.setOnClickListener(this);
        mApplication = (MyApplication) getApplicationContext();

        DisplayDrawer();
    }

    private void initializeData(){
        categories = new ArrayList<Category>();
        categories.add(new Category(R.drawable.person_icon, "Information", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Share Image", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Menu3", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Menu4", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.person_icon, "Menu5", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Menu6", R.drawable.circled_chevron_right_icon));
        categories.add(new Category(R.drawable.share_image_icon, "Menu7", R.drawable.circled_chevron_right_icon));
    }

    //Initialize Drawer
    private void DisplayDrawer() {
        actionDrawerToggle = new ActionBarDrawerToggle(this, drawerCategories, null, R.string.drawer_open, R.string.drawer_close){
            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                super.onDrawerSlide(drawerView, slideOffset);
                drawerCategories.bringChildToFront(drawerView);
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
        drawerCategories.setDrawerListener(actionDrawerToggle);
        actionDrawerToggle.syncState();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.testSocket:
                CallActivity();
                break;
            case R.id.testSession:
                GenerationSession();
                break;
        }
    }

    private void GenerationSession() {
        restClient.generateSession(new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")){
                    sessionID = jsonObject.getAsJsonObject("data").get("sessionId").getAsString();
                    token = jsonObject.getAsJsonObject("data").get("token").getAsString();
                    apiKey = jsonObject.getAsJsonObject("data").get("apiKey").getAsString();
                    Toast.makeText(getApplicationContext(), "OK", Toast.LENGTH_LONG).show();
                }
            }
            @Override
            public void failure(RetrofitError error) {
                Log.d("Error", error.toString());
            }
        });
    }

    private void CallActivity() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", "0f77bd78-f674-41a6-8f9c-255721b4a3bd");
        params.put("to", "7674468e-6593-4974-9f86-a2addcc59507");
//        params.put("to", "b65266b4-d5a9-4769-85a7-c30cdab0ceea");
        params.put("message", "call");
        params.put("sessionId", sessionID);
        try {
            SocketService.sendData("socket/messageTransfer", params);
            startActivity(new Intent(this, CallActivity.class));
            Toast.makeText(this, "Clinic: " + params.toString(), Toast.LENGTH_LONG).show();
            finish();
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
