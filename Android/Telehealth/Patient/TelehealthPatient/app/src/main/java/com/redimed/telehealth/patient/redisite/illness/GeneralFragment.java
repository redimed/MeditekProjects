package com.redimed.telehealth.patient.redisite.illness;

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
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.MedicalHistoryAdapter;
import com.redimed.telehealth.patient.adapter.SymptomsAdapter;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.consent.ConsentFragment;
import com.redimed.telehealth.patient.redisite.illness.presenter.IGeneralPresenter;
import com.redimed.telehealth.patient.redisite.illness.presenter.GeneralPresenter;
import com.redimed.telehealth.patient.redisite.illness.view.IGeneralView;
import com.redimed.telehealth.patient.redisite.image.ImageFragment;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.GridItemView;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import retrofit.http.Header;

/**
 * A simple {@link Fragment} subclass.
 */
public class GeneralFragment extends Fragment implements IGeneralView, RadioGroup.OnCheckedChangeListener, View.OnFocusChangeListener {

    private Context context;
    private ArrayList<String> selectedSymptoms;
    private IGeneralPresenter iGeneralPresenter;
    private ArrayList<EFormData> eFormDatas, eFormDataSymptoms;
    private static final String TAG = "=====GENERAL=====";

    protected MyApplication application;

    @Bind(R.id.layoutGeneral)
    LinearLayout layoutGeneral;
    @Bind(R.id.txtDOC)
    EditText txtDOC;
    @Bind(R.id.toggleSymptoms)
    RadioGroup toggleSymptoms;
    @Bind(R.id.noSymptoms)
    RadioButton noSymptoms;
    @Bind(R.id.yesSymptoms)
    RadioButton yesSymptoms;
    @Bind(R.id.rvMedicalHistory)
    RecyclerView rvMedicalHistory;
    @Bind(R.id.txtOtherMedicalHistory)
    EditText txtOtherMedicalHistory;
    @Bind(R.id.gridSymptoms)
    GridView gridSymptoms;
    @Bind(R.id.txtOtherSymptoms)
    EditText txtOtherSymptoms;
    @Bind(R.id.toggleMedications)
    RadioGroup toggleMedications;
    @Bind(R.id.noMedications)
    RadioButton noMedications;
    @Bind(R.id.yesMedications)
    RadioButton yesMedications;
    @Bind(R.id.txtMedications)
    EditText txtMedications;
    @Bind(R.id.toggleAllergies)
    RadioGroup toggleAllergies;
    @Bind(R.id.noAllergies)
    RadioButton noAllergies;
    @Bind(R.id.yesAllergies)
    RadioButton yesAllergies;
    @Bind(R.id.txtAllergies)
    EditText txtAllergies;
    @Bind(R.id.txtVitalSigns)
    EditText txtVitalSigns;
    @Bind(R.id.txtTemp)
    EditText txtTemp;
    @Bind(R.id.txtRR)
    EditText txtRR;
    @Bind(R.id.txtBlood)
    EditText txtBlood;
    @Bind(R.id.txtSaO2)
    EditText txtSaO2;
    @Bind(R.id.txtTreatment)
    EditText txtTreatment;

    @Bind(R.id.btnIllness)
    Button btnIllness;

