package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.utlis.GridItemView;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class SymptomsAdapter extends BaseAdapter {

    private Context context;
    private List<String> symptoms;
    private FragmentActivity activity;
    private ArrayList<EFormData> eFormDatas;
    private static final String TAG = "=SYMPTOMS_ADAPTER=";

    protected MyApplication application;

    public List<Integer> selectedPositions;

    public SymptomsAdapter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.application = (MyApplication) context.getApplicationContext();

        selectedPositions = new ArrayList<>();
        eFormDatas = application.getSelectedSymptoms();
        symptoms = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.symptoms_arrays)));
    }

    @Override
    public int getCount() {
        return symptoms.size();
    }

    @Override
    public Object getItem(int position) {
        return symptoms.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        GridItemView symptomsAdapter = (convertView == null) ? new GridItemView(activity) : (GridItemView) convertView;
        if (eFormDatas.size() > 0 && eFormDatas.get(position).isChecked()) {
            selectedPositions.add(position);
            symptomsAdapter.display(symptoms.get(position), eFormDatas.get(position).isChecked());
        } else {
            symptomsAdapter.display(symptoms.get(position), selectedPositions.contains(position));
        }
        return symptomsAdapter;
    }
}
