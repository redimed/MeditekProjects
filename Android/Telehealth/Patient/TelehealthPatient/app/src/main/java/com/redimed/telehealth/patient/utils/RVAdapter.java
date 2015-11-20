package com.redimed.telehealth.patient.utils;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.RecyclerView.ViewHolder;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.LayoutInflater;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.fragment.AppointmentDetails;
import com.redimed.telehealth.patient.fragment.TrackingFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.models.Doctor;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 10/30/2015.
 */
public class RVAdapter extends RecyclerView.Adapter<ViewHolder> {

    private String TAG = "RVAdapter";
    private static final int TYPE_CATEGORY = 0;
    private static final int TYPE_APPOINTMENT = 1;
    private int TYPE;
    private Context context;
    private List<Category> categories;
    private List<Appointment> listAppointment;
    private static String firstName, lastName, dateTime, status;
    private FragmentActivity fragmentActivity;

    public RVAdapter(Context context, int type) {
        this.context = context;
        this.TYPE = type;
        categories = new ArrayList<Category>();
        listAppointment = new ArrayList<Appointment>();
    }

    public void swapDataCategory(List<Category> data) {
        categories.clear();
        categories.addAll(data);
        notifyDataSetChanged();
    }

    public void swapDataAppointment(List<Appointment> data, FragmentActivity fragmentActivity) {
        this.fragmentActivity = fragmentActivity;
        listAppointment.clear();
        listAppointment.addAll(data);
        notifyDataSetChanged();
    }

    public class CategoryViewHolder extends RecyclerView.ViewHolder {
        @Bind(R.id.imgTitle)
        ImageView imgTitle;
        @Bind(R.id.lblTitle)
        TextView lblTitle;
        @Bind(R.id.imgIcon)
        ImageView imgIcon;

        public CategoryViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ((MainActivity) v.getContext()).Display(getAdapterPosition());
                }
            });
        }
    }

    public class AppointmentViewHolder extends RecyclerView.ViewHolder {
        @Bind(R.id.lblNo)
        TextView lblNo;
        @Bind(R.id.lblDoctorRef)
        TextView lblDoctorRef;
        @Bind(R.id.lblDoctorPre)
        TextView lblDoctorPre;

        public AppointmentViewHolder(final View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                   SubTracking(itemView, getAdapterPosition());
                }
            });
        }
    }

    private void SubTracking(View v, int position){
        Fragment fragment = new TrackingFragment();
        Bundle bundle = new Bundle();
        bundle.putString("apptUID", listAppointment.get(position).getUID());
        bundle.putString("status", listAppointment.get(position).getStatus());
        bundle.putString("fromTime", listAppointment.get(position).getFromTime());
        fragment.setArguments(bundle);
        ((MainActivity) v.getContext()).PerformNoBackStackTransaction(fragment);
    }

    @Override
    public int getItemViewType(int position) {
        int viewType;
        if (TYPE == 0) {
            viewType = TYPE_CATEGORY;
        } else {
            viewType = TYPE_APPOINTMENT;
        }
        return viewType;
    }

    @Override
    public int getItemCount() {
        if (TYPE == 0) {
            return categories.size();
        } else {
            return listAppointment.size();
        }
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        switch (viewType) {
            case TYPE_CATEGORY:
                return new CategoryViewHolder(LayoutInflater.from(
                        parent.getContext()).inflate(R.layout.cardview_drawer_menu, parent, false));

            case TYPE_APPOINTMENT:
                return new AppointmentViewHolder(LayoutInflater.from(
                        parent.getContext()).inflate(R.layout.cardview_list_appointment, parent, false));
        }
        return null;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {
        switch (viewHolder.getItemViewType()) {
            case TYPE_CATEGORY:
                CategoryViewHolder categoryViewHolder = (CategoryViewHolder) viewHolder;
                categoryViewHolder.imgTitle.setImageResource(categories.get(position).getScrImg());
                categoryViewHolder.lblTitle.setText(categories.get(position).getTitle());
                categoryViewHolder.imgIcon.setImageResource(categories.get(position).getIcon());
                break;

            case TYPE_APPOINTMENT:
                AppointmentViewHolder appointmentViewHolder = (AppointmentViewHolder) viewHolder;
                Doctor[] doctors = listAppointment.get(position).getDoctor();

                dateTime = listAppointment.get(position).getFromTime();
                status = listAppointment.get(position).getStatus();
                for (int i = 0; i < doctors.length; i++) {
                    firstName = doctors[i].getFirstName() == null
                            ? " " : doctors[i].getFirstName();
                    lastName = doctors[i].getLastName() == null
                            ? " " : doctors[i].getLastName();
                    appointmentViewHolder.lblDoctorPre.setText(firstName + lastName);
                }
                appointmentViewHolder.lblNo.setText("Ref" + (position + 1));
                appointmentViewHolder.lblDoctorRef.setText(listAppointment.get(position).getTelehealthAppointment().getRefName());
                break;
        }
    }
}
