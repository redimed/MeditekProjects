package com.redimed.telehealth.patient.redisite.illness;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.GridView;
import android.widget.RadioButton;
import android.widget.RadioGroup;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.MedicalHistoryAdapter;
import com.redimed.telehealth.patient.adapter.SymptomsAdapter;
import com.redimed.telehealth.patient.redisite.consent.ConsentFragment;
import com.redimed.telehealth.patient.redisite.illness.presenter.IIllnessPresenter;
import com.redimed.telehealth.patient.redisite.illness.presenter.IllnessPresenter;
import com.redimed.telehealth.patient.redisite.illness.view.IIllnessView;
import com.redimed.telehealth.patient.utlis.DeviceUtils;
import com.redimed.telehealth.patient.utlis.GridItemView;
import com.redimed.telehealth.patient.utlis.PreCachingLayoutManager;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class IllnessFragment extends Fragment implements IIllnessView, RadioGroup.OnCheckedChangeListener, View.OnClickListener {

    private Context context;
    private ArrayList<String> selectedSymptoms;
    private IIllnessPresenter iIllnessPresenter;
    private static final String TAG = "=====INJURY=====";

    @Bind(R.id.toggleSymptoms)
    RadioGroup toggleSymptoms;
    @Bind(R.id.noSymptoms)
    RadioButton noSymptoms;
    @Bind(R.id.yesSymptoms)
    RadioButton yesSymptoms;
    @Bind(R.id.gridSymptoms)
    GridView gridSymptoms;
    @Bind(R.id.rvMedicalHistory)
    RecyclerView rvMedicalHistory;
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

    @Bind(R.id.btnIllness)
    Button btnIllness;

    public IllnessFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        View v = inflater.inflate(R.layout.fragment_illness, container, false);
        this.context = v.getContext();
        ButterKnife.bind(this, v);

        selectedSymptoms = new ArrayList<>();
        iIllnessPresenter = new IllnessPresenter(context, getActivity(), this);

        this.getListMedicalHistory();
        this.getSymptoms();

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
                    selectedSymptoms.remove((String) parent.getItemAtPosition(position));
                } else {
                    ((GridItemView) v).display(true);
                    symptomsAdapter.selectedPositions.add(position);
                    selectedSymptoms.add((String) parent.getItemAtPosition(position));
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
                } else {
                    noSymptoms.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noSymptoms.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesSymptoms.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesSymptoms.setBackgroundResource(R.drawable.toggle_widget_background);
                }
                break;
            case R.id.toggleMedications:
                if (yesMedications.isChecked()) {
                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noMedications.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtMedications.setEnabled(true);
                } else {
                    noMedications.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noMedications.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesMedications.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesMedications.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtMedications.setEnabled(false);
                }
                break;
            case R.id.toggleAllergies:
                if (yesAllergies.isChecked()) {
                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    yesAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    noAllergies.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtAllergies.setEnabled(true);
                } else {
                    noAllergies.setTextColor(ContextCompat.getColor(context, R.color.lightFont));
                    noAllergies.setBackgroundColor(ContextCompat.getColor(context, R.color.colorPrimary));

                    yesAllergies.setTextColor(ContextCompat.getColor(context, R.color.darkFont));
                    yesAllergies.setBackgroundResource(R.drawable.toggle_widget_background);

                    txtAllergies.setEnabled(false);
                }
                break;
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnIllness:
                iIllnessPresenter.changeFragment(new ConsentFragment());
                break;
        }
    }
}
