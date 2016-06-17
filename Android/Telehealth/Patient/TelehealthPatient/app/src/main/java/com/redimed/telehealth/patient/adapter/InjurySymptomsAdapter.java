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
public class InjurySymptomsAdapter extends RecyclerView.Adapter<InjurySymptomsAdapter.InjurySymptomsViewHolder> {

    private Context context;
    private List<String> injurySymptoms;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedInjurySymptoms;
    private static final String TAG = "INJURY_SYMPTOMS_ADAPTER";

    public InjurySymptomsAdapter(Context context) {
        this.context = context;
        selectedPositions = new ArrayList<>();
        selectedInjurySymptoms = new ArrayList<>();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        injurySymptoms = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_symptoms_arrays)));
    }

    @Override
    public InjurySymptomsAdapter.InjurySymptomsViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_injury, parent, false);
        return new InjurySymptomsViewHolder(view);
    }

    @Override
    public void onBindViewHolder(InjurySymptomsAdapter.InjurySymptomsViewHolder holder, int position) {
        holder.lblInjury.setText(injurySymptoms.get(position));
        holder.display(injurySymptoms.get(position), selectedPositions.contains(position));
    }

    @Override
    public int getItemCount() {
        return injurySymptoms.size();
    }

    public class InjurySymptomsViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.lblInjury)
        TextView lblInjury;

        public InjurySymptomsViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setEnabled(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedListInjurySymptoms(getAdapterPosition());
                }
            });
        }

        private void selectedListInjurySymptoms(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedInjurySymptoms.remove(injurySymptoms.get(position));
            } else {
                display(true);
                selectedPositions.add(position);
                selectedInjurySymptoms.add(injurySymptoms.get(position));
            }
            Log.d(TAG, selectedInjurySymptoms + "");
        }

        private void display(String text, boolean isSelected) {
            display(isSelected);
            lblInjury.setText(text);
        }

        public void display(boolean isSelected) {
            lblInjury.setBackgroundResource(isSelected ? R.color.colorPrimary : 0);
            lblInjury.setTextColor(ContextCompat.getColor(context, isSelected ? R.color.lightFont : R.color.greyFont));
        }
    }
}
