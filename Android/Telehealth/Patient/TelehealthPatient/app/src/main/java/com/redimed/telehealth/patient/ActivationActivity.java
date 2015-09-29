package com.redimed.telehealth.patient;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
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

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.models.UserAccount;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.CustomDialog;
import com.squareup.picasso.Picasso;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class ActivationActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.vfChangeLayout) ViewFlipper vfChangeLayout;
    @Bind(R.id.imgEnterPhone) ImageView imgEnterPhone;

    @Bind(R.id.btnEnterPhone) Button btnEnterPhone;
    @Bind(R.id.btnPostCode) Button btnPostCode;
    @Bind(R.id.btnVerifyPhone) Button btnVerifyPhone;

    @Bind(R.id.txtPhoneNumber) EditText txtPhoneNumber;
    @Bind(R.id.txtVerifyCode) EditText txtVerifyCode;
    @Bind(R.id.tbActivation) Toolbar tbActivation;

    private Intent i;

    private boolean flagBackActivationLayout = true;
    private RegisterApi registerApi = RESTClient.getRegisterApi();
    private Gson gson = new Gson();
    private TelehealthUser telehealthUser;
    private JsonObject patientJSON;
    private SharedPreferences spDevice;

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
    }

    //Event click to call function
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnEnterPhone:
                CheckPhoneNumber();
                break;
            case R.id.btnVerifyPhone:
                LoginByVerifyCode();
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

    //Validated phone number match 10-15 digit numbers
    private void CheckPhoneNumber() {
        String phoneExpression = "^[0-9][0-9]{9,14}$";
        Pattern patternPhoneExpression = Pattern.compile(phoneExpression);
        Matcher matcherPhoneExpression = patternPhoneExpression.matcher(txtPhoneNumber.getText());

        if (matcherPhoneExpression.matches()) {
            char subPhone = txtPhoneNumber.getText().charAt(0);
            String phoneNumber;
            if(subPhone == '0'){
                phoneNumber = btnPostCode.getText().toString() +  txtPhoneNumber.getText().toString().substring(1);
            }
            else {
                phoneNumber = btnPostCode.getText().toString() +  txtPhoneNumber.getText().toString();
            }
            GetDeviceInfo(phoneNumber);
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

    //Register phone number with get token device
    private void GetDeviceInfo(String phoneNumber) {
        spDevice = getApplicationContext().getSharedPreferences("DeviceInfo", MODE_PRIVATE);
        boolean sendToken = spDevice.getBoolean("sendToken", false);
        String deviceToken = spDevice.getString("deviceToken", null);
        String deviceType = spDevice.getString("deviceType", null);

        telehealthUser = new TelehealthUser();
        telehealthUser.setPhone(phoneNumber);
        telehealthUser.setDeviceID(deviceToken);
        telehealthUser.setDeviceType(deviceType);

        patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        if (sendToken == true) {
            registerApi.activation(patientJSON, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String status = jsonObject.get("status").getAsString();
                    String message = jsonObject.get("message").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        vfChangeLayout.showNext();
                    } else {
                        new CustomDialog(ActivationActivity.this, CustomDialog.State.Error, message).show();
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    new CustomDialog(ActivationActivity.this, CustomDialog.State.Error, error.getLocalizedMessage()).show();
                }
            });
        }
    }

    //Return layout when click back icon in custom_toolbar
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

    //Compare code input with code receive from server
    private void LoginByVerifyCode() {
        String verifyCode = txtVerifyCode.getText().toString();
        if(spDevice != null){
            Boolean sendToken = spDevice.getBoolean("sendToken", false);
            telehealthUser.setCode(verifyCode);
            patientJSON.addProperty("data", gson.toJson(telehealthUser));
            if (sendToken == true) {
                registerApi.verify(patientJSON, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        String status = jsonObject.get("status").getAsString();
                        String message = jsonObject.get("message").getAsString();
                        if (status.equalsIgnoreCase("success")){
                            SharedPreferences.Editor dataUserAccount = getSharedPreferences("DataUser", MODE_PRIVATE).edit();
                            dataUserAccount.putInt("ID", jsonObject.getAsJsonObject("data").get("ID").getAsInt());
                            dataUserAccount.putString("UserName", jsonObject.getAsJsonObject("data").get("userName").getAsString());
                            dataUserAccount.putString("PhoneNumber", jsonObject.getAsJsonObject("data").get("phoneNumber").getAsString());
                            dataUserAccount.putString("Email", jsonObject.getAsJsonObject("data").get("email").getAsString());
                            dataUserAccount.apply();
                            Intent i = new Intent(getApplicationContext(), HomeActivity.class);
                            startActivity(i);
                        }else {
                            new CustomDialog(ActivationActivity.this, CustomDialog.State.Error, message).show();
                        }
                    }
                    @Override
                    public void failure(RetrofitError error) {
                        new CustomDialog(ActivationActivity.this, CustomDialog.State.Error, error.getLocalizedMessage()).show();
                    }
                });
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
