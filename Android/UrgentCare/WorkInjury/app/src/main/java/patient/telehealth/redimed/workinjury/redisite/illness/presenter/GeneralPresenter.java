package patient.telehealth.redimed.workinjury.redisite.illness.presenter;

import android.app.DatePickerDialog;
import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.widget.DatePicker;
import android.widget.EditText;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Locale;

import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.EFormData;
import patient.telehealth.redimed.workinjury.model.Singleton;
import patient.telehealth.redimed.workinjury.redisite.illness.view.IGeneralView;

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
                //iGeneralView.onLoadDOC(dateFormat.format(newCalendar.getTime()));
            }
        }, birthdayCalendar.get(Calendar.YEAR), birthdayCalendar.get(Calendar.MONTH), birthdayCalendar.get(Calendar.DATE));
        birthdayPickerDialog.show();
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.ReplaceFragment(fragment);
    }
}
