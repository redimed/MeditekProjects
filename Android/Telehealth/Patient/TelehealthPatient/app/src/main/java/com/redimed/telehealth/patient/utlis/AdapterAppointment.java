package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.RecyclerView.ViewHolder;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.ProgressBar;
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

    private boolean loading;
    private final int VIEW_ITEM = 1;
    private final int VIEW_PROG = 0;
    private int visibleThreshold = 5;
    private int lastVisibleItem, totalItemCount;
    private EndlessRecyclerOnScrollListener onLoadMoreListener;

    private Context context;
    private int lastPosition;
    private IMainPresenter iMainPresenter;
    private List<Appointment> listAppointment;
    private static String firstName, lastName, TAG = "AdapterAppointment";

    public AdapterAppointment(Context context, List<Appointment> data, FragmentActivity fragmentActivity, RecyclerView recyclerView) {
        this.context = context;
        this.listAppointment = data;

        iMainPresenter = new MainPresenter(context, fragmentActivity);

        if (recyclerView.getLayoutManager() instanceof LinearLayoutManager) {
            final LinearLayoutManager linearLayoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
            recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                @Override
                public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                    super.onScrolled(recyclerView, dx, dy);

                    totalItemCount = linearLayoutManager.getItemCount();
                    lastVisibleItem = linearLayoutManager.findLastVisibleItemPosition();
                    if (!loading && totalItemCount <= (lastVisibleItem + visibleThreshold)) {
                        // End has been reached
                        // Do something
                        if (onLoadMoreListener != null) {
                            onLoadMoreListener.onLoadMore();
                        }
                        loading = true;
                    }
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

    public static class ProgressViewHolder extends RecyclerView.ViewHolder {
        @Bind(R.id.progressBar)
        ProgressBar progressBar;

        public ProgressViewHolder(View v) {
            super(v);
            ButterKnife.bind(this, v);
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
        return listAppointment.get(position) != null ? VIEW_ITEM : VIEW_PROG;
    }

    @Override
    public int getItemCount() {
        return listAppointment.size();
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        RecyclerView.ViewHolder vh;
        if (viewType == VIEW_ITEM) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_list_appointment, parent, false);
            vh = new AppointmentViewHolder(v);
        } else {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.progress_item, parent, false);
            vh = new ProgressViewHolder(v);
        }
        return vh;
    }

    public void setLoaded() {
        loading = false;
    }

    public void setOnLoadMoreListener(EndlessRecyclerOnScrollListener onLoadMoreListener) {
        this.onLoadMoreListener = onLoadMoreListener;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {
        if (viewHolder instanceof AppointmentViewHolder) {
            AppointmentViewHolder appointmentViewHolder = (AppointmentViewHolder) viewHolder;
            Doctor[] doctors = listAppointment.get(position).getDoctor();
            for (Doctor doctor : doctors) {
                firstName = doctor.getFirstName() == null ? "NONE" : doctor.getFirstName();
                lastName = doctor.getLastName() == null ? "" : doctor.getLastName();
            }
            int no = position + 1;
            String ref, refName = "NONE";
            if (no <= 9) {
                ref = "Ref0" + no;
            } else {
                ref = "Ref" + no;
            }
            appointmentViewHolder.lblNo.setText(ref);
            if (listAppointment.get(position).getTelehealthAppointment() != null) {
                refName = listAppointment.get(position).getTelehealthAppointment().getRefName();
            }
            appointmentViewHolder.lblDoctorRef.setText(refName);
            appointmentViewHolder.lblDoctorPre.setText(firstName + " " + lastName);

            Animation animation = AnimationUtils.loadAnimation(context,
                    (position > lastPosition) ? R.anim.up_from_bottom : R.anim.down_from_top);
            appointmentViewHolder.itemView.startAnimation(animation);
            lastPosition = position;
        } else {
            ((ProgressViewHolder) viewHolder).progressBar.setIndeterminate(true);
        }
    }
}
