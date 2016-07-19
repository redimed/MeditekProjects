package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
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
 * Created by MeditekMini on 6/7/16.
 */
public class ServicesAdapter extends RecyclerView.Adapter<ServicesAdapter.ServiceViewHolder> {

    private Context context;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private List<String> services, names, refs, refRows;
    private ArrayList<EFormData> eFormDatas, eFormDataServices;
    private static final String TAG = "===SERVICE_ADAPTER===";

    protected MyApplication application;

    public ServicesAdapter(Context context) {
        this.context = context;
        this.application = (MyApplication) context.getApplicationContext();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        eFormDatas = new ArrayList<>();
        selectedPositions = new ArrayList<>();
        eFormDataServices = application.getSelectedServices();

        //init data Eform Services
        refs = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.service_required_ref_arrays)));
        services = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.service_required_arrays)));
        names = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.service_required_name_arrays)));
        refRows = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.service_required_refRow_arrays)));
    }

    @Override
    public ServiceViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_service_redisite, parent, false);
        return new ServiceViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ServiceViewHolder holder, final int position) {
        holder.txtServiceRedisite.setHint(names.get(position));
        holder.txtServiceRedisite.setText(services.get(position));
        holder.display(services.get(position), selectedPositions.contains(position));
        eFormDatas.add(new EFormData("yes", names.get(position), refs.get(position), "eform_input_check_checkbox", false, refRows.get(position), 0));

        if (eFormDataServices.size() > 0 && eFormDataServices.get(position).isChecked()) {
            holder.selectedListService(position);
        }
    }

    @Override
    public int getItemCount() {
        return services.size();
    }

    public class ServiceViewHolder extends RecyclerView.ViewHolder {

        @Bind(R.id.layoutServiceRedisite)
        LinearLayout layoutServiceRedisite;
        @Bind(R.id.cbServiceRedisite)
        ImageView cbServiceRedisite;
        @Bind(R.id.txtServiceRedisite)
        TextView txtServiceRedisite;

        protected ArrayList<String> selectedService;

        public ServiceViewHolder(final View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);

            selectedService = new ArrayList<>();
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedListService(getAdapterPosition());
                }
            });
            Singleton.getInstance().setEFormDatas(eFormDatas);
        }

        public void selectedListService(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedService.remove(services.get(position));
                eFormDatas.get(position).setChecked(false);
            } else {
                display(true);
                selectedPositions.add(position);
                selectedService.add(services.get(position));
                eFormDatas.get(position).setChecked(true);
            }
            Singleton.getInstance().setEFormDatas(eFormDatas);
        }

        private void display(String text, boolean isSelected) {
            display(isSelected);
            txtServiceRedisite.setText(text);
        }

        public void display(boolean isSelected) {
            layoutServiceRedisite.setBackgroundResource(isSelected ? R.drawable.custom_border_bg_green : 0);
            cbServiceRedisite.setBackgroundResource(isSelected ? R.drawable.icon_checked : R.drawable.icon_checkbox_unselected);
            txtServiceRedisite.setTextColor(ContextCompat.getColor(context, isSelected ? R.color.lightFont : R.color.greyFont));
        }
    }
}
