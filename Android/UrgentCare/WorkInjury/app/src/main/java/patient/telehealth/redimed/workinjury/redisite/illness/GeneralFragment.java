package patient.telehealth.redimed.workinjury.redisite.illness;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;


import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.ModelGeneral;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.redisite.illness.adapter.MedicalHistoryAdapter;
import patient.telehealth.redimed.workinjury.redisite.illness.adapter.SymptomsAdapter;
import patient.telehealth.redimed.workinjury.redisite.illness.presenter.GeneralPresenter;
import patient.telehealth.redimed.workinjury.redisite.illness.presenter.IGeneralPresenter;
import patient.telehealth.redimed.workinjury.redisite.illness.view.IGeneralView;
import patient.telehealth.redimed.workinjury.redisite.image.ImageFragment;
import patient.telehealth.redimed.workinjury.utils.DeviceUtils;
import patient.telehealth.redimed.workinjury.utils.GridItemView;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.PreCachingLayoutManager;

/**
 * A simple {@link Fragment} subclass.
 */
public class GeneralFragment extends Fragment implements IGeneralView, RadioGroup.OnCheckedChangeListener, View.OnClickListener {

    private Context context;
    private ArrayList<String> selectedSymptoms;
    private IGeneralPresenter iGeneralPresenter;
    private static final String TAG = "=====GENERAL=====";
    private Gson gson;
    private List<TempDataBean> dataIllness;

    protected MyApplication application;

    @Bind(R.id.txtDOC) EditText txtDOC;
    @Bind(R.id.toggleSymptoms) RadioGroup toggleSymptoms;
    @Bind(R.id.rvMedicalHistory) RecyclerView rvMedicalHistory;
    @Bind(R.id.txtOtherMedicalHistory) EditText txtOtherMedicalHistory;
    @Bind(R.id.gridSymptoms) GridView gridSymptoms;
    @Bind(R.id.txtOtherSymptoms) EditText txtOtherSymptoms;
    @Bind(R.id.toggleMedications) RadioGroup toggleMedications;
    @Bind(R.id.yesMedications) RadioButton yesMedications;
    @Bind(R.id.txtMedications) EditText txtMedications;
    @Bind(R.id.toggleAllergies) RadioGroup toggleAllergies;
    @Bind(R.id.yesAllergies) RadioButton yesAllergies;
    @Bind(R.id.txtAllergies) EditText txtAllergies;
    @Bind(R.id.txtVitalSigns) EditText txtVitalSigns;
    @Bind(R.id.txtTemp) EditText txtTemp;
    @Bind(R.id.txtRR) EditText txtRR;
    @Bind(R.id.txtBlood) EditText txtBlood;
    @Bind(R.id.txtSaO2) EditText txtSaO2;
    @Bind(R.id.txtTreatment) EditText txtTreatment;
    @Bind(R.id.layoutGeneral) LinearLayout layoutGeneral;

    @Bind(R.id.btnIllness)
    Button btnIllness;

