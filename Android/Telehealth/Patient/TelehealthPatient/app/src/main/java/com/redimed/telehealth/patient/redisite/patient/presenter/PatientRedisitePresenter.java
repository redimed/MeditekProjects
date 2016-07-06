package com.redimed.telehealth.patient.redisite.patient.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.graphics.Color;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.injury.InjuryFragment;
import com.redimed.telehealth.patient.redisite.patient.view.IPatientRedisiteView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

/**
 * Created by MeditekMini on 6/9/16.
 */
public class PatientRedisitePresenter implements IPatientRedisitePresenter {

    private Context context;
    private FragmentActivity activity;
    private SimpleDateFormat dateFormat;
    private ArrayList<EFormData> eFormDatas;
    private IPatientRedisiteView iPatientRedisiteView;
    private static final String TAG = "===PATIENT_RED_PRE===";

    protected MyApplication application;

    public PatientRedisitePresenter(Context context, FragmentActivity activity, IPatientRedisiteView iPatientRedisiteView) {
        this.context = context;
        this.activity = activity;
        this.iPatientRedisiteView = iPatientRedisiteView;
        this.application = (MyApplication) context.getApplicationContext();

        eFormDatas = new ArrayList<>();
        application.setCurrentActivity(activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
    }

    @Override
    public ArrayAdapter loadSuburb() {
        return application.loadJsonData();
    }

    @Override
    public void displayDatePickerDialog(final View v) {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                if (v.getId() == R.id.txtDOB)
                    iPatientRedisiteView.onLoadDOB(dateFormat.format(newCalendar.getTime()));
                else
                    iPatientRedisiteView.onLoadExpiry(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public void hideKeyboardFragment(View view) {
        if (!(view instanceof EditText)) {
            view.setOnTouchListener(new View.OnTouchListener() {
                public boolean onTouch(View v, MotionEvent event) {
                    InputMethodManager inputMethodManager = (InputMethodManager)
                            context.getSystemService(Activity.INPUT_METHOD_SERVICE);
                    inputMethodManager.hideSoftInputFromWindow(((Activity) context).getCurrentFocus().getWindowToken(), 0);
                    return false;
                }
            });
        }

        //If a layout container, iterate over children and seed recursion.
        if (view instanceof ViewGroup) {
            for (int i = 0; i < ((ViewGroup) view).getChildCount(); i++) {
                View innerView = ((ViewGroup) view).getChildAt(i);
                hideKeyboardFragment(innerView);
            }
        }
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
    }

    @Override
    public ArrayAdapter<String> getListSalutation() {
        final Boolean[] flag = {true};
        List<String> apptType = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.salutation_arrays)));

        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(context, R.layout.cardview_list_item, apptType) {
            @Override
            public boolean isEnabled(int position) {
                return position != 0;
            }

            @Override
            public View getDropDownView(int position, View convertView, ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView textView = (TextView) view;
                if (position == 0) {
                    textView.setTextColor(Color.GRAY);
                } else {
                    textView.setTextColor(Color.BLACK);
                }
                return view;
            }

            @Override
            public View getView(int position, View convertView, ViewGroup parent) {
                if (flag[0]) {
                    flag[0] = false;
                    View view = super.getView(position, convertView, parent);
                    ((TextView) view).setTextColor(Color.GRAY);
                    return view;
                }
                return super.getView(position, convertView, parent);
            }
        };
        spinnerArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        return spinnerArrayAdapter;
    }

