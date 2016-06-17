package com.redimed.telehealth.patient.redisite.patient;

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
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.ServicesAdapter;
import com.redimed.telehealth.patient.redisite.illness.IllnessFragment;
import com.redimed.telehealth.patient.redisite.injury.InjuryFragment;
import com.redimed.telehealth.patient.redisite.patient.presenter.IPatientRedisitePresenter;
import com.redimed.telehealth.patient.redisite.patient.presenter.PatientRedisitePresenter;
import com.redimed.telehealth.patient.redisite.patient.view.IPatientRedisiteView;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class RedisiteFragment extends Fragment implements IPatientRedisiteView, View.OnFocusChangeListener, RadioGroup.OnCheckedChangeListener, View.OnClickListener {

    private String salutaion;
    private Context context;
    private IPatientRedisitePresenter iPatientRedisitePresenter;
    private static final String TAG = "=====REDISITE=====";

    //    @Bind(R.id.gridService)
//    GridView gridService;
    @Bind(R.id.rvServiceRedisite)
    RecyclerView rvServiceRedisite;
    @Bind(R.id.spinnerSalutation)
    Spinner spinnerSalutation;

    @Bind(R.id.radioGroupWork)
    RadioGroup radioGroupWork;
    @Bind(R.id.radioWork)
    RadioButton radioWork;
    @Bind(R.id.radioNonWork)
    RadioButton radioNonWork;

    /* Patient Details */
    @Bind(R.id.txtDOB)
    EditText txtDOB;
    @Bind(R.id.txtSuburb)
    AutoCompleteTextView txtSuburb;

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
    public View onCreateView(LayoutInflater inflater, final ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_redisite, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        this.context = v.getContext();

        iPatientRedisitePresenter = new PatientRedisitePresenter(context, getActivity(), this);
        iPatientRedisitePresenter.hideKeyboardFragment(v);

        initSpinner();
        getListService();

        //init Suburb
        if (iPatientRedisitePresenter.loadSuburb() != null) {
            txtSuburb.setThreshold(1);
            txtSuburb.setAdapter(iPatientRedisitePresenter.loadSuburb());
        }
        txtDOB.setOnFocusChangeListener(this);

        toggleCard.setOnCheckedChangeListener(this);
        toggleHospital.setOnCheckedChangeListener(this);
        toggleInsurance.setOnCheckedChangeListener(this);

        btnInjury.setOnClickListener(this);
        btnIllness.setOnClickListener(this);

//        /* Attach CheckedChangeListener to radio group */
//        radioGroupWork.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
//            @Override
//            public void onCheckedChanged(RadioGroup group, int checkedId) {
//                RadioButton radioButton = (RadioButton) group.findViewById(checkedId);
//                switch (radioButton.getHint().toString()) {
//                    case "Y":
//                        radioWork.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
//                        radioWork.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));
//
//                        radioNonWork.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
//                        radioNonWork.setBackgroundColor(ContextCompat.getColor(context, R.color.lightBackground));
//                        break;
//                    case "N":
//                        radioNonWork.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
//                        radioNonWork.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));
//
//                        radioWork.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
//                        radioWork.setBackgroundColor(ContextCompat.getColor(context, R.color.lightBackground));
//                        break;
//                }
//            }
//        });

        return v;
    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        RadioButton radioButton = (RadioButton) group.findViewById(checkedId);
        switch (group.getId()) {
            case R.id.toggleCard:
                if (naCard.isChecked()) {
                    naCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    naCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);
                } else if (goldCard.isChecked()) {
                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    goldCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    whiteCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);
                } else {
                    whiteCard.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    whiteCard.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    naCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    naCard.setBackgroundResource(R.drawable.toggle_widget_background);

                    goldCard.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    goldCard.setBackgroundResource(R.drawable.toggle_widget_background);
                }
                Log.d(TAG, radioButton.getHint() + "");
                break;
            case R.id.toggleHospital:
                if (yesHosCover.isChecked()) {
                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noHosCover.setBackgroundResource(R.drawable.toggle_widget_background);
                } else {
                    noHosCover.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noHosCover.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesHosCover.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesHosCover.setBackgroundResource(R.drawable.toggle_widget_background);
                }
                Log.d(TAG, radioButton.getHint() + "");
                break;
            case R.id.toggleInsurance:
                if (yesInsurance.isChecked()) {
                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noInsurance.setBackgroundResource(R.drawable.toggle_widget_background);
                } else {
                    noInsurance.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noInsurance.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesInsurance.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesInsurance.setBackgroundResource(R.drawable.toggle_widget_background);
                }
                Log.d(TAG, radioButton.getHint() + "");
                break;
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
                    salutaion = "";
                } else {
                    // Notify the selected item text
                    salutaion = selectedItemText;
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
            txtDOB.setError(null);
            iPatientRedisitePresenter.displayDatePickerDialog();
        }
    }

    @Override
    public void onLoadDOB(String dob) {
        txtDOB.setText(dob);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnInjury:
                iPatientRedisitePresenter.changeFragment(new InjuryFragment());
                break;
            case R.id.btnIllness:
                iPatientRedisitePresenter.changeFragment(new IllnessFragment());
                break;
        }
    }

}