    public GeneralFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.context = getContext();
        this.application = (MyApplication) context.getApplicationContext();
        selectedSymptoms = new ArrayList<>();
        iGeneralPresenter = new GeneralPresenter(context, getActivity(), this);
        dataIllness = application.getTempDataIllness();
        gson = new Gson();
    }

    private void getDataIllness(List<TempDataBean> list) {
        for (TempDataBean item: list) {
            switch (item.getName()) {
                case "inj_date":
                    txtDOC.setText(item.getValue());
                    break;
                case "other_medical_history":
                    txtOtherMedicalHistory.setText(item.getValue());
                    break;
                case "other_symptoms":
                    txtOtherSymptoms.setText(item.getValue());
                    break;
                case "medictation":
                    txtMedications.setText(item.getValue());
                    break;
                case "allergies":
                    txtAllergies.setText(item.getValue());
                    break;
                case "hr":
                    txtVitalSigns.setText(item.getValue());
                    break;
                case "temp":
                    txtTemp.setText(item.getValue());
                    break;
                case "rr":
                    txtRR.setText(item.getValue());
                    break;
                case "blood_pressure":
                    txtBlood.setText(item.getValue());
                    break;
                case "sao2":
                    txtSaO2.setText(item.getValue());
                    break;
                case "initial_treatment":
                    txtTreatment.setText(item.getValue());
                    break;
                case "is_sym_before":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                toggleSymptoms.check(R.id.yesSymptoms);
                                break;
                            case "no":
                                toggleSymptoms.check(R.id.noSymptoms);
                                break;
                        }
                    }
                    break;
                case "is_medic":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                toggleMedications.check(R.id.yesMedications);
                                txtMedications.setEnabled(true);
                                break;
                            case "no":
                                toggleMedications.check(R.id.noMedications);
                                break;
                        }
                    }
                    break;
                case "is_allergies":
                    if (item.getChecked().equalsIgnoreCase("true")) {
                        switch (item.getValue()) {
                            case "yes":
                                toggleAllergies.check(R.id.yesAllergies);
                                txtAllergies.setEnabled(true);
                                break;
                            case "no":
                                toggleAllergies.check(R.id.noAllergies);
                                break;
                        }
                    }
                    break;
            }
        }
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        View v = inflater.inflate(R.layout.fragment_illness, container, false);

        ButterKnife.bind(this, v);
        application.hidenKeyboard(v);


        this.getListMedicalHistory();
        this.getSymptoms();

        if (dataIllness.size() > 0){
            getDataIllness(dataIllness);
        }

        toggleSymptoms.setOnCheckedChangeListener(this);
        toggleAllergies.setOnCheckedChangeListener(this);
        toggleMedications.setOnCheckedChangeListener(this);

        btnIllness.setOnClickListener(this);

        return v;
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

                    application.getIllnessSymptoms().get(position).setChecked("false");
                } else {
                    ((GridItemView) v).display(true);
                    symptomsAdapter.selectedPositions.add(position);
                    selectedSymptoms.add(String.valueOf(parent.getItemAtPosition(position)));

                    application.getIllnessSymptoms().get(position).setChecked("true");
                }
            }
        });
    }

    @Override
    public void onCheckedChanged(RadioGroup group, int checkedId) {
        switch (group.getId()) {
            case R.id.toggleMedications:
                if (yesMedications.isChecked()) {
                    txtMedications.setEnabled(true);
                } else {
                    txtMedications.setText("");
                    txtMedications.setEnabled(false);
                }
                break;
            case R.id.toggleAllergies:
                if (yesAllergies.isChecked()) {
                    txtAllergies.setEnabled(true);
                } else {
                    txtAllergies.setText("");
                    txtAllergies.setEnabled(false);
                }
                break;
        }
    }

    @Override
    public void onClick(View view) {
        application.cleanTempDataIllness();

        application.setTempDataIllness(application.EformDate("inj_date", "row_2_0", String.valueOf(txtDOC.getText()), "field_2_0_1"));
        application.setTempDataIllness(application.EformText("other_medical_history", "row_2_2", String.valueOf(txtOtherMedicalHistory.getText()), "field_2_2_1"));
        application.setTempDataIllness(application.EformText("other_symptoms", "row_2_14", String.valueOf(txtOtherSymptoms.getText()), "field_2_14_1"));
        application.setTempDataIllness(application.EformText("medictation", "row_2_15", String.valueOf(txtMedications.getText()), "field_2_15_3"));
        application.setTempDataIllness(application.EformText("allergies", "row_2_16", String.valueOf(txtAllergies.getText()), "field_2_16_3"));
        application.setTempDataIllness(application.EformText("hr", "row_2_17", String.valueOf(txtVitalSigns.getText()), "field_2_17_1"));
        application.setTempDataIllness(application.EformText("temp", "row_2_17", String.valueOf(txtTemp.getText()), "field_2_17_3"));
        application.setTempDataIllness(application.EformText("rr", "row_2_17", String.valueOf(txtRR.getText()), "field_2_17_5"));
        application.setTempDataIllness(application.EformText("blood_pressure", "row_2_18", String.valueOf(txtBlood.getText()), "field_2_18_1"));
        application.setTempDataIllness(application.EformText("sao2", "row_2_18", String.valueOf(txtSaO2.getText()), "field_2_18_3"));
        application.setTempDataIllness(application.EformText("initial_treatment", "row_2_19", String.valueOf(txtTreatment.getText()), "field_2_19_1"));

        application.setTempDataIllness(application.EformRadio("is_sym_before", "row_2_1", "yes", (toggleSymptoms.getCheckedRadioButtonId() == R.id.yesSymptoms) ? "true" : "false", "field_2_1_2"));
        application.setTempDataIllness(application.EformRadio("is_sym_before", "row_2_1", "no", (toggleSymptoms.getCheckedRadioButtonId() == R.id.noSymptoms) ? "true" : "false", "field_2_1_1"));

        application.setTempDataIllness(application.EformRadio("is_medic", "row_2_15", "yes", (toggleMedications.getCheckedRadioButtonId() == R.id.yesMedications) ? "true" : "false", "field_2_15_2"));
        application.setTempDataIllness(application.EformRadio("is_medic", "row_2_15", "no", (toggleMedications.getCheckedRadioButtonId() == R.id.noMedications) ? "true" : "false", "field_2_15_1"));

        application.setTempDataIllness(application.EformRadio("is_allergies", "row_2_16", "yes", (toggleAllergies.getCheckedRadioButtonId() == R.id.yesAllergies) ? "true" : "false", "field_2_16_2"));
        application.setTempDataIllness(application.EformRadio("is_allergies", "row_2_16", "no", (toggleAllergies.getCheckedRadioButtonId() == R.id.noAllergies) ? "true" : "false", "field_2_16_1"));

        application.setTempDataIllnessList(application.getMedicalHistory());
        application.setTempDataIllnessList(application.getIllnessSymptoms());

        application.setRedisiteInjury(false);
        application.replaceFragment(new ImageFragment(), Key.fmRedisiteImage, Key.fmRedisiteIllness);
    }
}
