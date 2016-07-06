package com.redimed.telehealth.patient.redisite.injury;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.annotation.RequiresApi;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.SeekBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.BodyPartsAdapter;
import com.redimed.telehealth.patient.adapter.InjuryAdapter;
import com.redimed.telehealth.patient.adapter.InjurySymptomsAdapter;
import com.redimed.telehealth.patient.adapter.MedicalHistoryAdapter;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;
import com.redimed.telehealth.patient.redisite.consent.ConsentFragment;
import com.redimed.telehealth.patient.redisite.image.ImageFragment;
import com.redimed.telehealth.patient.redisite.injury.presenter.IInjuryPresenter;
import com.redimed.telehealth.patient.redisite.injury.presenter.InjuryPresenter;
import com.redimed.telehealth.patient.redisite.injury.view.IInjuryView;
import com.redimed.telehealth.patient.redisite.patient.RedisiteFragment;
import com.redimed.telehealth.patient.setting.SettingFragment;
import com.redimed.telehealth.patient.utlis.GridItemView;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class InjuryFragment extends Fragment implements IInjuryView, RadioGroup.OnCheckedChangeListener, View.OnFocusChangeListener {

    private Context context;
    private ArrayList<String> selectedBodies;
    private IInjuryPresenter iInjuryPresenter;
    private ArrayList<EFormData> eFormDatas, eFormDataBodies;
    private static final String TAG = "=====INJURY=====";

    protected MyApplication application;

    @Bind(R.id.layoutRedisiteInjury)
    LinearLayout layoutRedisiteInjury;
    @Bind(R.id.txtDOC)
    EditText txtDOC;
    @Bind(R.id.txtWorkplace)
    EditText txtWorkplace;
    @Bind(R.id.txtOccurrence)
    EditText txtOccurrence;
    @Bind(R.id.rvInjury)
    RecyclerView rvInjury;
    @Bind(R.id.txtOtherInjury)
    EditText txtOtherInjury;
    @Bind(R.id.toggleSymptoms)
    RadioGroup toggleSymptoms;
    @Bind(R.id.noSymptoms)
    RadioButton noSymptoms;
    @Bind(R.id.yesSymptoms)
    RadioButton yesSymptoms;
    @Bind(R.id.gridBodyParts)
    GridView gridBodyParts;
    @Bind(R.id.txtOtherBody)
    EditText txtOtherBody;
    @Bind(R.id.rvMedicalHistory)
    RecyclerView rvMedicalHistory;
    @Bind(R.id.txtOtherMedical)
    EditText txtOtherMedical;
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
    @Bind(R.id.rvInjurySymptoms)
    RecyclerView rvInjurySymptoms;
    @Bind(R.id.txtOtherInjurySymptoms)
    EditText txtOtherInjurySymptoms;
    @Bind(R.id.seekBarPain)
    SeekBar seekBarPain;
    @Bind(R.id.txtPain)
    EditText txtPain;
    @Bind(R.id.txtTreatment)
    EditText txtTreatment;
    @Bind(R.id.btnInjury)
    Button btnInjury;

    public InjuryFragment() {
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
        eFormDataBodies = new ArrayList<>();
        eFormDataBodies.add(0, new EFormData("yes", "part1", "field_2_9_0", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataBodies.add(1, new EFormData("yes", "part2", "field_2_9_1", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataBodies.add(2, new EFormData("yes", "part3", "field_2_9_2", "eform_input_check_checkbox", false, "row_2_9", 0));
        eFormDataBodies.add(3, new EFormData("yes", "part4", "field_2_10_0", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataBodies.add(4, new EFormData("yes", "part5", "field_2_10_1", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataBodies.add(5, new EFormData("yes", "part6", "field_2_10_2", "eform_input_check_checkbox", false, "row_2_10", 0));
        eFormDataBodies.add(6, new EFormData("yes", "part7", "field_2_11_0", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataBodies.add(7, new EFormData("yes", "part8", "field_2_11_1", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataBodies.add(8, new EFormData("yes", "part9", "field_2_11_2", "eform_input_check_checkbox", false, "row_2_11", 0));
        eFormDataBodies.add(9, new EFormData("yes", "part10", "field_2_12_0", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataBodies.add(10, new EFormData("yes", "part11", "field_2_12_1", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataBodies.add(11, new EFormData("yes", "part12", "field_2_12_2", "eform_input_check_checkbox", false, "row_2_12", 0));
        eFormDataBodies.add(12, new EFormData("yes", "part13", "field_2_13_0", "eform_input_check_checkbox", false, "row_2_13", 0));
        eFormDataBodies.add(13, new EFormData("yes", "part14", "field_2_13_1", "eform_input_check_checkbox", false, "row_2_13", 0));
        eFormDataBodies.add(14, new EFormData("yes", "part15", "field_2_13_2", "eform_input_check_checkbox", false, "row_2_13", 0));
    }

    private void receivedData() {
        ArrayList<EFormData> eFormDatas = Singleton.getInstance().getEFormDatas();
        if (eFormDatas.size() > 0) {
            for (EFormData eFormData : eFormDatas) {
                switch (eFormData.getName()) {
                    case "exp_date":
                        txtDOC.setText(eFormData.getValue());
                        break;
                    case "inj_place":
                        txtWorkplace.setText(eFormData.getValue());
                        break;
                    case "what_happened":
                        txtOccurrence.setText(eFormData.getValue());
                        break;
                    case "other_inj":
                        txtOtherInjury.setText(eFormData.getValue());
                        break;
                    case "other_part_affected":
                        txtOtherBody.setText(eFormData.getValue());
                        break;
                    case "other_medical_history":
                        txtOtherMedical.setText(eFormData.getValue());
                        break;
                    case "medictation":
                        txtMedications.setText(eFormData.getValue());
                        break;
                    case "allergies":
                        txtAllergies.setText(eFormData.getValue());
                        break;
                    case "other_symptoms":
                        txtOtherInjurySymptoms.setText(eFormData.getValue());
                        break;
                    case "pain_level":
                        int painLevel = Integer.parseInt(eFormData.getValue());
                        seekBarPain.setProgress(painLevel);
                        txtPain.setText(eFormData.getValue());
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
        View v = inflater.inflate(R.layout.fragment_injury, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);

        context = v.getContext();
        selectedBodies = new ArrayList<>();
        application = (MyApplication) context.getApplicationContext();

        iInjuryPresenter = new InjuryPresenter(context, this, getActivity());
        iInjuryPresenter.hideKeyboardFragment(v);

        this.getListInjury();
        this.getBodyParts();
        this.getListMedicalHistory();
        this.getListInjurySymptoms();

        txtDOC.setOnFocusChangeListener(this);

        toggleSymptoms.setOnCheckedChangeListener(this);
        toggleAllergies.setOnCheckedChangeListener(this);
        toggleMedications.setOnCheckedChangeListener(this);

        seekBarPain.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            int progress = 0;
            @Override
            public void onProgressChanged(SeekBar seekBar, int progressValue, boolean fromUser) {
                progress = progressValue;
                txtPain.setText(String.valueOf(progressValue));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                Log.d(TAG, progress + "");
            }
        });

        btnInjury.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EFormSingleton();
                if (iInjuryPresenter.validatedAllElement(layoutRedisiteInjury)) {
                    iInjuryPresenter.changeFragment(setFlagFragment());
                }
            }
        });

        receivedData();

        return v;
    }

    private Fragment setFlagFragment() {
        Bundle bundle = new Bundle();
        bundle.putString("flagFragment", "injury");

        Fragment fragment = new ImageFragment();
        fragment.setArguments(bundle);

        return fragment;
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

                    eFormDataBodies.get(position).setChecked(false);
                } else {
                    ((GridItemView) v).display(true);
                    adapter.selectedPositions.add(position);
                    selectedBodies.add((String) parent.getItemAtPosition(position));

                    eFormDataBodies.get(position).setChecked(true);
                }
            }
        });
    }

    private void EFormSingleton() {
        ArrayList<EFormData> eFormDataInjury = application.getSelectedInjury();
        ArrayList<EFormData> eFormDatasRedisite = Singleton.getInstance().getEFormDatas();
        ArrayList<EFormData> eFormDataMedicalHistory = application.getSelectedMedicalHistory();
        ArrayList<EFormData> eFormDataInjurySymptoms = application.getSelectedInjurySymptoms();

        Singleton.getInstance().clearAll();
        Singleton.getInstance().addEFormDatas(eFormDatas);
        Singleton.getInstance().addEFormDatas(eFormDataBodies);
        Singleton.getInstance().addEFormDatas(eFormDataInjury);
        Singleton.getInstance().addEFormDatas(eFormDataMedicalHistory);
        Singleton.getInstance().addEFormDatas(eFormDataInjurySymptoms);

        Singleton.getInstance().setEFormInjury(eFormDataInjury);
        Singleton.getInstance().setEFormBodyParts(eFormDataBodies);
        Singleton.getInstance().setEFormPatient(eFormDatasRedisite);
        Singleton.getInstance().setEFormMedicalHistory(eFormDataMedicalHistory);
        Singleton.getInstance().setEFormInjurySymptoms(eFormDataInjurySymptoms);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                iInjuryPresenter.changeFragment(new RedisiteFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
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
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
            getView().setFocusableInTouchMode(true);
            getView().requestFocus();
            getView().setOnKeyListener(new View.OnKeyListener() {
                @Override
                public boolean onKey(View v, int keyCode, KeyEvent event) {
                    if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                        iInjuryPresenter.changeFragment(new RedisiteFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
    }

    @Override
    public void onLoadDOC(String doc) {
        txtDOC.setText(doc);
    }

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        if (hasFocus) {
            iInjuryPresenter.displayDatePickerDialog();
        }
    }
}
