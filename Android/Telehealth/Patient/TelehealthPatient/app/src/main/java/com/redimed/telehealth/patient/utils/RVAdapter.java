package com.redimed.telehealth.patient.utils;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
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
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Category;

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
    private static String appointmentUID, firstName, lastName, dateTime, status;
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

        @Bind(R.id.lblTime)
        TextView lblDate;
        @Bind(R.id.lblDoctor)
        TextView lblDoctor;
        @Bind(R.id.lblStatus)
        TextView lblStatus;

        public AppointmentViewHolder(View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Fragment fragment = new AppointmentDetails();
                    Bundle bundle = new Bundle();
                    bundle.putString("apptUID", appointmentUID);
                    fragment.setArguments(bundle);
                    FragmentManager fragmentManager = fragmentActivity.getSupportFragmentManager();
                    fragmentManager.beginTransaction().replace(R.id.frame_container, fragment).commit();
                }
            });
        }

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
                appointmentUID = listAppointment.get(position).getUID();
                dateTime = listAppointment.get(position).getFromTime();
                status = listAppointment.get(position).getStatus();
                firstName = listAppointment.get(position).getDoctor()[0].getFirstName() == null
                        ? " " : listAppointment.get(position).getDoctor()[0].getFirstName();
                lastName = listAppointment.get(position).getDoctor()[0].getLastName() == null
                        ? " " : listAppointment.get(position).getDoctor()[0].getLastName();

                appointmentViewHolder.lblDoctor.setText(firstName + lastName);
                appointmentViewHolder.lblDate.setText(MyApplication.getInstance().ConvertDateTime(dateTime));
                appointmentViewHolder.lblStatus.setText(status);
                break;
        }
    }
}
