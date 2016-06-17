package com.redimed.telehealth.patient.redisite.injury;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
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
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.SeekBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.BodyPartsAdapter;
import com.redimed.telehealth.patient.adapter.InjuryAdapter;
import com.redimed.telehealth.patient.adapter.InjurySymptomsAdapter;
import com.redimed.telehealth.patient.adapter.MedicalHistoryAdapter;
import com.redimed.telehealth.patient.redisite.consent.ConsentFragment;
import com.redimed.telehealth.patient.redisite.injury.presenter.IInjuryPresenter;
import com.redimed.telehealth.patient.redisite.injury.presenter.InjuryPresenter;
import com.redimed.telehealth.patient.redisite.injury.view.IInjuryView;
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
public class InjuryFragment extends Fragment implements IInjuryView, RadioGroup.OnCheckedChangeListener, View.OnClickListener {

    private Context context;
    private ArrayList<String> selectedBodies;
    private IInjuryPresenter iInjuryPresenter;
    private static final String TAG = "=====INJURY=====";

    @Bind(R.id.rvInjury)
    RecyclerView rvInjury;
    @Bind(R.id.toggleSymptoms)
    RadioGroup toggleSymptoms;
    @Bind(R.id.noSymptoms)
    RadioButton noSymptoms;
    @Bind(R.id.yesSymptoms)
    RadioButton yesSymptoms;
    @Bind(R.id.gridBodyParts)
    GridView gridBodyParts;
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
    @Bind(R.id.rvInjurySymptoms)
    RecyclerView rvInjurySymptoms;
    @Bind(R.id.seekBarPain)
    SeekBar seekBarPain;
    @Bind(R.id.lblPain)
    TextView lblPain;
    @Bind(R.id.btnInjury)
    Button btnInjury;

    public InjuryFragment() {
        // Required empty public constructor
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
        iInjuryPresenter = new InjuryPresenter(context, this, getActivity());

        this.getListInjury();
        this.getBodyParts();
        this.getListMedicalHistory();
        this.getListInjurySymptoms();

        toggleSymptoms.setOnCheckedChangeListener(this);
        toggleAllergies.setOnCheckedChangeListener(this);
        toggleMedications.setOnCheckedChangeListener(this);

        seekBarPain.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            int progress = 0;
            @Override
            public void onProgressChanged(SeekBar seekBar, int progressValue, boolean fromUser) {
                progress = progressValue;
                lblPain.setText(String.valueOf(progressValue));
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                Log.d(TAG, progress + "");
            }
        });

        btnInjury.setOnClickListener(this);

        return v;
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
                iInjuryPresenter.changeFragment(new SettingFragment());
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
                    selectedBodies.remove((String) parent.getItemAtPosition(position));
                } else {
                    ((GridItemView) v).display(true);
                    adapter.selectedPositions.add(position);
                    selectedBodies.add((String) parent.getItemAtPosition(position));
                }
            }
        });
        //Disable scrollbar
//        gridBodyParts.setOnTouchListener(new View.OnTouchListener() {
//            @Override
//            public boolean onTouch(View v, MotionEvent event) {
//                if (event.getAction() == MotionEvent.ACTION_MOVE) {
//                    return true;
//                }
//                return false;
//            }
//        });
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
            case R.id.btnInjury:
                iInjuryPresenter.changeFragment(new ConsentFragment());
                break;
        }
    }
}
