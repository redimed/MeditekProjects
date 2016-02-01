package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.RecyclerView.ViewHolder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.appointment.AppointmentFragment;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Category;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.tracking.TrackingFragment;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 10/30/2015.
 */
public class AdapterAppointment extends RecyclerView.Adapter<ViewHolder> {

    private Context context;
    private int TYPE, lastPosition;
    private List<Category> categories;
    private IMainPresenter iMainPresenter;
    private List<Appointment> listAppointment;
    private static final int TYPE_CATEGORY = 0;
    private static final int TYPE_APPOINTMENT = 1;
    private static String firstName, lastName, TAG = "AdapterAppointment";

    public AdapterAppointment(Context context, int type, FragmentActivity fragmentActivity) {
        this.context = context;
        this.TYPE = type;

        //init variable
        categories = new ArrayList<Category>();
        listAppointment = new ArrayList<Appointment>();

        iMainPresenter = new MainPresenter(context, fragmentActivity);
    }

    public void swapDataCategory(List<Category> data) {
        categories.clear();
        categories.addAll(data);
        notifyDataSetChanged();
    }

    public void swapDataAppointment(List<Appointment> data) {
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
//                    ((MainActivity) v.getContext()).Display(getAdapterPosition());
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

    private void SubTracking(View v, int position) {
        Bundle bundle = new Bundle();
        bundle.putString("apptUID", listAppointment.get(position).getUID());
        Fragment fragment = new AppointmentFragment();
        fragment.setArguments(bundle);
        iMainPresenter.replaceFragment(fragment);
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
                for (Doctor doctor : doctors) {
                    firstName = doctor.getFirstName() == null ? "NONE" : doctor.getFirstName();
                    lastName = doctor.getLastName() == null ?  "" : doctor.getLastName();
                }
                int no = position + 1;
                String ref, refName = "NONE";
                if (no <= 9) {
                    ref = "Ref0" + no;
                } else {
                    ref = "Ref" + no;
                }
                appointmentViewHolder.lblNo.setText(ref);
                if (listAppointment.get(position).getTelehealthAppointment() != null){
                    refName = listAppointment.get(position).getTelehealthAppointment().getRefName();
                }
                appointmentViewHolder.lblDoctorRef.setText(refName);
                appointmentViewHolder.lblDoctorPre.setText(firstName + " " + lastName);

                Animation animation = AnimationUtils.loadAnimation(context,
                        (position > lastPosition) ? R.anim.up_from_bottom : R.anim.down_from_top);
                appointmentViewHolder.itemView.startAnimation(animation);
                lastPosition = position;
                break;
        }
    }
}
