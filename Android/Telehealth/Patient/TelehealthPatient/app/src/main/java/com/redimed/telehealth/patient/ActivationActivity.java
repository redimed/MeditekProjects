package com.redimed.telehealth.patient;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;

public class ActivationActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.imgEnterPhone) ImageView imgEnterPhone;
    @Bind(R.id.btnEnterPhone) Button btnEnterPhone;
    @Bind(R.id.txtPhoneNumber) EditText txtPhoneNumber;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activation);
        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.bg_activation).transform(new BlurTransformation(getApplicationContext(),15)).into(imgEnterPhone);
        btnEnterPhone.setOnClickListener(this);


    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnEnterPhone:
                CheckPhoneNumber();
                break;
        }
    }

    //Validated phone number 8 digits (XXXXXXXX)
    private void CheckPhoneNumber(){
        String phoneExpression = "^[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$";
        Pattern patternPhoneExpression = Pattern.compile(phoneExpression);
        Matcher matcherPhoneExpression = patternPhoneExpression.matcher(txtPhoneNumber.getText());

        if (matcherPhoneExpression.matches()){
            Intent i = new Intent(getApplicationContext(), VerifyCodeActivity.class);
            startActivity(i);
        }
        else {
            Toast.makeText(getApplicationContext(), R.string.alert_wrong_phone, Toast.LENGTH_LONG).show();
        }
    }


    //Get country zip code from array
    public String GetCountryZipCode(){
        String CountryID="";
        String CountryZipCode="";

        TelephonyManager manager = (TelephonyManager) this.getSystemService(Context.TELEPHONY_SERVICE);
        //getNetworkCountryIso
        CountryID= manager.getSimCountryIso().toUpperCase();
        String[] rl=this.getResources().getStringArray(R.array.CountryCodes);
        for(int i=0;i<rl.length;i++){
            String[] g=rl[i].split(",");
            if(g[1].trim().equals(CountryID.trim())){
                CountryZipCode=g[0];
                break;
            }
        }
        Log.d("ZipCode",CountryZipCode);
        return CountryZipCode;
    }

}
