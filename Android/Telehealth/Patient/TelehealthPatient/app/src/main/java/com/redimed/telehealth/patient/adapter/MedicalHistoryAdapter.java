package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.models.EFormData;
import com.redimed.telehealth.patient.models.Singleton;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by MeditekMini on 6/14/16.
 */
public class MedicalHistoryAdapter extends RecyclerView.Adapter<MedicalHistoryAdapter.MedicalHistoryViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedMedicalHistory;
    private List<String> medicals, names, refs, refRows;
    private ArrayList<EFormData> eFormDatas, eFormDataHistory;
    private static final String TAG = "===MEDICAL_ADAPTER===";

    protected MyApplication application;

    public MedicalHistoryAdapter(Context context) {
        this.context = context;
        this.application = (MyApplication) context.getApplicationContext();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        eFormDatas = new ArrayList<>();
        selectedPositions = new ArrayList<>();
        selectedMedicalHistory = new ArrayList<>();
        eFormDataHistory = application.getSelectedMedicalHistory();

        // init data Eform Medical History
        medicals = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.medical_history_arrays)));
        refs = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.medical_history_ref_arrays)));
        names = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.medical_history_name_arrays)));
        refRows = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.medical_history_refRow_arrays)));
    }

    @Override
    public MedicalHistoryAdapter.MedicalHistoryViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_medical_history, parent, false);
        return new MedicalHistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MedicalHistoryAdapter.MedicalHistoryViewHolder holder, int position) {
        holder.lblMedicalHistory.setHint(names.get(position));
        holder.lblMedicalHistory.setText(medicals.get(position));
        holder.display(medicals.get(position), selectedPositions.contains(position));

        eFormDatas.add(new EFormData("yes", names.get(position), refs.get(position), "eform_input_check_checkbox", false, refRows.get(position), 0));
        if (eFormDataHistory.size() > 0 && eFormDataHistory.get(position).isChecked()) {
            holder.selectedMedicalHistory(position);
        }
    }

    @Override
    public int getItemCount() {
        return medicals.size();
    }

    public class MedicalHistoryViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.layoutMedicalHistory)
        LinearLayout layoutMedicalHistory;
        @Bind(R.id.lblMedicalHistory)
        TextView lblMedicalHistory;

        public MedicalHistoryViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedMedicalHistory(getAdapterPosition());
                }
            });
            Singleton.getInstance().setEFormMedicalHistory(eFormDatas);
        }

        private void selectedMedicalHistory(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedMedicalHistory.remove(medicals.get(position));
                eFormDatas.get(position).setChecked(false);
            } else {
                display(true);
                selectedPositions.add(position);
                selectedMedicalHistory.add(medicals.get(position));
                eFormDatas.get(position).setChecked(true);
            }
            Singleton.getInstance().setEFormMedicalHistory(eFormDatas);
        }

        private void display(String text, boolean isSelected) {
            display(isSelected);
            lblMedicalHistory.setText(text);
        }

        public void display(boolean isSelected) {
            layoutMedicalHistory.setBackgroundResource(isSelected ? R.color.colorPrimary : 0);
            lblMedicalHistory.setTextColor(ContextCompat.getColor(context, isSelected ? R.color.lightFont : R.color.greyFont));
        }
    }
}
