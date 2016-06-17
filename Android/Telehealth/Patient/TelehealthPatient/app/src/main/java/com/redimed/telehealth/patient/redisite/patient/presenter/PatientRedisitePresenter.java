package com.redimed.telehealth.patient.redisite.patient.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.graphics.Color;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.redisite.patient.view.IPatientRedisiteView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

/**
 * Created by MeditekMini on 6/9/16.
 */
public class PatientRedisitePresenter implements IPatientRedisitePresenter {

    private Context context;
    private FragmentActivity activity;
    private SimpleDateFormat dateFormat;
    private IPatientRedisiteView iPatientRedisiteView;

    protected MyApplication application;

    public PatientRedisitePresenter(Context context, FragmentActivity activity, IPatientRedisiteView iPatientRedisiteView) {
        this.context = context;
        this.activity = activity;
        this.iPatientRedisiteView = iPatientRedisiteView;
        this.application = (MyApplication) context.getApplicationContext();

        application.setCurrentActivity(activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
    }

    @Override
    public ArrayAdapter loadSuburb() {
        return application.loadJsonData();
    }

    @Override
    public void displayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                iPatientRedisiteView.onLoadDOB(dateFormat.format(newCalendar.getTime()));
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
}
