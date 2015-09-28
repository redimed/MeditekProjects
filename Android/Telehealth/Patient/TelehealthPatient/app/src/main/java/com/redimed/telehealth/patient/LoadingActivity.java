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
        if (xmlUser.exists()){
            userAccount = new UserAccount();
            userAccount.setID(dataUser.getInt("ID", 0));
            userAccount.setUserName(dataUser.getString("UserName", null));
            userAccount.setPhoneNumber(dataUser.getString("Phone", null));
            userAccount.setEmail(dataUser.getString("Email", null));
            intent = new Intent(this, HomeActivity.class);
            startActivity(intent);
        }else {
            intent = new Intent(this, ActivationActivity.class);
            startActivity(intent);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_loading, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
