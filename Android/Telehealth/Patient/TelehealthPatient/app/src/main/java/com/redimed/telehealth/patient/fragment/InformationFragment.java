package com.redimed.telehealth.patient.fragment;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Message;
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
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.models.Patient;
import com.redimed.telehealth.patient.network.RESTClient;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.logging.Handler;
import java.util.logging.LogRecord;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class InformationFragment extends Fragment implements View.OnClickListener, View.OnFocusChangeListener, View.OnTouchListener {

    private String TAG = "INFORMATION";
    private View v;
    private DatePickerDialog birthdayPickerDialog;
    private SimpleDateFormat dateFormat;
    private RegisterApi restClient;
    private Gson gson;
    private Patient[] patients;
    private boolean refreshToggle = true;

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
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        restClient = RESTClient.getRegisterApi();

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

        DisplayPatientInfo();

        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                DisplayPatientInfo();
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
                if (scrollY == 0){
                    swipeInfo.setEnabled(true);
                }else swipeInfo.setEnabled(false);
            }
        });

        return v;
    }

    private void DisplayPatientInfo() {
        SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("PatientInfo", v.getContext().MODE_PRIVATE);
        gson = new Gson();
        patients = gson.fromJson(sharedPreferences.getString("info", null), Patient[].class);
        String DOB = "N/A";
        for (int i = 0; i < patients.length; i++) {
            txtFirstName.setText(patients[i].getFirstName() == null ? "NONE" : patients[i].getFirstName());
            txtLastName.setText(patients[i].getLastName() == null ? "NONE" : patients[i].getLastName());
            txtPhone.setText(patients[i].getUserAccount().getPhoneNumber() == null ? "NONE" : patients[i].getUserAccount().getPhoneNumber());
            txtEmail.setText(patients[i].getEmail() == null ? "NONE" : patients[i].getEmail());
            txtDOB.setText(patients[i].getDOB() == null ? "NONE" : patients[i].getDOB());
            txtAddress1.setText(patients[i].getAddress1() == null ? "NONE" : patients[i].getAddress1());
            txtAddress2.setText(patients[i].getAddress2() == null ? "NONE" : patients[i].getAddress2());
        }
        swipeInfo.setRefreshing(false);
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

    // TODO: 10/23/2015 click edit text can't back home
    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    ((MainActivity) v.getContext()).Display(0);
                    return true;
                }
                return false;
            }
        });
    }
}
