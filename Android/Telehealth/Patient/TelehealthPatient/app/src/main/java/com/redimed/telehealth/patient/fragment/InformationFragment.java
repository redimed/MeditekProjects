package com.redimed.telehealth.patient.fragment;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.RelativeLayout;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
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

/**
 * A simple {@link Fragment} subclass.
 */
public class InformationFragment extends Fragment implements View.OnClickListener, View.OnFocusChangeListener, View.OnTouchListener {

    private String TAG = "INFORMATION";
    private View v;
    private DatePickerDialog birthdayPickerDialog;
    private SimpleDateFormat dateFormat;
    private RegisterApi restClient;
    private JsonObject patientJSON;
    private Gson gson;
    private TelehealthUser telehealthUser;
    private static SharedPreferences uidTelehealth;

    @Bind(R.id.layoutProfile)
    RelativeLayout layoutProfile;
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

    public InformationFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        v = inflater.inflate(R.layout.fragment_information, container, false);
        uidTelehealth = v.getContext().getSharedPreferences("TelehealthUser", v.getContext().MODE_PRIVATE);
        restClient = RESTClient.getRegisterApi();
        gson = new Gson();
        ButterKnife.bind(this, v);

        dateFormat = new SimpleDateFormat("dd-MM-yyyy", Locale.US);

        layoutProfile.setOnTouchListener(this);

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
        return v;
    }

    private void GetDetailsPatient() {
        String headerToken = "";
        telehealthUser = new TelehealthUser();
        telehealthUser.setUID(uidTelehealth.getString("uid", null));
        headerToken = "Bearer " + uidTelehealth.getString("token", null);

        patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));
        restClient.getDetailsPatient(patientJSON, headerToken, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String status = jsonObject.get("status").getAsString();
                if (status.equalsIgnoreCase("success")) {
                    Log.d("Patient", jsonObject.get("data").getAsString());
                }
            }

            @Override
            public void failure(RetrofitError error) {
                String json =  new String(((TypedByteArray)error.getResponse().getBody()).getBytes());
                try {
                    JSONObject dataObject = new JSONObject(json);
                    String message = dataObject.optString("message");
                    new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, message).show();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnSubmit:
                new Intent(v.getContext(), MainActivity.class);
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
        birthdayPickerDialog = new DatePickerDialog(v.getContext(), new DatePickerDialog.OnDateSetListener() {
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
    public boolean onTouch(View v, MotionEvent event) {
        switch (v.getId()){
            case R.id.layoutProfile:
                hideKeyboard(v);
                break;
            default:
                return false;
        }
        return false;
    }

    private void hideKeyboard(View v) {
        InputMethodManager in = (InputMethodManager)v.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        in.hideSoftInputFromWindow(v.getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
    }
}
