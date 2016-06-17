package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;

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
    private List<String> services;
    private LayoutInflater inflater;
    private List<Integer> selectedPositions;
    private ArrayList<String> selectedService;
    private static final String TAG = "===SErVICE_ADAPTER===";

    public ServicesAdapter(Context context) {
        this.context = context;
        selectedService = new ArrayList<>();
        selectedPositions = new ArrayList<>();
        inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        services = new ArrayList<>(Arrays.asList(context.getResources().getStringArray(R.array.service_required_arrays)));
    }

    @Override
    public ServiceViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = inflater.inflate(R.layout.cardview_item_service_redisite, parent, false);
        return new ServiceViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ServiceViewHolder holder, final int position) {
        holder.txtServiceRedisite.setText(services.get(position));
        holder.display(services.get(position), selectedPositions.contains(position));
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

        public ServiceViewHolder(final View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectedListService(getAdapterPosition());
                }
            });
        }

        private void selectedListService(int position) {
            int selectedIndex = selectedPositions.indexOf(position);
            if (selectedIndex > -1) {
                display(false);
                selectedPositions.remove(selectedIndex);
                selectedService.remove(services.get(position));
            } else {
                display(true);
                selectedPositions.add(position);
                selectedService.add(services.get(position));
            }
            Log.d(TAG, selectedService + "");
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
