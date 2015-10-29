package com.redimed.telehealth.patient.fragment;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.models.TelehealthUser;
import com.redimed.telehealth.patient.network.RESTClient;
import com.redimed.telehealth.patient.utils.CustomAlertDialog;
import com.redimed.telehealth.patient.utils.DialogConnection;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class InformationFragment extends Fragment implements View.OnClickListener, View.OnFocusChangeListener, View.OnTouchListener {

    private String TAG = "INFORMATION", uid;
    private View v;
    private DatePickerDialog birthdayPickerDialog;
    private SimpleDateFormat dateFormat;
    private RegisterApi restClient;
    private Gson gson;
    private Patient[] patients;
    private SharedPreferences sharedPreferences;

    @Bind(R.id.layoutProfile)
    LinearLayout layoutProfile;
    @Bind(R.id.txtFirstName)
    EditText txtFirstName;
    @Bind(R.id.txtLastName)
    EditText txtLastName;
    @Bind(R.id.txtPhone)
    EditText txtPhone;
    @Bind(R.id.txtEmail)
    EditText txtEmail;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtAddress1)
    EditText txtAddress1;
    @Bind(R.id.txtAddress2)
    EditText txtAddress2;
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
    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.scrollViewInfo)
    ScrollView scrollViewInfo;

    public InformationFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        restClient = RESTClient.getRegisterApi();
        uid = getArguments().getString("telehealthUID");
        gson = new Gson();

        v = inflater.inflate(R.layout.fragment_information, container, false);
        ButterKnife.bind(this, v);

        dateFormat = new SimpleDateFormat("dd/MM/yyyy");

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

        sharedPreferences = v.getContext().getSharedPreferences("PatientInfo", v.getContext().MODE_PRIVATE);
        patients = gson.fromJson(sharedPreferences.getString("info", null), Patient[].class);
        DisplayInfo(patients);

        SwipeRefresh();

        return v;
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                GetInfoPatient();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);

        scrollViewInfo.post(new Runnable() {
            @Override
            public void run() {
                scrollViewInfo.fullScroll(ScrollView.FOCUS_UP);
                scrollViewInfo.scrollTo(0, 0);
            }
        });

        scrollViewInfo.getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                int scrollY = scrollViewInfo.getScrollY();
                if (scrollY == 0) {
                    swipeInfo.setEnabled(true);
                } else swipeInfo.setEnabled(false);
            }
        });
    }

    private void GetInfoPatient() {
        TelehealthUser telehealthUser = new TelehealthUser();
        telehealthUser.setUID(uid);

        JsonObject patientJSON = new JsonObject();
        patientJSON.addProperty("data", gson.toJson(telehealthUser));

        restClient.getDetailsPatient(patientJSON, new Callback<JsonObject>() {
            @Override
            public void success(JsonObject jsonObject, Response response) {
                String message = jsonObject.get("message").getAsString();
                if (message.equalsIgnoreCase("success")) {
                    DisplayInfo(gson.fromJson(jsonObject.get("data").toString(), Patient[].class));
                    swipeInfo.setRefreshing(false);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                if (error.getLocalizedMessage().equalsIgnoreCase("Network Error")) {
                    new DialogConnection(v.getContext()).show();
                } else {
                    new CustomAlertDialog(v.getContext(), CustomAlertDialog.State.Error, error.getLocalizedMessage()).show();
                }
                swipeInfo.setRefreshing(false);
            }
        });
    }

    private void DisplayInfo(Patient[] patients) {
        for (Patient patient : patients) {
            txtFirstName.setText(patient.getFirstName() == null ? "NONE" : patient.getFirstName());
            txtLastName.setText(patient.getLastName() == null ? "NONE" : patient.getLastName());
            txtPhone.setText(patient.getUserAccount().getPhoneNumber() == null ? "NONE" : patient.getUserAccount().getPhoneNumber());
            txtEmail.setText(patient.getEmail() == null ? "NONE" : patient.getEmail());
            txtDOB.setText(patient.getDOB() == null ? "NONE" : patient.getDOB());
            txtAddress1.setText(patient.getAddress1() == null ? "NONE" : patient.getAddress1());
            txtAddress2.setText(patient.getAddress2() == null ? "NONE" : patient.getAddress2());
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnSubmit:
                ((MainActivity) v.getContext()).Display(0);
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
        switch (v.getId()) {
            case R.id.layoutProfile:
                hideKeyboard(v);
                break;
            default:
                return false;
        }
        return false;
    }

    private void hideKeyboard(View v) {
        InputMethodManager in = (InputMethodManager) v.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        in.hideSoftInputFromWindow(v.getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
