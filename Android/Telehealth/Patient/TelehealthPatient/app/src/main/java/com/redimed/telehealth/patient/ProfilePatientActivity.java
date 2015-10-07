package com.redimed.telehealth.patient;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.support.design.widget.TextInputLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedByteArray;


public class ProfilePatientActivity extends AppCompatActivity implements View.OnClickListener, View.OnFocusChangeListener {

    private DatePickerDialog birthdayPickerDialog;
    private SimpleDateFormat dateFormat;
    private RegisterApi restClient;
    private MyApplication myApplication;
    private JsonObject patientJSON;
    private Gson gson;
    private TelehealthUser telehealthUser;

    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtEmail)
    EditText txtEmail;

    @Bind(R.id.errFirstName)
    TextInputLayout errFirstName;
    @Bind(R.id.errLastName)
    TextInputLayout errLastName;
    @Bind(R.id.errPhone)
    TextInputLayout errPhone;
    @Bind(R.id.errEmail)
    TextInputLayout errEmail;
    @Bind(R.id.errDOB)
    TextInputLayout errDOB;
    @Bind(R.id.errAddress1)
    TextInputLayout errAddress1;
    @Bind(R.id.errAddress2)
    TextInputLayout errAddress2;

    @Bind(R.id.btnSubmit)
    Button btnSubmit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_patient);
        restClient = RESTClient.getRegisterApi();
        myApplication = (MyApplication) getApplicationContext();
        gson = new Gson();
        ButterKnife.bind(this);

        dateFormat = new SimpleDateFormat("dd-MM-yyyy", Locale.US);

        txtDOB.setOnClickListener(this);
        btnSubmit.setOnClickListener(this);

        txtDOB.setOnFocusChangeListener(this);
        errFirstName.setOnFocusChangeListener(this);
        errLastName.setOnFocusChangeListener(this);
        errPhone.setOnFocusChangeListener(this);
        errEmail.setOnFocusChangeListener(this);
        errDOB.setOnFocusChangeListener(this);
        errAddress1.setOnFocusChangeListener(this);
        errAddress2.setOnFocusChangeListener(this);

        GetDetailsPatient();
    }

    private void GetDetailsPatient() {
        String uid = "uid:{" + myApplication.getTelehealthUser().getUID() + "}";
        patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(uid));
        Log.d("DADADADAD", patientJSON.toString());

//        restClient.getDetailsPatient(patientJSON, new Callback<JsonObject>() {
//            @Override
//            public void success(JsonObject jsonObject, Response response) {
//                String status = jsonObject.get("status").getAsString();
//                if (status.equalsIgnoreCase("success")) {
//                    Log.d("Patient", jsonObject.get("data").getAsString());
//                }
//            }
//
//            @Override
//            public void failure(RetrofitError error) {
//                String json =  new String(((TypedByteArray)error.getResponse().getBody()).getBytes());
//                try {
//                    JSONObject dataObject = new JSONObject(json);
//                    String message = dataObject.optString("message");
//                    new CustomAlertDialog(ProfilePatientActivity.this, CustomAlertDialog.State.Error, message).show();
//                } catch (JSONException e) {
//                    e.printStackTrace();
//                }
//            }
//        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnSubmit:
                new Intent(this, HomeActivity.class);
                break;
            case R.id.txtDOB:
                DisplayDatePickerDialog();
                break;
        }
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        switch (v.getId()) {
            case R.id.txtDOB:
                if (hasFocus) {
                    DisplayDatePickerDialog();
                }
                break;
            case R.id.errFirstName:
                break;
            case R.id.errLastName:
                break;
            case R.id.errPhone:
                break;
            case R.id.errEmail:
                ValidatedEmail();
                break;
            case R.id.errDOB:
                break;
            case R.id.errAddress1:
                break;
            case R.id.errAddress2:
                break;
        }
    }

    private void ValidatedEmail() {
        if (txtDOB.getText().toString().isEmpty()) {
            errEmail.setErrorEnabled(true);
            errEmail.setError(getResources().getString(R.string.empty_email));
        } else {
            String emailExpression = "[a-zA-Z0-9._-]+@[a-z]+.[a-z]+";
            Pattern patternEmailExpression = Pattern.compile(emailExpression);
            Matcher matcherEmailExpression = patternEmailExpression.matcher(txtEmail.getText());
            if (matcherEmailExpression.matches()) {
                errEmail.setErrorEnabled(false);
            } else {
                errEmail.setError(getResources().getString(R.string.error_email));
            }
        }
    }

    private void DisplayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        birthdayPickerDialog = new DatePickerDialog(this, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                txtDOB.setText(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

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

    public void hideKeyboard(AppCompatActivity activity) {
        if (activity != null && activity.getWindow() != null && activity.getWindow().getDecorView() != null) {
            InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(activity.getWindow().getDecorView().getWindowToken(), 0);
            imm.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
            getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        startActivity(new Intent(this, HomeActivity.class));
        finish();
    }
}
