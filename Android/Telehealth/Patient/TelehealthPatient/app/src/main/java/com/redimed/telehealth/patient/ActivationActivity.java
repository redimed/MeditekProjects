package com.redimed.telehealth.patient;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.picker.CountryPicker;
import com.redimed.telehealth.patient.picker.CountryPickerListener;
import com.redimed.telehealth.patient.service.RegistrationIntentService;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;

import java.lang.reflect.Field;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class ActivationActivity extends AppCompatActivity implements View.OnClickListener {

    @Bind(R.id.logo)
    ImageView mLogo;

    //=======Layout 1=========
    @Bind(R.id.btnCode)
    ImageButton btnCode;
    @Bind(R.id.btnRequestCode)
    Button btnRequestCode;
    @Bind(R.id.lblPhoneCode)
    TextView lblPhoneCode;
    @Bind(R.id.txtPhone)
    EditText txtPhone;

    //======Layout 2==========
    @Bind(R.id.btnSubmitCode)
    Button btnSubmitCode;
    @Bind(R.id.btnBack)
    RelativeLayout btnBack;
    @Bind(R.id.txtVerifyCode)
    EditText txtVerifyCode;

    @Bind(R.id.layoutContainer)
    ViewFlipper layoutContainer;
    @Bind(R.id.activationLayout)
    RelativeLayout activationLayout;

    private Gson gson;
    private String phoneCode;
    private JsonObject patientJSON;
    private String TAG = "ACTIVATION";
    private SharedPreferences spDevice;
    private CountryPicker countryPicker;
    private TelehealthUser telehealthUser;
    private RegisterApi registerApi, registerApiLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activation);
        ButterKnife.bind(this);
        gson = new Gson();
        registerApi = RESTClient.getRegisterApi();
        registerApiLogin = RESTClient.getRegisterApiLogin();

        Picasso.with(this).load(R.drawable.logo_redimed).into(mLogo);
        Picasso.with(this).load(R.drawable.bg_activation)
                .into(new Target() {
                    @Override
                    public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                            activationLayout.setBackgroundDrawable(new BitmapDrawable(getApplicationContext().getResources(), bitmap));
                            activationLayout.invalidate();
                        } else {
                            activationLayout.setBackground(new BitmapDrawable(getApplicationContext().getResources(), bitmap));
                            activationLayout.invalidate();
                        }
                    }

                    @Override
                    public void onBitmapFailed(Drawable errorDrawable) {
                        Log.d(TAG, "Erorr " + errorDrawable);
                    }

                    @Override
                    public void onPrepareLoad(Drawable placeHolderDrawable) {
                        Log.d(TAG, "Prepare Load " + placeHolderDrawable);
                    }
                });

        phoneCode = "+61";
        lblPhoneCode.setText("(+61)");

        countryPicker = CountryPicker.newInstance("Select Country");
        countryPicker.setListener(new CountryPickerListener() {
            @Override
            public void onSelectCountry(String name, String code, String phone) {
                String drawableName = "flag_" + code.toLowerCase(Locale.ENGLISH);
                btnCode.setImageResource(getResId(drawableName));
                phoneCode = "+" + phone;
                lblPhoneCode.setText("(+" + phone + ")");
                countryPicker.dismiss();
            }
        });

        btnCode.setOnClickListener(this);
        btnRequestCode.setOnClickListener(this);
        btnSubmitCode.setOnClickListener(this);
        btnBack.setOnClickListener(this);

        layoutContainer.setAnimateFirstView(true);
        layoutContainer.setAlpha(0.0f);
        layoutContainer.setDisplayedChild(layoutContainer.indexOfChild(findViewById(R.id.layoutRegisterFone)));

        AnimationLogo();
        AnimationContainer();
    }

    private int getResId(String drawableName) {
        try {
            Class<R.drawable> res = R.drawable.class;
            Field field = res.getField(drawableName);
            int drawableId = field.getInt(null);
            return drawableId;
        } catch (Exception e) {
            Log.e("COUNTRYPICKER", "Failure to get drawable id.", e);
        }
        return -1;
    }

    private void AnimationLogo() {
        Animation anim = AnimationUtils.loadAnimation(this, R.anim.translate_center_to_top);
        mLogo.startAnimation(anim);
    }

    private void AnimationContainer() {
        layoutContainer.animate()
                .setStartDelay(1700)
                .setDuration(500)
                .alpha(1.0f);

    }

    private void switchView(int inAnimation, int outAnimation, View v) {
        layoutContainer.setInAnimation(this, inAnimation);
        layoutContainer.setOutAnimation(this, outAnimation);
        if (layoutContainer.indexOfChild(v) == 0)
            layoutContainer.showNext();
        else
            layoutContainer.showPrevious();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        moveTaskToBack(true);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnCode:
                countryPicker.show(getSupportFragmentManager(), "COUNTRY_PICKER");
                break;
            case R.id.btnRequestCode:
                RequestCode();
                break;
            case R.id.btnBack:
                btnRequestCode.setEnabled(true);
                switchView(R.anim.in_from_right, R.anim.out_to_left, findViewById(R.id.layoutRegisterFone));
                txtPhone.setText("");
                break;
            case R.id.btnSubmitCode:
                LoginByVerifyCode();
                break;
        }
    }

    //Validated phone number match 10-15 digit numbers
    private void RequestCode() {
        txtVerifyCode.setText("");
        String phoneExpression = "^[0-9]{5,14}$";
        Pattern patternPhoneExpression = Pattern.compile(phoneExpression);
        Matcher matcherPhoneExpression = patternPhoneExpression.matcher(txtPhone.getText());
        String postCode = lblPhoneCode.getText().toString();
        postCode = postCode.substring(1, postCode.length() - 1);
        if (matcherPhoneExpression.matches()) {
            char subPhone = txtPhone.getText().charAt(0);
            String phoneNumber;
            if (subPhone == '0')
                phoneNumber = postCode + txtPhone.getText().toString().substring(1);
            else
                phoneNumber = postCode + txtPhone.getText().toString();
            GetDeviceInfo(phoneNumber);
        } else {
            Toast.makeText(getApplicationContext(), R.string.alert_wrong_phone, Toast.LENGTH_LONG).show();
        }
    }

    //Register phone number with get token device
    private void GetDeviceInfo(String phoneNumber) {
        btnRequestCode.setEnabled(false);
        spDevice = getApplicationContext().getSharedPreferences("DeviceInfo", MODE_PRIVATE);
        boolean sendToken = spDevice.getBoolean("sendToken", false);

        telehealthUser = new TelehealthUser();
        telehealthUser.setPhone(phoneNumber);

        patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        if (sendToken == true) {
            registerApi.activation(patientJSON, new Callback<JsonObject>() {
                @Override
                public void success(JsonObject jsonObject, Response response) {
                    String status = jsonObject.get("status").getAsString();
                    if (status.equalsIgnoreCase("success")) {
                        switchView(R.anim.in_from_left, R.anim.out_to_right, findViewById(R.id.layoutVerifyCode));
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    btnRequestCode.setEnabled(true);
                    if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                        new DialogConnection(ActivationActivity.this).show();
                    } else {
                        new CustomAlertDialog(ActivationActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                    }
                }
            });
        } else {
            new DialogConnection(ActivationActivity.this).show();
            startService(new Intent(getApplicationContext(), RegistrationIntentService.class));
        }
    }

    //Compare code input with code receive from server
    private void LoginByVerifyCode() {
        String verifyCode = txtVerifyCode.getText().toString();
        if (spDevice != null) {
            Boolean sendToken = spDevice.getBoolean("sendToken", false);
            telehealthUser.setCode(verifyCode);
            patientJSON.addProperty("data", gson.toJson(telehealthUser));

            if (sendToken == true) {
                registerApi.verify(patientJSON, new Callback<JsonObject>() {
                    @Override
                    public void success(JsonObject jsonObject, Response response) {
                        if (!jsonObject.isJsonNull()) {
                            final SharedPreferences.Editor uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE).edit();
                            uidTelehealth.putString("userUID", jsonObject.get("userUID").isJsonNull() ?
                                    " " : jsonObject.get("userUID").getAsString());
                            uidTelehealth.putString("patientUID", jsonObject.get("patientUID").isJsonNull() ?
                                    " " : jsonObject.get("patientUID").getAsString());
                            uidTelehealth.apply();

                            final JsonObject jsonLogin = new JsonObject();
                            jsonLogin.addProperty("UserName", "android");
                            jsonLogin.addProperty("Password", "android");
                            jsonLogin.addProperty("UserUID", jsonObject.get("userUID").isJsonNull() ?
                                    " " : jsonObject.get("userUID").getAsString());
                            jsonLogin.addProperty("DeviceID", spDevice.getString("deviceID", null));
                            jsonLogin.addProperty("VerificationToken", jsonObject.get("verifyCode").isJsonNull() ?
                                    " " : jsonObject.get("verifyCode").getAsString());
                            jsonLogin.addProperty("AppID", "com.redimed.telehealth.patient");
                            Log.d(TAG, jsonLogin + " ");
                            registerApiLogin.login(jsonLogin, new Callback<JsonObject>() {
                                @Override
                                public void success(JsonObject jsonObject, Response response) {
                                    Log.d(TAG, jsonObject + " ");
                                    String status = jsonObject.get("status").isJsonNull() ?
                                            " " : jsonObject.get("status").getAsString();
                                    if (status.equalsIgnoreCase("success")) {
                                        JsonObject userJson = jsonObject.get("user").getAsJsonObject();
                                        uidTelehealth.putString("token", jsonObject.get("token").isJsonNull() ?
                                                " " : jsonObject.get("token").getAsString());

                                        uidTelehealth.putString("deviceID", spDevice.getString("deviceID", null));
                                        uidTelehealth.putString("refreshCode", jsonObject.get("refreshCode").isJsonNull() ?
                                                " " : jsonObject.get("refreshCode").getAsString());
                                        uidTelehealth.commit();

                                        String userUID = userJson.get("UID").isJsonNull() ? " " : userJson.get("UID").getAsString();
                                        registerApi.getTelehealthUID(userUID, new Callback<JsonObject>() {
                                            @Override
                                            public void success(JsonObject jsonObject, Response response) {
                                                Log.d(TAG, jsonObject + " ");
                                                uidTelehealth.putString("uid", jsonObject.get("UID").isJsonNull() ?
                                                        " " : jsonObject.get("UID").getAsString());
                                                uidTelehealth.commit();
                                                startActivity(new Intent(getApplicationContext(), MainActivity.class));
                                                finish();
                                            }

                                            @Override
                                            public void failure(RetrofitError error) {
                                                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                                                    new DialogConnection(ActivationActivity.this).show();
                                                } else {
                                                    new CustomAlertDialog(ActivationActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                                                }
                                            }
                                        });
                                    }
                                }

                                @Override
                                public void failure(RetrofitError error) {
                                    if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                                        new DialogConnection(ActivationActivity.this).show();
                                    } else {
                                        new CustomAlertDialog(ActivationActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                                    }
                                }
                            });
                        }
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                            new DialogConnection(ActivationActivity.this).show();
                        } else {
                            new CustomAlertDialog(ActivationActivity.this, CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                        }
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