    @Override
    public boolean validatedAllElement(View view, String salutation) {
        boolean validated = true;
        ArrayList<View> allViewsWithinMyTopView = application.getAllChildren(view);
        for (View child : allViewsWithinMyTopView) {
            if (child instanceof EditText) {
                EditText e = (EditText) child;
                if (e.getText().length() == 0) {
                    if (e.getId() == R.id.txtFamily || e.getId() == R.id.txtGiven || e.getId() == R.id.txtDOB || e.getId() == R.id.txtOccupation ||
                            e.getId() == R.id.txtAddress || e.getId() == R.id.txtSuburb || e.getId() == R.id.txtPostCode ||
                            e.getId() == R.id.txtHome || e.getId() == R.id.txtMobile || e.getId() == R.id.txtWork) {
                        iPatientRedisiteView.onLoadErrorField(e);
                        validated = false;
                        break;
                    }
                }
                if (salutation.equalsIgnoreCase("NONE")) {
                    iPatientRedisiteView.onLoadErrorSpinner();
                    validated = false;
                    break;
                }
                switch (e.getId()) { //Get Id element
                    case R.id.txtFamily:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_firstname", "field_0_7_1", "eform_input_text", "row_0_7", 0));
                        break;
                    case R.id.txtGiven:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_lastname", "field_0_7_3", "eform_input_text", "row_0_7", 0));
                        break;
                    case R.id.txtDOB:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_dob", "field_0_8_4", "eform_input_text", "row_0_8", 0));
                        break;
                    case R.id.txtClaimNo:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_claim", "field_0_8_3", "eform_input_text", "row_0_8", 0));
                        break;
                    case R.id.txtAddress:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_address", "field_0_9_1", "eform_input_text", "row_0_9", 0));
                        break;
                    case R.id.txtSuburb:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_suburb", "field_0_10_1", "eform_input_text", "row_0_10", 0));
                        break;
                    case R.id.txtPostCode:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_postcode", "field_0_10_2", "eform_input_text", "row_0_10", 0));
                        break;
                    case R.id.txtOccupation:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_job", "field_0_10_3", "eform_input_text", "row_0_10", 0));
                        break;
                    case R.id.txtHome:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_hm_phone", "field_0_11_1", "eform_input_text", "row_0_11", 0));
                        break;
                    case R.id.txtMobile:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_mb_phone", "field_0_11_2", "eform_input_text", "row_0_11", 0));
                        break;
                    case R.id.txtWork:
                        eFormDatas.add(new EFormData(e.getText().toString(), "p_wk_phone", "field_0_12_1", "eform_input_text", "row_0_12", 0));
                        break;
                    case R.id.txtNOKEmail:
                        eFormDatas.add(new EFormData(e.getText().toString(), "kin_email", "field_0_12_3", "eform_input_text", "row_0_12", 0));
                        break;
                    case R.id.txtNOK:
                        eFormDatas.add(new EFormData(e.getText().toString(), "kin_name", "field_0_13_1", "eform_input_text", "row_0_13", 0));
                        break;
                    case R.id.txtNOKPhone:
                        eFormDatas.add(new EFormData(e.getText().toString(), "kin_phone", "field_0_13_3", "eform_input_text", "row_0_13", 0));
                        break;
                    case R.id.txtNumber:
                        eFormDatas.add(new EFormData(e.getText().toString(), "medicare_no", "field_1_0_1", "eform_input_text", "row_1_0", 0));
                        break;
                    case R.id.txtPositionNumber:
                        eFormDatas.add(new EFormData(e.getText().toString(), "pos_no", "field_1_0_2", "eform_input_text", "row_1_0", 0));
                        break;
                    case R.id.txtExpiry:
                        eFormDatas.add(new EFormData(e.getText().toString(), "exp_date", "field_1_0_5", "eform_input_text", "row_1_0", 0));
                        break;
                    case R.id.txtHealthFund:
                        eFormDatas.add(new EFormData(e.getText().toString(), "private_fund", "field_1_2_1", "eform_input_text", "row_1_2", 0));
                        break;
                    case R.id.txtMembership:
                        eFormDatas.add(new EFormData(e.getText().toString(), "health_fund_member", "field_1_2_2", "eform_input_text", "row_1_2", 0));
                        break;
                    case R.id.txtVeteran:
                        eFormDatas.add(new EFormData(e.getText().toString(), "veteran_no", "field_1_4_1", "eform_input_text", "row_1_4", 0));
                        break;
                    default:
                        break;
                }
            }
        }
        Singleton.getInstance().addEFormDatas(eFormDatas);
        return validated;
    }
}
