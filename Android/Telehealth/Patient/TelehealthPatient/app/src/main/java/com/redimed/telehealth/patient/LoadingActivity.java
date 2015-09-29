package com.redimed.telehealth.patient;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.redimed.telehealth.patient.models.UserAccount;

import java.io.File;

public class LoadingActivity extends AppCompatActivity {

    private SharedPreferences dataUser;
    public UserAccount userAccount;
    Intent intent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_loading);
        dataUser = getSharedPreferences("DataUser", MODE_PRIVATE);
        File xmlUser = new File("/data/data/" + getApplicationContext().getPackageName() + "/shared_prefs/DataUser.xml");

        if (xmlUser.exists()) {

            userAccount = new UserAccount();
            userAccount.setID(dataUser.getInt("ID", 0));
            userAccount.setUserName(dataUser.getString("UserName", null));
            userAccount.setPhoneNumber(dataUser.getString("Phone", null));
            userAccount.setEmail(dataUser.getString("Email", null));

            MyApplication mApplication = (MyApplication) getApplicationContext();
            mApplication.setCurrUser(userAccount);
            intent = new Intent(this, HomeActivity.class);
            startActivity(intent);
        } else {
            intent = new Intent(this, ActivationActivity.class);
            startActivity(intent);
        }
    }

}
