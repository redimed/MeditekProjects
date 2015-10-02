package com.redimed.telehealth.patient;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.accessibility.AccessibilityManager;
import android.widget.Toast;

import com.redimed.telehealth.patient.models.UserAccount;
import com.redimed.telehealth.patient.service.SocketService;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class LoadingActivity extends AppCompatActivity {

    private SharedPreferences dataUser;
    MyApplication mApplication;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading);
        mApplication = (MyApplication) getApplicationContext();
        startService(new Intent(getApplicationContext(), SocketService.class));
        dataUser = getSharedPreferences("DataUser", MODE_PRIVATE);
        File xmlUser = new File("/data/data/" + getApplicationContext().getPackageName() + "/shared_prefs/DataUser.xml");

        if (xmlUser.exists()) {

            userAccount = new UserAccount();
            userAccount.setID(dataUser.getInt("ID", 0));
            userAccount.setUserName(dataUser.getString("UserName", null));
            userAccount.setPhoneNumber(dataUser.getString("PhoneNumber", null));
            userAccount.setEmail(dataUser.getString("Email", null));
            MyApplication mApplication = (MyApplication) getApplicationContext();
            mApplication.setCurrUser(userAccount);
            intent = new Intent(this, HomeActivity.class);
            startActivity(intent);
        } else {
            JoinRoom();
            intent = new Intent(this, HomeActivity.class);
            startActivity(intent);
    }

    public void JoinRoom() {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("phone", mApplication.getUserAccount().getPhoneNumber());
            SocketService.sendData("socket/joinRoom", params);
            Toast.makeText(getApplicationContext(), "Join Room: " + params.toString(), Toast.LENGTH_LONG).show();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }
}
