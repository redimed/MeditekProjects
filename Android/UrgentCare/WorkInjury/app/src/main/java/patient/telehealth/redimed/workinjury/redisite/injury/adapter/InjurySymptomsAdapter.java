package patient.telehealth.redimed.workinjury.redisite.injury.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.R;
import patient.telehealth.redimed.workinjury.model.EFormData;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;

/**
 * Created by MeditekMini on 6/14/16.
 */
public class InjurySymptomsAdapter extends RecyclerView.Adapter<InjurySymptomsAdapter.InjurySymptomsViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedInjurySymptoms;
    private List<String> injurySymptoms, names, refs, refRows;
    private List<TempDataBean> injurySymptomData;
    private static final String TAG = "INJURY_SYMPTOMS_ADAPTER";

    protected MyApplication application;

    public InjurySymptomsAdapter(Context context) {
        this.context = context;
        this.application = (MyApplication) context.getApplicationContext();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        selectedPositions = new ArrayList<>();
        selectedInjurySymptoms = new ArrayList<>();
        injurySymptomData = new ArrayList<>();

        refs = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_symptoms_arrays)));
        names = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_symptoms_name_arrays)));
        injurySymptoms = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_symptoms_arrays)));
        refRows = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_symptoms_refRow_arrays)));
    }

    @Override
    public InjurySymptomsAdapter.InjurySymptomsViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_injury, parent, false);
        return new InjurySymptomsViewHolder(view);
    }

    @Override
    public void onBindViewHolder(InjurySymptomsAdapter.InjurySymptomsViewHolder holder, int position) {
        holder.lblInjury.setHint(injurySymptoms.get(position));
        holder.lblInjury.setText(injurySymptoms.get(position));
        holder.display(injurySymptoms.get(position), selectedPositions.contains(position));
        injurySymptomData.add(application.EformCheckbox(names.get(position), refRows.get(position), "yes", "false", refs.get(position)));

        if (application.getInjurySymptoms().size() > 0 && application.getInjurySymptoms().get(position).getChecked().equalsIgnoreCase("true")) {
            holder.selectedListInjurySymptoms(position);
        }

        if (names.size() - 1 == position){
            application.setInjurySymptoms(injurySymptomData);
        }
    }

    @Override
    public int getItemCount() {
        return injurySymptoms.size();
    }

    public class InjurySymptomsViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.lblInjury) TextView lblInjury;

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
                injurySymptomData.get(position).setChecked("false");
            } else {
                display(true);
                selectedPositions.add(position);
                selectedInjurySymptoms.add(injurySymptoms.get(position));
                injurySymptomData.get(position).setChecked("true");
            }
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
