package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
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
 * Created by MeditekMini on 6/13/16.
 */
public class BodyPartsAdapter extends BaseAdapter {

    private Context context;
    private List<String> bodyParts;
    private FragmentActivity activity;
    private ArrayList<EFormData> eFormDatas;
    private static final String TAG = "=BODY_ADAPTER=";

    public List<Integer> selectedPositions;

    protected MyApplication application;

    public BodyPartsAdapter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.application = (MyApplication) context.getApplicationContext();

        selectedPositions = new ArrayList<>();
        eFormDatas = application.getSelectedBodyParts();
        bodyParts = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.body_parts_arrays)));
    }

    @Override
    public int getCount() {
        return bodyParts.size();
    }

    @Override
    public Object getItem(int position) {
        return bodyParts.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        GridItemView bodyPartsAdapter = (convertView == null) ? new GridItemView(activity) : (GridItemView) convertView;
        if (eFormDatas.size() > 0 && eFormDatas.get(position).isChecked()) {
            selectedPositions.add(position);
            bodyPartsAdapter.display(bodyParts.get(position), eFormDatas.get(position).isChecked());
        } else {
            bodyPartsAdapter.display(bodyParts.get(position), selectedPositions.contains(position));
        }
        return bodyPartsAdapter;
    }
}
