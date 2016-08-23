package patient.telehealth.redimed.workinjury.redisite.injury;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
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
import android.widget.SeekBar;
import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.List;
import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;
import patient.telehealth.redimed.workinjury.redisite.illness.adapter.MedicalHistoryAdapter;
import patient.telehealth.redimed.workinjury.redisite.image.ImageFragment;
import patient.telehealth.redimed.workinjury.redisite.injury.adapter.BodyPartsAdapter;
import patient.telehealth.redimed.workinjury.redisite.injury.adapter.InjuryAdapter;
import patient.telehealth.redimed.workinjury.redisite.injury.adapter.InjurySymptomsAdapter;
import patient.telehealth.redimed.workinjury.redisite.injury.presenter.IInjuryPresenter;
import patient.telehealth.redimed.workinjury.redisite.injury.presenter.InjuryPresenter;
import patient.telehealth.redimed.workinjury.redisite.injury.view.IInjuryView;
import patient.telehealth.redimed.workinjury.redisite.patient.PatientRedisiteFragment;
import patient.telehealth.redimed.workinjury.utils.DeviceUtils;
import patient.telehealth.redimed.workinjury.utils.GridItemView;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.utils.PreCachingLayoutManager;

/**
 * A simple {@link Fragment} subclass.
 */
public class InjuryFragment extends Fragment implements IInjuryView, View.OnClickListener, SeekBar.OnSeekBarChangeListener, RadioGroup.OnCheckedChangeListener {

    private Context context;
    private ArrayList<String> selectedBodies;
    private IInjuryPresenter iInjuryPresenter;
    private Gson gson;
    private static final String TAG = "=====INJURY=====";
    private int progress = 0;
    private List<TempDataBean> dataInjury;


    protected MyApplication application;

    @Bind(R.id.txtDOC) EditText txtDOC;
    @Bind(R.id.txtWorkplace) EditText txtWorkplace;
    @Bind(R.id.txtOccurrence) EditText txtOccurrence;
    @Bind(R.id.rvInjury) RecyclerView rvInjury;
    @Bind(R.id.txtOtherInjury) EditText txtOtherInjury;
    @Bind(R.id.toggleSymptoms) RadioGroup toggleSymptoms;
    @Bind(R.id.gridBodyParts) GridView gridBodyParts;
    @Bind(R.id.txtOtherBody) EditText txtOtherBody;
    @Bind(R.id.rvMedicalHistory) RecyclerView rvMedicalHistory;
    @Bind(R.id.txtOtherMedical) EditText txtOtherMedical;
    @Bind(R.id.toggleMedications) RadioGroup toggleMedications;
    @Bind(R.id.yesMedications) RadioButton yesMedications;
    @Bind(R.id.txtMedications) EditText txtMedications;
    @Bind(R.id.toggleAllergies) RadioGroup toggleAllergies;
    @Bind(R.id.yesAllergies) RadioButton yesAllergies;
    @Bind(R.id.txtAllergies) EditText txtAllergies;
    @Bind(R.id.rvInjurySymptoms) RecyclerView rvInjurySymptoms;
    @Bind(R.id.txtOtherInjurySymptoms) EditText txtOtherInjurySymptoms;
    @Bind(R.id.seekBarPain) SeekBar seekBarPain;
    @Bind(R.id.txtPain) EditText txtPain;
    @Bind(R.id.txtTreatment) EditText txtTreatment;
    @Bind(R.id.btnInjury) Button btnInjury;
    @Bind(R.id.layoutRedisiteInjury) LinearLayout layoutRedisiteInjury;

    public InjuryFragment() {
        // Required empty public constructor
    }

