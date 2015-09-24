package com.redimed.telehealth.patient;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.iid.InstanceID;
import com.redimed.telehealth.patient.service.RegistrationIntentService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;

public class ActivationActivity extends AppCompatActivity implements View.OnClickListener, TextWatcher {

    Intent i;
    @Bind(R.id.vfChangeLayout)
    ViewFlipper vfChangeLayout;
    @Bind(R.id.imgEnterPhone)
    ImageView imgEnterPhone;
    @Bind(R.id.btnEnterPhone)
    Button btnEnterPhone;
    @Bind(R.id.btnPostCode)
    Button btnPostCode;
    @Bind(R.id.btnVerifyPhone)
    Button btnVerifyPhone;
    @Bind(R.id.txtPhoneNumber)
    EditText txtPhoneNumber;
    @Bind(R.id.txtCode1)
    EditText txtCode1;
    @Bind(R.id.txtCode2)
    EditText txtCode2;
    @Bind(R.id.txtCode3)
    EditText txtCode3;
    @Bind(R.id.txtCode4)
    EditText txtCode4;
    @Bind(R.id.tbActivation)
    Toolbar tbActivation;
    int count = 0;
    boolean flagBackActivationLayout = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activation);

        //Initialize variable and action
        ButterKnife.bind(this);

        Picasso.with(getApplicationContext()).load(R.drawable.bg_activation)
                .transform(new BlurTransformation(getApplicationContext(), 15)).into(imgEnterPhone);

        btnEnterPhone.setOnClickListener(this);
        btnPostCode.setOnClickListener(this);
        btnVerifyPhone.setOnClickListener(this);

        txtCode1.addTextChangedListener(this);
        txtCode2.addTextChangedListener(this);
        txtCode3.addTextChangedListener(this);
        txtCode4.addTextChangedListener(this);
    }

    //Event click to call function
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnEnterPhone:
                CheckPhoneNumber();
                break;
            case R.id.btnVerifyPhone:
                CheckVerifyCode();
                break;
            case R.id.btnPostCode:
                i = new Intent(this, CountryCodeActivity.class);
                startActivityForResult(i, 1);
                break;
        }
    }

    //Receive data Country Code
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == Activity.RESULT_OK) {
            String countryCode = data.getStringExtra(CountryCodeActivity.RESULT_COUNTRY_CODE);
            btnPostCode.setText(countryCode);
        }
    }

    //Validated phone number 8 digits (XXXXXXXX)
    private void CheckPhoneNumber() {
        String phoneExpression = "^[0-9]{2}(\\ |-){0,1}[0-9]{2}(\\ |-){0,1}[0-9]{1}(\\ |-){0,1}[0-9]{3}$";
        Pattern patternPhoneExpression = Pattern.compile(phoneExpression);
        Matcher matcherPhoneExpression = patternPhoneExpression.matcher(txtPhoneNumber.getText());

        if (matcherPhoneExpression.matches()) {
            vfChangeLayout.showNext();
            flagBackActivationLayout = false;
            if (!flagBackActivationLayout) {
                if (tbActivation != null) {
                    setSupportActionBar(tbActivation);
                    final ActionBar ab = getSupportActionBar();

                    ab.setDisplayShowHomeEnabled(true);
                    ab.setDisplayHomeAsUpEnabled(true);
                    ab.setDisplayShowCustomEnabled(true);
                    ab.setDisplayShowTitleEnabled(true);
                    ab.setHomeButtonEnabled(true);
                }
            }
        } else {
            Toast.makeText(getApplicationContext(), R.string.alert_wrong_phone, Toast.LENGTH_LONG).show();
        }
    }

    //Return layout when click back icon in toolbar
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                i = new Intent(getApplicationContext(), ActivationActivity.class);
                startActivity(i);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    //Get country zip code from array
//    public String GetCountryZipCode(){
//        String CountryID="";
//        String CountryZipCode="";
//
//        TelephonyManager manager = (TelephonyManager) this.getSystemService(Context.TELEPHONY_SERVICE);
//        //getNetworkCountryIso
//        CountryID= manager.getSimCountryIso().toUpperCase();
//        String[] rl=this.getResources().getStringArray(R.array.CountryCodes);
//        for(int i=0; i < rl.length;i++){
//            String[] g=rl[i].split(",");
//            if(g[1].trim().equals(CountryID.trim())){
//                CountryZipCode=g[0];
//                break;
//            }
//        }
//        Log.d("ZipCode",CountryZipCode);
//        return CountryZipCode;
//    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    //Next other Edit Text when written
    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        if (txtCode1.getText().toString().length() == 1) {
            txtCode2.requestFocus();
            if (txtCode2.getText().toString().length() == 1) {
                txtCode3.requestFocus();
                if (txtCode3.getText().toString().length() == 1) {
                    txtCode4.requestFocus();
                }
            }
        }
    }

    @Override
    public void afterTextChanged(Editable s) {

    }

    //Compare code input with code receive from server
    private void CheckVerifyCode() {
        String verifyCode = txtCode1.getText().toString() + txtCode2.getText().toString() + txtCode3.getText().toString() + txtCode4.getText().toString();
        if (verifyCode.equals("1234")) {
            Intent i = new Intent(getApplicationContext(), HomeActivity.class);
            startActivity(i);
        } else {
            count++;
            Toast.makeText(getApplicationContext(), R.string.code_invalid, Toast.LENGTH_SHORT).show();
            txtCode1.getText().clear();
            txtCode2.getText().clear();
            txtCode3.getText().clear();
            txtCode4.getText().clear();
            txtCode1.setFocusableInTouchMode(true);
            txtCode1.requestFocus();
            if (count == 2) {
                Toast.makeText(getApplicationContext(), R.string.code_sent_request_again, Toast.LENGTH_LONG).show();
            }
        }
    }


    //Hide keyboard when touch out Edit Text
    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        View v = getCurrentFocus();

        if (v != null &&
                (ev.getAction() == MotionEvent.ACTION_UP || ev.getAction() == MotionEvent.ACTION_MOVE) &&
                v instanceof EditText &&
                !v.getClass().getName().startsWith("android.webkit.")) {
            int scrcoords[] = new int[2];
            v.getLocationOnScreen(scrcoords);
            float x = ev.getRawX() + v.getLeft() - scrcoords[0];
            float y = ev.getRawY() + v.getTop() - scrcoords[1];

            if (x < v.getLeft() || x > v.getRight() || y < v.getTop() || y > v.getBottom())
                hideKeyboard(this);
        }
        return super.dispatchTouchEvent(ev);
    }

    public static void hideKeyboard(AppCompatActivity activity) {
        if (activity != null && activity.getWindow() != null && activity.getWindow().getDecorView() != null) {
            InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(activity.getWindow().getDecorView().getWindowToken(), 0);
        }
    }
}
