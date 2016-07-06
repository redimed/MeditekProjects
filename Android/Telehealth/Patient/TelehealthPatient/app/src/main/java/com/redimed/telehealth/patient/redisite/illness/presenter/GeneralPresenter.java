package com.redimed.telehealth.patient.redisite.illness.presenter;

import android.app.DatePickerDialog;
import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.widget.DatePicker;
import android.widget.EditText;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.illness.view.IGeneralView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class GeneralPresenter implements IGeneralPresenter {

    private Context context;
    private FragmentActivity activity;
    private IGeneralView iGeneralView;
    private SimpleDateFormat dateFormat;
    private ArrayList<EFormData> eFormDatas;
    private static final String TAG = "===ILLNESS_PRESENTER===";

    protected MyApplication application;

    public GeneralPresenter(Context context, FragmentActivity activity, IGeneralView iGeneralView) {
        this.context = context;
        this.activity = activity;
        this.iGeneralView = iGeneralView;
        this.application = (MyApplication) context.getApplicationContext();

        eFormDatas = new ArrayList<>();
        application.setCurrentActivity(activity);
        dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.US);
    }

    @Override
    public void displayDatePickerDialog() {
        Calendar birthdayCalendar = Calendar.getInstance();
        DatePickerDialog birthdayPickerDialog = new DatePickerDialog(context, new DatePickerDialog.OnDateSetListener() {
            @Override
            public void onDateSet(DatePicker view, int year, int monthOfYear, int dayOfMonth) {
                Calendar newCalendar = Calendar.getInstance();
                newCalendar.set(year, monthOfYear, dayOfMonth);
                iGeneralView.onLoadDOC(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
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
                        eFormDatas.add(new EFormData(e.getText().toString(), "inj_date", "field_2_0_1", "eform_input_date", "row_2_0", 0));
                        break;
                    case R.id.txtOtherMedicalHistory:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_medical_history", "field_2_2_1", "eform_input_text", "row_2_2", 0));
                        break;
                    case R.id.txtOtherSymptoms:
                        eFormDatas.add(new EFormData(e.getText().toString(), "other_symptoms", "field_2_3_0", "eform_input_textarea", "row_2_3", 0));
                        break;
                    case R.id.txtMedications:
                        eFormDatas.add(new EFormData(e.getText().toString(), "medictation", "field_2_15_3", "eform_input_text", "row_2_15", 0));
                        break;
                    case R.id.txtAllergies:
                        eFormDatas.add(new EFormData(e.getText().toString(), "allergies", "field_2_16_3", "eform_input_text", "row_2_16", 0));
                        break;
                    case R.id.txtVitalSigns:
                        eFormDatas.add(new EFormData(e.getText().toString(), "hr", "field_2_17_1", "eform_input_text", "row_2_17", 0));
                        break;
                    case R.id.txtTemp:
                        eFormDatas.add(new EFormData(e.getText().toString(), "temp", "field_2_17_3", "eform_input_text", "row_2_17", 0));
                        break;
                    case R.id.txtRR:
                        eFormDatas.add(new EFormData(e.getText().toString(), "rr", "field_2_17_5", "eform_input_text", "row_2_17", 0));
                        break;
                    case R.id.txtBlood:
                        eFormDatas.add(new EFormData(e.getText().toString(), "blood_pressure", "field_2_18_1", "eform_input_text", "row_2_18", 0));
                        break;
                    case R.id.txtSaO2:
                        eFormDatas.add(new EFormData(e.getText().toString(), "sao2", "field_2_18_3", "eform_input_text", "row_2_18", 0));
                        break;
                    case R.id.txtTreatment:
                        eFormDatas.add(new EFormData(e.getText().toString(), "initial_treatment", "field_2_19_1", "eform_input_text", "row_2_19", 0));
                        break;
                    default:
                        break;
                }
            }
        }
        Singleton.getInstance().addEFormDatas(eFormDatas);
        return true;
    }
}
