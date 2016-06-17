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

import com.redimed.telehealth.patient.R;

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
    private List<String> medicals;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedMedicalHistory;
    private static final String TAG = "===MEDICAL_ADAPTER===";

    public MedicalHistoryAdapter(Context context) {
        this.context = context;
        selectedPositions = new ArrayList<>();
        selectedMedicalHistory = new ArrayList<>();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        medicals = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.medical_history_arrays)));
    }

    @Override
    public MedicalHistoryAdapter.MedicalHistoryViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_medical_history, parent, false);
        return new MedicalHistoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MedicalHistoryAdapter.MedicalHistoryViewHolder holder, int position) {
        holder.lblMedicalHistory.setText(medicals.get(position));
        holder.display(medicals.get(position), selectedPositions.contains(position));
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
        }

        private void selectedMedicalHistory(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedMedicalHistory.remove(medicals.get(position));
            } else {
                display(true);
                selectedPositions.add(position);
                selectedMedicalHistory.add(medicals.get(position));
            }
            Log.d(TAG, selectedMedicalHistory + "");
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
