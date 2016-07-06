package com.redimed.telehealth.patient.redisite.patient;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.ServicesAdapter;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.illness.GeneralFragment;
import com.redimed.telehealth.patient.redisite.injury.InjuryFragment;
import com.redimed.telehealth.patient.redisite.patient.presenter.IPatientRedisitePresenter;
import com.redimed.telehealth.patient.redisite.patient.presenter.PatientRedisitePresenter;
import com.redimed.telehealth.patient.redisite.patient.view.IPatientRedisiteView;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.lang.reflect.Field;
import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class RedisiteFragment extends Fragment implements IPatientRedisiteView, View.OnFocusChangeListener, RadioGroup.OnCheckedChangeListener, View.OnClickListener {

    private Context context;
    private String salutation;
    private IPatientRedisitePresenter iPatientRedisitePresenter;
    private ArrayList<EFormData> eFormDatas, eFormDataSalutations;
    private static final String TAG = "=====REDISITE=====";

    protected MyApplication application;

    @Bind(R.id.layoutPatientRedisite)
    LinearLayout layoutPatientRedisite;
    @Bind(R.id.rvServiceRedisite)
    RecyclerView rvServiceRedisite;

    @Bind(R.id.radioGroupWork)
    RadioGroup radioGroupWork;
    @Bind(R.id.radioWork)
    RadioButton radioWork;
    @Bind(R.id.radioNonWork)
    RadioButton radioNonWork;

    /* Patient Details */
    @Bind(R.id.spinnerSalutation)
    Spinner spinnerSalutation;
    @Bind(R.id.txtClaimNo)
    EditText txtClaimNo;
    @Bind(R.id.txtFamily)
    EditText txtFamily;
    @Bind(R.id.txtGiven)
    EditText txtGiven;
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtOccupation)
    EditText txtOccupation;
    @Bind(R.id.txtAddress)
    EditText txtAddress;
    @Bind(R.id.txtSuburb)
    AutoCompleteTextView txtSuburb;
    @Bind(R.id.txtPostCode)
    EditText txtPostCode;
    @Bind(R.id.txtHome)
    EditText txtHome;
    @Bind(R.id.txtMobile)
    EditText txtMobile;
    @Bind(R.id.txtWork)
    EditText txtWork;
    @Bind(R.id.txtNOK)
    EditText txtNOK;
    @Bind(R.id.txtNOKPhone)
    EditText txtNOKPhone;
    @Bind(R.id.txtNOKEmail)
    EditText txtNOKEmail;

    /* Health Insurance Details */
    @Bind(R.id.txtNumber)
    EditText txtNumber;
    @Bind(R.id.txtPositionNumber)
    EditText txtPositionNumber;
    @Bind(R.id.txtExpiry)
    EditText txtExpiry;
    @Bind(R.id.txtHealthFund)
    EditText txtHealthFund;
    @Bind(R.id.txtMembership)
    EditText txtMembership;
    @Bind(R.id.txtVeteran)
    EditText txtVeteran;
    @Bind(R.id.toggleInsurance)
    RadioGroup toggleInsurance;
    @Bind(R.id.noInsurance)
    RadioButton noInsurance;
    @Bind(R.id.yesInsurance)
    RadioButton yesInsurance;
    @Bind(R.id.toggleHospital)
    RadioGroup toggleHospital;
    @Bind(R.id.noHosCover)
    RadioButton noHosCover;
    @Bind(R.id.yesHosCover)
    RadioButton yesHosCover;
    @Bind(R.id.toggleCard)
    RadioGroup toggleCard;
    @Bind(R.id.naCard)
    RadioButton naCard;
    @Bind(R.id.goldCard)
    RadioButton goldCard;
    @Bind(R.id.whiteCard)
    RadioButton whiteCard;

    @Bind(R.id.btnInjury)
    Button btnInjury;
    @Bind(R.id.btnIllness)
    Button btnIllness;

    public RedisiteFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        eFormDatas = new ArrayList<>();
        // Default value toggle Card Holder
        eFormDatas.add(0, new EFormData("na", "card_holder", "field_1_5_1", "eform_input_check_radio", true, "row_1_5", 0));
        eFormDatas.add(1, new EFormData("gold", "card_holder", "field_1_5_2", "eform_input_check_radio", false, "row_1_5", 0));
        eFormDatas.add(2, new EFormData("white", "card_holder", "field_1_5_3", "eform_input_check_radio", false, "row_1_5", 0));

        // Default value toggle Hospital Cover
        eFormDatas.add(3, new EFormData("yes", "hospital_cover", "field_1_3_1", "eform_input_check_radio", false, "row_1_3", 0));
        eFormDatas.add(4, new EFormData("no", "hospital_cover", "field_1_3_2", "eform_input_check_radio", true, "row_1_3", 0));

        // Default value toggle Private Health
        eFormDatas.add(5, new EFormData("yes", "is_private_health", "field_1_1_1", "eform_input_check_radio", false, "row_1_1", 0));
        eFormDatas.add(6, new EFormData("no", "is_private_health", "field_1_1_2", "eform_input_check_radio", true, "row_1_1", 0));

        // Default value radio group Work Related
        eFormDatas.add(7, new EFormData("yes", "is_work_related", "field_0_0_0", "eform_input_check_radio", false, "row_0_0", 0));
        eFormDatas.add(8, new EFormData("no", "is_work_related", "field_0_0_1", "eform_input_check_radio", true, "row_0_0", 0));

        eFormDataSalutations = new ArrayList<>();
        // Default value Salutation
        eFormDataSalutations.add(0, new EFormData("NONE", "p_title", "", "", false, "", 0));
        eFormDataSalutations.add(1, new EFormData("Mr", "p_title", "field_0_5_1", "eform_input_check_radio", false, "row_0_6", 0));
        eFormDataSalutations.add(2, new EFormData("Mrs", "p_title", "field_0_5_2", "eform_input_check_radio", false, "row_0_6", 0));
        eFormDataSalutations.add(3, new EFormData("Ms", "p_title", "field_0_5_3", "eform_input_check_radio", false, "row_0_6", 0));
        eFormDataSalutations.add(4, new EFormData("Miss", "p_title", "field_0_6_1", "eform_input_check_radio", false, "row_0_6", 0));
        eFormDataSalutations.add(5, new EFormData("Master", "p_title", "field_0_6_2", "eform_input_check_radio", false, "row_0_6", 0));
        eFormDataSalutations.add(6, new EFormData("Dr", "p_title", "field_0_6_3", "eform_input_check_radio", false, "row_0_6", 0));
    }

    private void receivedData() {
        ArrayList<EFormData> eFormDatas = Singleton.getInstance().getEFormPatient();
        if (eFormDatas.size() > 0) {
            for (EFormData eFormData : eFormDatas) {
                switch (eFormData.getName()) {
                    case "p_firstname":
                        txtFamily.setText(eFormData.getValue());
                        break;
                    case "p_lastname":
                        txtGiven.setText(eFormData.getValue());
                        break;
                    case "p_dob":
                        txtDOB.setText(eFormData.getValue());
                        break;
                    case "p_claim":
                        txtClaimNo.setText(eFormData.getValue());
                        break;
                    case "p_address":
                        txtAddress.setText(eFormData.getValue());
                        break;
                    case "p_suburb":
                        txtSuburb.setText(eFormData.getValue());
                        break;
                    case "p_postcode":
                        txtPostCode.setText(eFormData.getValue());
                        break;
                    case "p_job":
                        txtOccupation.setText(eFormData.getValue());
                        break;
                    case "p_hm_phone":
                        txtHome.setText(eFormData.getValue());
                        break;
                    case "p_mb_phone":
                        txtMobile.setText(eFormData.getValue());
                        break;
                    case "p_wk_phone":
                        txtWork.setText(eFormData.getValue());
                        break;
                    case "kin_email":
                        txtNOKEmail.setText(eFormData.getValue());
                        break;
                    case "kin_name":
                        txtNOK.setText(eFormData.getValue());
                        break;
                    case "kin_phone":
                        txtNOKPhone.setText(eFormData.getValue());
                        break;
                    case "medicare_no":
                        txtNumber.setText(eFormData.getValue());
                        break;
                    case "pos_no":
                        txtPositionNumber.setText(eFormData.getValue());
                        break;
                    case "exp_date":
                        txtExpiry.setText(eFormData.getValue());
                        break;
                    case "private_fund":
                        txtHealthFund.setText(eFormData.getValue());
                        break;
                    case "health_fund_member":
                        txtMembership.setText(eFormData.getValue());
                        break;
                    case "veteran_no":
                        txtVeteran.setText(eFormData.getValue());
                        break;
                    case "card_holder":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "na":
                                    naCard.setChecked(true);
                                    naCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    naCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    whiteCard.setChecked(false);
                                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));

                                    goldCard.setChecked(false);
                                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                                case "gold":
                                    goldCard.setChecked(true);
                                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    goldCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    whiteCard.setChecked(false);
                                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));

                                    naCard.setChecked(false);
                                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                                case "white":
                                    whiteCard.setChecked(true);
                                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    whiteCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    naCard.setChecked(false);
                                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));

                                    goldCard.setChecked(false);
                                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);
                                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                            }
                        }
                        break;
                    case "hospital_cover":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    yesHosCover.setChecked(true);
                                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    yesHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    noHosCover.setChecked(false);
                                    noHosCover.setBackgroundResource(R.drawable.toggle_widget_background);
                                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                                case "no":
                                    noHosCover.setChecked(true);
                                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    noHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    yesHosCover.setChecked(false);
                                    yesHosCover.setBackgroundResource(R.drawable.toggle_widget_background);
                                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                            }
                        }
                        break;
                    case "is_private_health":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    yesInsurance.setChecked(true);
                                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    yesInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    noInsurance.setChecked(false);
                                    noInsurance.setBackgroundResource(R.drawable.toggle_widget_background);
                                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                                case "no":
                                    noInsurance.setChecked(true);
                                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    noInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    yesInsurance.setChecked(false);
                                    yesInsurance.setBackgroundResource(R.drawable.toggle_widget_background);
                                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    break;
                            }
                        }
                        break;
                    case "is_work_related":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    radioWork.setChecked(true);
                                    break;
                                case "no":
                                    radioNonWork.setChecked(true);
                                    break;
                            }
                        }
                        break;
                    case "p_title":
                        if (eFormData.isChecked()) {
                            for (int i = 0; i < eFormDataSalutations.size(); i++) {
                                if (eFormData.getValue().equalsIgnoreCase(eFormDataSalutations.get(i).getValue())) {
                                    spinnerSalutation.setSelection(i);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_redisite, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        this.context = v.getContext();
        this.application = (MyApplication) context.getApplicationContext();

        iPatientRedisitePresenter = new PatientRedisitePresenter(context, getActivity(), this);
        iPatientRedisitePresenter.hideKeyboardFragment(v);

        //init variable
        initSpinner();
        getListService();

        //init Suburb
        if (iPatientRedisitePresenter.loadSuburb() != null) {
            txtSuburb.setThreshold(1);
            txtSuburb.setAdapter(iPatientRedisitePresenter.loadSuburb());
        }

        txtDOB.setOnFocusChangeListener(this);
        txtExpiry.setOnFocusChangeListener(this);

        toggleCard.setOnCheckedChangeListener(this);
        toggleHospital.setOnCheckedChangeListener(this);
        toggleInsurance.setOnCheckedChangeListener(this);

        radioGroupWork.setOnCheckedChangeListener(this);

        btnInjury.setOnClickListener(this);
        btnIllness.setOnClickListener(this);

        //received data when back fragment
        receivedData();

        return v;
    }

    // Generated all checkbox in Form
    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (group.getId()) {
            case R.id.toggleCard:
                if (naCard.isChecked()) {
                    naCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    naCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(0).setChecked(true);
                    eFormDatas.get(1).setChecked(false);
                    eFormDatas.get(2).setChecked(false);
                } else if (goldCard.isChecked()) {
                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    goldCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(0).setChecked(false);
                    eFormDatas.get(1).setChecked(true);
                    eFormDatas.get(2).setChecked(false);
                } else {
                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    whiteCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(0).setChecked(false);
                    eFormDatas.get(1).setChecked(false);
                    eFormDatas.get(2).setChecked(true);
                }
                break;
            case R.id.toggleHospital:
                if (yesHosCover.isChecked()) {
                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noHosCover.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(3).setChecked(true);
                    eFormDatas.get(4).setChecked(false);
                } else {
                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesHosCover.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(3).setChecked(false);
                    eFormDatas.get(4).setChecked(true);
                }
                break;
            case R.id.toggleInsurance:
                if (yesInsurance.isChecked()) {
                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noInsurance.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(5).setChecked(true);
                    eFormDatas.get(6).setChecked(false);
                } else {
                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesInsurance.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(5).setChecked(false);
                    eFormDatas.get(6).setChecked(true);
                }
                break;
            case R.id.radioGroupWork:
                if (radioWork.isChecked()) {
                    eFormDatas.get(7).setChecked(true);
                    eFormDatas.get(8).setChecked(false);
                } else {
                    eFormDatas.get(7).setChecked(false);
                    eFormDatas.get(8).setChecked(true);
                }
        }
    }

    public void getListService() {
        ServicesAdapter servicesAdapter = new ServicesAdapter(context);

        PreCachingLayoutManager layoutManagerCategories = new PreCachingLayoutManager(context);
        layoutManagerCategories.setOrientation(LinearLayoutManager.VERTICAL);
        layoutManagerCategories.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

        rvServiceRedisite.setLayoutManager(layoutManagerCategories);
        rvServiceRedisite.setAdapter(servicesAdapter);
    }

    private void initSpinner() {
        spinnerSalutation.setAdapter(iPatientRedisitePresenter.getListSalutation());
        spinnerSalutation.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedItemText = (String) parent.getItemAtPosition(position);
                // If user change the default selection
                // First item is disable and it is used for hint
                if (position == 0) {
                    salutation = "NONE";
                } else {
                    // Notify the selected item text
                    salutation = selectedItemText;
                    for (EFormData eFormData : eFormDataSalutations) {
                        eFormData.setChecked(false);
                    }
                    eFormDataSalutations.get(position).setChecked(true);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if (hasFocus) {
            switch (v.getId()) {
                case R.id.txtDOB:
                    txtDOB.setError(null);
                    iPatientRedisitePresenter.displayDatePickerDialog(v);
                    break;
                case R.id.txtExpiry:
                    createDialogWithoutDateField().show();
                    break;
            }
        }
    }

    private DatePickerDialog createDialogWithoutDateField() {
        DatePickerDialog dpd = new DatePickerDialog(context, null, 2014, 1, 24);
        try {
            Field[] datePickerDialogFields = dpd.getClass().getDeclaredFields();
            Log.i(TAG, datePickerDialogFields + "");
            for (Field datePickerDialogField : datePickerDialogFields) {
                if (datePickerDialogField.getName().equals("mDatePicker")) {
                    datePickerDialogField.setAccessible(true);
                    DatePicker datePicker = (DatePicker) datePickerDialogField.get(dpd);

                    Field[] datePickerFields = datePickerDialogField.getType().getDeclaredFields();
//                    for (Field datePickerField : datePickerFields) {
//                        Log.i(TAG, datePickerField.getName());
//                        if ("mDaySpinner".equals(datePickerField.getName())) {
//                            datePickerField.setAccessible(true);
//                            Object dayPicker = datePickerField.get(datePicker);
//                            ((View) dayPicker).setVisibility(View.GONE);
//                        }
//                    }
                    for (Field datePickerField : datePickerFields) {
                        if ("mDayPicker".equals(datePickerField.getName()) || "mDaySpinner".equals(datePickerField.getName())) {
                            datePickerField.setAccessible(true);
                            Object dayPicker = datePickerField.get(datePicker);
                            ((View) dayPicker).setVisibility(View.GONE);
                        }
                        if ("mMonthPicker".equals(datePickerField.getName()) || "mMonthSpinner".equals(datePickerField.getName())) {
                            datePickerField.setAccessible(true);
                            Object dayPicker = datePickerField.get(datePicker);
                            ((View) dayPicker).setVisibility(View.GONE);
                        }
                    }
                    datePicker.setCalendarViewShown(false);
                    datePicker.setEnabled(false);
                }
            }
        } catch (Exception ex) {
            Log.d(TAG, ex.getLocalizedMessage());
        }
        return dpd;
    }

    @Override
    public void onLoadErrorSpinner() {
        ((TextView) spinnerSalutation.getSelectedView()).setError("Please input information");
    }

    @Override
    public void onLoadDOB(String dob) {
        txtDOB.setText(dob);
    }

    @Override
    public void onLoadExpiry(String expiry) {
        txtExpiry.setText(expiry);
    }

    @Override
    public void onLoadErrorField(EditText editText) {
        if (editText != null) {
            editText.requestFocus();
            editText.setError("Please input information");
        }
    }

    @Override
    public void onClick(View v) {
        EFormSingleton();
        switch (v.getId()) {
            case R.id.btnInjury:
                if (iPatientRedisitePresenter.validatedAllElement(layoutPatientRedisite, salutation))
                    iPatientRedisitePresenter.changeFragment(new InjuryFragment());
                break;
            case R.id.btnIllness:
                if (iPatientRedisitePresenter.validatedAllElement(layoutPatientRedisite, salutation))
                    iPatientRedisitePresenter.changeFragment(new GeneralFragment());
                break;
        }
    }

    private void EFormSingleton() {
        ArrayList<EFormData> eFormDataServices = application.getSelectedServices();

        Singleton.getInstance().clearAll();
        Singleton.getInstance().addEFormDatas(eFormDatas);
        Singleton.getInstance().addEFormDatas(eFormDataServices);
        Singleton.getInstance().addEFormDatas(eFormDataSalutations);
    }

    @Override
    public void onPause() {
        super.onPause();
        setRetainInstance(true);
    }

    @Override
    public void onResume() {
        super.onResume();
        getRetainInstance();
    }
}
