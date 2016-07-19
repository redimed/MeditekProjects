package com.redimed.telehealth.patient.redisite.injury.presenter;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.DatePicker;
import android.widget.EditText;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.injury.view.IInjuryView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

/**
 * Created by MeditekMini on 6/13/16.
 */
public class InjuryPresenter implements IInjuryPresenter {

    private Context context;
    private IInjuryView iInjuryView;
    private FragmentActivity activity;
    private SimpleDateFormat dateFormat;
    private ArrayList<EFormData> eFormDatas;

    private MyApplication application;

    public InjuryPresenter(Context context, IInjuryView iInjuryView, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iInjuryView = iInjuryView;
        this.application = (MyApplication) context.getApplicationContext();

        eFormDatas = new ArrayList<>();
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
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
    public void displayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                iInjuryView.onLoadDOC(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public boolean validatedAllElement(View view) {
//        boolean validated = true;
        ArrayList<View> allViewsWithinMyTopView = application.getAllChildren(view);
        for (View child : allViewsWithinMyTopView) {
            if (child instanceof EditText) {
                EditText e = (EditText) child;
                switch (e.getId()) { //Get Id element
                    case R.id.txtDOC:
                        eFormDatas.add(new EFormData(e.getText().toString(), "inj_date", "field_1_0_5", "eform_input_date", "row_1_0", 0));
                        break;
                    case R.id.txtWorkplace:
                        eFormDatas.add(new EFormData(e.getText().toString(), "inj_place", "field_2_1_1", "eform_input_text", "row_2_1", 0));
                        break;
                    case R.id.txtOccurrence:
                        eFormDatas.add(new EFormData(e.getText().toString(), "what_happened", "field_2_3_0", "eform_input_textarea", "row_2_3", 0));
                        break;
                    case R.id.txtOtherInjury:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_inj", "field_2_6_1", "eform_input_text", "row_2_6", 0));
                        break;
                    case R.id.txtOtherBody:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_part_affected", "field_2_14_1", "eform_input_text", "row_2_14", 0));
                        break;
                    case R.id.txtOtherMedical:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_medical_history", "field_2_18_1", "eform_input_text", "row_2_18", 0));
                        break;
                    case R.id.txtMedications:
                        eFormDatas.add(new EFormData(e.getText().toString(), "medictation", "field_2_19_3", "eform_input_text", "row_2_19", 0));
                        break;
                    case R.id.txtAllergies:
                        eFormDatas.add(new EFormData(e.getText().toString(), "allergies", "field_2_20_3", "eform_input_text", "row_2_20", 0));
                        break;
                    case R.id.txtOtherInjurySymptoms:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_symptoms", "field_2_24_1", "eform_input_text", "row_2_24", 0));
                        break;
                    case R.id.txtPain:
                        eFormDatas.add(new EFormData(e.getText().toString(), "pain_level", "field_2_23_1", "eform_input_text", "row_2_23", 0));
                        break;
                    case R.id.txtTreatment:
                        eFormDatas.add(new EFormData(e.getText().toString(), "initial_treatment", "field_2_25_1", "eform_input_text", "row_2_25", 0));
                        break;
                    default:
                }
            }
        }
        Singleton.getInstance().addEFormDatas(eFormDatas);
        return true;
    }

}