    private void getDataInjury(List<TempDataBean> list) {
        for (TempDataBean item: list) {
            switch (item.getName()) {
                case "inj_date":
                    txtDOC.setText(item.getValue());
                    break;
                case "inj_place":
                    txtWorkplace.setText(item.getValue());
                    break;
                case "what_happened":
                    txtOccurrence.setText(item.getValue());
                    break;
                case "other_inj":
                    txtOtherInjury.setText(item.getValue());
                    break;
                case "other_part_affected":
                    txtOtherBody.setText(item.getValue());
                    break;
                case "other_medical_histor":
                    txtOtherMedical.setText(item.getValue());
                    break;
                case "medictation":
                    txtMedications.setText(item.getValue());
                    break;
                case "allergies":
                    txtAllergies.setText(item.getValue());
                    break;
                case "other_symptoms":
                    txtOtherInjurySymptoms.setText(item.getValue());
                    break;
                case "pain_level":
                    int painLevel = Integer.parseInt(item.getValue());
                    seekBarPain.setProgress(painLevel);
                    txtPain.setText(item.getValue());
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
                default:
                    break;
            }
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = getContext();
        selectedBodies = new ArrayList<>();
        application = (MyApplication) context.getApplicationContext();
        iInjuryPresenter = new InjuryPresenter(context, this, getActivity());
        dataInjury =  application.getTempDataInjury();
        gson = new Gson();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        View v = inflater.inflate(R.layout.fragment_injury, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        application.hidenKeyboard(v);
        application.createTooBarLogo(v);


        this.getListInjury();
        this.getBodyParts();
        this.getListMedicalHistory();
        this.getListInjurySymptoms();

        if (dataInjury.size() > 0){
            getDataInjury(dataInjury);
        }


        toggleAllergies.setOnCheckedChangeListener(this);
        toggleMedications.setOnCheckedChangeListener(this);

        seekBarPain.setOnSeekBarChangeListener(this);

        btnInjury.setOnClickListener(this);


        return v;
    }

    // GridView Body Parts
    public void getBodyParts() {
        final BodyPartsAdapter adapter = new BodyPartsAdapter(context, getActivity());
        gridBodyParts.setAdapter(adapter);
        gridBodyParts.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View v, int position, long id) {
                int selectedIndex = adapter.selectedPositions.indexOf(position);
                if (selectedIndex > -1) {
                    ((GridItemView) v).display(false);
                    adapter.selectedPositions.remove(selectedIndex);
                    selectedBodies.remove(String.valueOf(parent.getItemAtPosition(position)));

                    application.getInjuryBodyPart().get(position).setChecked("false");
                } else {
                    ((GridItemView) v).display(true);
                    adapter.selectedPositions.add(position);
                    selectedBodies.add((String) parent.getItemAtPosition(position));

                    application.getInjuryBodyPart().get(position).setChecked("true");
                }
            }
        });
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    private void getListInjury() {
        InjuryAdapter injuryAdapter = new InjuryAdapter(context);

        PreCachingLayoutManager layoutManager = new PreCachingLayoutManager(context);
        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManager.setExtraLayoutSpace(DeviceUtils.getScreenWidth(context));

        rvInjury.setLayoutManager(layoutManager);
        rvInjury.setAdapter(injuryAdapter);
    }

    private void getListMedicalHistory() {
        MedicalHistoryAdapter medicalHistoryAdapter = new MedicalHistoryAdapter(context);

        PreCachingLayoutManager layoutManager = new PreCachingLayoutManager(context);
        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManager.setExtraLayoutSpace(DeviceUtils.getScreenHeight(context));

        rvMedicalHistory.setLayoutManager(layoutManager);
        rvMedicalHistory.setAdapter(medicalHistoryAdapter);
    }

    private void getListInjurySymptoms() {
        InjurySymptomsAdapter injurySymptomsAdapter = new InjurySymptomsAdapter(context);

        PreCachingLayoutManager layoutManager = new PreCachingLayoutManager(context);
        layoutManager.setOrientation(LinearLayoutManager.HORIZONTAL);
        layoutManager.setExtraLayoutSpace(DeviceUtils.getScreenHeight(context));

        rvInjurySymptoms.setLayoutManager(layoutManager);
        rvInjurySymptoms.setAdapter(injurySymptomsAdapter);
    }