    public GeneralFragment() {
        // Required empty public constructor
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        eFormDatas = new ArrayList<>();
        // Default value toggle Symptoms before
        eFormDatas.add(0, new EFormData("no", "is_sym_before", "field_2_7_1", "eform_input_check_radio", true, "row_2_7", 0));
        eFormDatas.add(1, new EFormData("yes", "is_sym_before", "field_2_7_2", "eform_input_check_radio", false, "row_2_7", 0));

        // Default value toggle Medications
        eFormDatas.add(2, new EFormData("no", "is_medic", "field_2_19_1", "eform_input_check_radio", true, "row_2_19", 0));
        eFormDatas.add(3, new EFormData("yes", "is_medic", "field_2_19_2", "eform_input_check_radio", false, "row_2_19", 0));

        // Default value toggle Allergies
        eFormDatas.add(4, new EFormData("no", "is_allergies", "field_2_20_1", "eform_input_check_radio", true, "row_2_20", 0));
        eFormDatas.add(5, new EFormData("yes", "is_allergies", "field_2_20_2", "eform_input_check_radio", false, "row_2_20", 0));

        // Default value multi selected Body parts
        eFormDataSymptoms = new ArrayList<>();
        eFormDataSymptoms.add(0, new EFormData("yes", "sym1", "field_2_7_0", "eform_input_check_checkbox", false, "row_2_7", 0));
        eFormDataSymptoms.add(1, new EFormData("yes", "sym2", "field_2_7_1", "eform_input_check_checkbox", false, "row_2_7", 0));
        eFormDataSymptoms.add(2, new EFormData("yes", "sym3", "field_2_7_2", "eform_input_check_checkbox", false, "row_2_7", 0));
        eFormDataSymptoms.add(3, new EFormData("yes", "sym4", "field_2_8_0", "eform_input_check_checkbox", false, "row_2_8", 0));
        eFormDataSymptoms.add(4, new EFormData("yes", "sym5", "field_2_8_1", "eform_input_check_checkbox", false, "row_2_8", 0));
        eFormDataSymptoms.add(5, new EFormData("yes", "sym6", "field_2_8_2", "eform_input_check_checkbox", false, "row_2_8", 0));
        eFormDataSymptoms.add(6, new EFormData("yes", "sym7", "field_2_9_0", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataSymptoms.add(7, new EFormData("yes", "sym8", "field_2_9_1", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataSymptoms.add(8, new EFormData("yes", "sym9", "field_2_9_2", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataSymptoms.add(9, new EFormData("yes", "sym10", "field_2_10_0", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataSymptoms.add(10, new EFormData("yes", "sym11", "field_2_10_1", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataSymptoms.add(11, new EFormData("yes", "sym12", "field_2_10_2", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataSymptoms.add(12, new EFormData("yes", "sym13", "field_2_11_0", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataSymptoms.add(13, new EFormData("yes", "sym14", "field_2_11_1", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataSymptoms.add(14, new EFormData("yes", "sym15", "field_2_13_1", "eform_input_check_checkbox", false, "row_2_13", 0));
        eFormDataSymptoms.add(15, new EFormData("yes", "sym16", "field_2_11_2", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataSymptoms.add(16, new EFormData("yes", "sym17", "field_2_12_0", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataSymptoms.add(17, new EFormData("yes", "sym18", "field_2_12_1", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataSymptoms.add(18, new EFormData("yes", "sym19", "field_2_12_2", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataSymptoms.add(19, new EFormData("yes", "sym20", "field_2_13_0", "eform_input_check_checkbox", false, "row_2_13", 0));

    }

    private void receivedData() {
        ArrayList<EFormData> eFormDatas = Singleton.getInstance().getEFormDatas();
        if (eFormDatas.size() > 0) {
            for (EFormData eFormData : eFormDatas) {
                switch (eFormData.getName()) {
                    case "inj_date":
                        txtDOC.setText(eFormData.getValue());
                        break;
                    case "other_medical_history":
                        txtOtherMedicalHistory.setText(eFormData.getValue());
                        break;
                    case "other_symptoms":
                        txtOtherSymptoms.setText(eFormData.getValue());
                        break;
                    case "medictation":
                        txtMedications.setText(eFormData.getValue());
                        break;
                    case "allergies":
                        txtAllergies.setText(eFormData.getValue());
                        break;
                    case "hr":
                        txtVitalSigns.setText(eFormData.getValue());
                        break;
                    case "temp":
                        txtTemp.setText(eFormData.getValue());
                        break;
                    case "rr":
                        txtRR.setText(eFormData.getValue());
                        break;
                    case "blood_pressure":
                        txtBlood.setText(eFormData.getValue());
                        break;
                    case "sao2":
                        txtSaO2.setText(eFormData.getValue());
                        break;
                    case "initial_treatment":
                        txtTreatment.setText(eFormData.getValue());
                        break;
                    case "is_sym_before":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    yesSymptoms.setChecked(true);
                                    yesSymptoms.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    yesSymptoms.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    noSymptoms.setChecked(false);
                                    noSymptoms.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    noSymptoms.setBackgroundResource(R.drawable.toggle_widget_background);
                                    break;
                                case "no":
                                    noSymptoms.setChecked(true);
                                    noSymptoms.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    noSymptoms.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    yesSymptoms.setChecked(false);
                                    yesSymptoms.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    yesSymptoms.setBackgroundResource(R.drawable.toggle_widget_background);
                                    break;
                            }
                        }
                        break;
                    case "is_medic":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    yesMedications.setChecked(true);
                                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    yesMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    noMedications.setChecked(false);
                                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    noMedications.setBackgroundResource(R.drawable.toggle_widget_background);

                                    txtMedications.setEnabled(true);
                                    break;
                                case "no":
                                    noMedications.setChecked(true);
                                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    noMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    yesMedications.setChecked(false);
                                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    yesMedications.setBackgroundResource(R.drawable.toggle_widget_background);
                                    break;
                            }
                        }
                        break;
                    case "is_allergies":
                        if (eFormData.isChecked()) {
                            switch (eFormData.getValue()) {
                                case "yes":
                                    yesAllergies.setChecked(true);
                                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    yesAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    noAllergies.setChecked(false);
                                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    noAllergies.setBackgroundResource(R.drawable.toggle_widget_background);

                                    txtAllergies.setEnabled(true);
                                    break;
                                case "no":
                                    noAllergies.setChecked(true);
                                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                                    noAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                                    yesAllergies.setChecked(false);
                                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                                    yesAllergies.setBackgroundResource(R.drawable.toggle_widget_background);
                                    break;
                            }
                        }
                        break;
                    case "sym1":
                        eFormDataSymptoms.get(0).setChecked(eFormData.isChecked());
                        break;
                    case "sym2":
                        eFormDataSymptoms.get(1).setChecked(eFormData.isChecked());
                        break;
                    case "sym3":
                        eFormDataSymptoms.get(2).setChecked(eFormData.isChecked());
                        break;
                    case "sym4":
                        eFormDataSymptoms.get(3).setChecked(eFormData.isChecked());
                        break;
                    case "sym5":
                        eFormDataSymptoms.get(4).setChecked(eFormData.isChecked());
                        break;
                    case "sym6":
                        eFormDataSymptoms.get(5).setChecked(eFormData.isChecked());
                        break;
                    case "sym7":
                        eFormDataSymptoms.get(6).setChecked(eFormData.isChecked());
                        break;
                    case "sym8":
                        eFormDataSymptoms.get(7).setChecked(eFormData.isChecked());
                        break;
                    case "sym9":
                        eFormDataSymptoms.get(8).setChecked(eFormData.isChecked());
                        break;
                    case "sym10":
                        eFormDataSymptoms.get(9).setChecked(eFormData.isChecked());
                        break;
                    case "sym11":
                        eFormDataSymptoms.get(10).setChecked(eFormData.isChecked());
                        break;
                    case "sym12":
                        eFormDataSymptoms.get(11).setChecked(eFormData.isChecked());
                        break;
                    case "sym13":
                        eFormDataSymptoms.get(12).setChecked(eFormData.isChecked());
                        break;
                    case "sym14":
                        eFormDataSymptoms.get(13).setChecked(eFormData.isChecked());
                        break;
                    case "sym15":
                        eFormDataSymptoms.get(14).setChecked(eFormData.isChecked());
                        break;
                    case "sym16":
                        eFormDataSymptoms.get(15).setChecked(eFormData.isChecked());
                        break;
                    case "sym17":
                        eFormDataSymptoms.get(16).setChecked(eFormData.isChecked());
                        break;
                    case "sym18":
                        eFormDataSymptoms.get(17).setChecked(eFormData.isChecked());
                        break;
                    case "sym19":
                        eFormDataSymptoms.get(18).setChecked(eFormData.isChecked());
                        break;
                    case "sym20":
                        eFormDataSymptoms.get(19).setChecked(eFormData.isChecked());
                        break;
                    default:
                        break;
                }
            }
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_illness, container, false);
        this.context = v.getContext();
        this.application = (MyApplication) context.getApplicationContext();
        ButterKnife.bind(this, v);

        selectedSymptoms = new ArrayList<>();
        iGeneralPresenter = new GeneralPresenter(context, getActivity(), this);

        this.getListMedicalHistory();
        this.getSymptoms();

        txtDOC.setOnFocusChangeListener(this);

        toggleSymptoms.setOnCheckedChangeListener(this);
        toggleAllergies.setOnCheckedChangeListener(this);
        toggleMedications.setOnCheckedChangeListener(this);

        btnIllness.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EFormSingleton();
                if (iGeneralPresenter.validatedAllElement(layoutGeneral)) {
                    iGeneralPresenter.changeFragment(setFlagFragment());
                }
            }
        });

        receivedData();

        return v;
    }

    private void EFormSingleton() {
        ArrayList<EFormData> eFormDataInjury = application.getSelectedInjury();
        ArrayList<EFormData> eFormDatasRedisite = Singleton.getInstance().getEFormDatas();
        ArrayList<EFormData> eFormDataMedicalHistory = application.getSelectedMedicalHistory();

        Singleton.getInstance().clearAll();
        Singleton.getInstance().addEFormDatas(eFormDatas);
        Singleton.getInstance().addEFormDatas(eFormDataSymptoms);
        Singleton.getInstance().addEFormDatas(eFormDataMedicalHistory);

        Singleton.getInstance().setEFormInjury(eFormDataInjury);
        Singleton.getInstance().setEFormPatient(eFormDatasRedisite);
        Singleton.getInstance().setEFormSymptoms(eFormDataSymptoms);
        Singleton.getInstance().setEFormMedicalHistory(eFormDataMedicalHistory);
    }

    private void getListMedicalHistory() {
        MedicalHistoryAdapter medicalHistoryAdapter = new MedicalHistoryAdapter(context);

        PreCachingLayoutManager layoutManager = new PreCachingLayoutManager(context);
        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManager.setExtraLayoutSpace(DeviceUtils.getScreenHeight(context));

        rvMedicalHistory.setLayoutManager(layoutManager);
        rvMedicalHistory.setAdapter(medicalHistoryAdapter);
    }

    // GridView Symptoms
    public void getSymptoms() {
        final SymptomsAdapter symptomsAdapter = new SymptomsAdapter(context, getActivity());
        gridSymptoms.setAdapter(symptomsAdapter);
        gridSymptoms.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View v, int position, long id) {
                int selectedIndex = symptomsAdapter.selectedPositions.indexOf(position);
                if (selectedIndex > -1) {
                    ((GridItemView) v).display(false);
                    symptomsAdapter.selectedPositions.remove(selectedIndex);
                    selectedSymptoms.remove(String.valueOf(parent.getItemAtPosition(position)));

                    eFormDataSymptoms.get(position).setChecked(false);
                } else {
                    ((GridItemView) v).display(true);
                    symptomsAdapter.selectedPositions.add(position);
                    selectedSymptoms.add(String.valueOf(parent.getItemAtPosition(position)));

                    eFormDataSymptoms.get(position).setChecked(true);
                }
            }
        });
    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (group.getId()) {
            case R.id.toggleSymptoms:
                if (yesSymptoms.isChecked()) {
                    yesSymptoms.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesSymptoms.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noSymptoms.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noSymptoms.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(0).setChecked(false);
                    eFormDatas.get(1).setChecked(true);
                } else {
                    noSymptoms.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noSymptoms.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesSymptoms.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesSymptoms.setBackgroundResource(R.drawable.toggle_widget_background);

                    eFormDatas.get(0).setChecked(true);
                    eFormDatas.get(1).setChecked(false);
                }
                break;
            case R.id.toggleMedications:
                if (yesMedications.isChecked()) {
                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noMedications.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtMedications.setEnabled(true);

                    eFormDatas.get(2).setChecked(false);
                    eFormDatas.get(3).setChecked(true);
                } else {
                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesMedications.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtMedications.setText("");
                    txtMedications.setEnabled(false);

                    eFormDatas.get(2).setChecked(true);
                    eFormDatas.get(3).setChecked(false);
                }
                break;
            case R.id.toggleAllergies:
                if (yesAllergies.isChecked()) {
                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noAllergies.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtAllergies.setEnabled(true);

                    eFormDatas.get(4).setChecked(false);
                    eFormDatas.get(5).setChecked(true);
                } else {
                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesAllergies.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtAllergies.setText("");
                    txtAllergies.setEnabled(false);

                    eFormDatas.get(4).setChecked(true);
                    eFormDatas.get(5).setChecked(false);
                }
                break;
            default:
                break;
        }
    }

    private Fragment setFlagFragment() {
        Bundle bundle = new Bundle();
        bundle.putString("flagFragment", "general");

        Fragment fragment = new ImageFragment();
        fragment.setArguments(bundle);

        return fragment;
    }

    @Override
    public void onLoadDOC(String DOB) {
        txtDOC.setText(DOB);
    }

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        if (hasFocus) {
            iGeneralPresenter.displayDatePickerDialog();
        }
    }
}
