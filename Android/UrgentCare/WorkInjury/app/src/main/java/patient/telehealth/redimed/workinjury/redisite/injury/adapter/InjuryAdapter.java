package patient.telehealth.redimed.workinjury.redisite.injury.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
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
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;

/**
 * Created by MeditekMini on 6/13/16.
 */
public class InjuryAdapter extends RecyclerView.Adapter<InjuryAdapter.InjuryViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedInjury;
    private List<String> injuries, names, refs, refRows;
    private List<TempDataBean> injuryData;
    private static final String TAG = "===INJURY_ADAPTER===";

    protected MyApplication application;

    public InjuryAdapter(Context context) {
        this.context = context;
        this.application = (MyApplication) context.getApplicationContext();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        injuryData = new ArrayList<>();
        selectedInjury = new ArrayList<>();
        selectedPositions = new ArrayList<>();

        //init data Eform Services
        refs = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_ref_arrays)));
        injuries = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_arrays)));
        names = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_name_arrays)));
        refRows = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.injury_refRow_arrays)));
    }

    @Override
    public InjuryAdapter.InjuryViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_injury, parent, false);
        return new InjuryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(InjuryAdapter.InjuryViewHolder holder, int position) {
        holder.lblInjury.setHint(names.get(position));
        holder.lblInjury.setText(injuries.get(position));
        holder.display(injuries.get(position), selectedPositions.contains(position));
        injuryData.add(application.EformCheckbox(names.get(position), refRows.get(position), "yes", "false", refs.get(position)));

        if (application.getInjuryData().size() > 0 && application.getInjuryData().get(position).getChecked().equalsIgnoreCase("true")) {
            holder.selectedListInjury(position);
        }
        if (names.size() - 1 == position){
            application.setInjuryData(injuryData);
        }
    }

    @Override
    public int getItemCount() {
        return injuries.size();
    }

    public class InjuryViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.lblInjury)
        TextView lblInjury;

        public InjuryViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedListInjury(getAdapterPosition());
                }
            });
        }

        private void selectedListInjury(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedInjury.remove(injuries.get(position));
                injuryData.get(position).setChecked("false");
            } else {
                display(true);
                selectedPositions.add(position);
                selectedInjury.add(injuries.get(position));
                injuryData.get(position).setChecked("true");
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