    @Override
    public void onClick(View view) {
        application.cleanTempDataInjury();

        application.setTempDataInjury(application.EformDate("inj_date", "row_2_0", String.valueOf(txtDOC.getText()), "field_2_0_1"));
        application.setTempDataInjury(application.EformText("inj_place", "row_2_1", String.valueOf(txtWorkplace.getText()), "field_2_1_1"));
        application.setTempDataInjury(application.EformText("what_happened", "row_2_3", String.valueOf(txtOccurrence.getText()), "field_2_3_0"));
        application.setTempDataInjury(application.EformText("other_inj", "row_2_6", String.valueOf(txtOtherInjury.getText()), "field_2_6_1"));
        application.setTempDataInjury(application.EformText("other_part_affected", "row_2_14", String.valueOf(txtOtherBody.getText()), "field_2_14_1"));
        application.setTempDataInjury(application.EformText("other_medical_histor", "row_2_18", String.valueOf(txtOtherMedical.getText()), "field_2_18_1"));
        application.setTempDataInjury(application.EformText("other_symptoms", "row_2_24", String.valueOf(txtOtherInjurySymptoms.getText()), "field_2_24_1"));
        application.setTempDataInjury(application.EformText("pain_level", "row_2_23", String.valueOf(txtPain.getText()), "field_2_23_1"));
        application.setTempDataInjury(application.EformText("initial_treatment", "row_2_25", String.valueOf(txtTreatment.getText()), "field_2_25_1"));
        application.setTempDataInjury(application.EformText("initial_treatment", "row_2_25", String.valueOf(txtTreatment.getText()), "field_2_25_1"));
        application.setTempDataInjury(application.EformText("medictation", "row_2_19", String.valueOf(txtMedications.getText()), "field_2_19_3"));
        application.setTempDataInjury(application.EformText("allergies", "row_2_20", String.valueOf(txtAllergies.getText()), "field_2_20_3"));

        application.setTempDataInjury(application.EformRadio("is_sym_before", "row_2_7", "yes", (toggleSymptoms.getCheckedRadioButtonId() == R.id.yesSymptoms) ? "true" : "false", "field_2_7_1"));
        application.setTempDataInjury(application.EformRadio("is_sym_before", "row_2_7", "no", (toggleSymptoms.getCheckedRadioButtonId() == R.id.noSymptoms) ? "true" : "false", "field_2_7_2"));

        application.setTempDataInjury(application.EformRadio("is_medic", "row_2_19", "yes", (toggleMedications.getCheckedRadioButtonId() == R.id.yesMedications) ? "true" : "false", "field_2_19_2"));
        application.setTempDataInjury(application.EformRadio("is_medic", "row_2_19", "no", (toggleMedications.getCheckedRadioButtonId() == R.id.noMedications) ? "true" : "false", "field_2_19_1"));

        application.setTempDataInjury(application.EformRadio("is_allergies", "row_2_20", "yes", (toggleAllergies.getCheckedRadioButtonId() == R.id.yesAllergies) ? "true" : "false", "field_2_20_2"));
        application.setTempDataInjury(application.EformRadio("is_allergies", "row_2_20", "no", (toggleAllergies.getCheckedRadioButtonId() == R.id.noAllergies) ? "true" : "false", "field_2_20_1"));

        application.setTempDataInjuryList(application.getInjuryBodyPart());
        application.setTempDataInjuryList(application.getInjuryData());
        application.setTempDataInjuryList(application.getInjurySymptoms());
        application.setTempDataInjuryList(application.getMedicalHistory());

        application.setRedisiteInjury(true);
        application.replaceFragment(new ImageFragment(), Key.fmRedisiteImage, Key.fmRedisiteInjury);
    }


    @Override
    public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
        progress = i;
        txtPain.setText(String.valueOf(i));
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onCheckedChanged(RadioGroup radioGroup, int i) {
        switch (radioGroup.getId()) {
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
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                application.replaceFragment(new PatientRedisiteFragment(), Key.fmRedisitePatient, Key.fmHome);
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}
