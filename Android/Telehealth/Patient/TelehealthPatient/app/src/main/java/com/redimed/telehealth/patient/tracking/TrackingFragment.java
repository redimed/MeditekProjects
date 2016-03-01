package com.redimed.telehealth.patient.tracking;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.tracking.presenter.ITrackingPresenter;
import com.redimed.telehealth.patient.tracking.presenter.TrackingPresenter;
import com.redimed.telehealth.patient.tracking.view.ITrackingView;
import com.redimed.telehealth.patient.utlis.DialogAlert;
import com.redimed.telehealth.patient.utlis.DialogConnection;
import com.redimed.telehealth.patient.utlis.AdapterAppointment;
import com.redimed.telehealth.patient.utlis.EndlessRecyclerOnScrollListener;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements ITrackingView {

    private int offset = 0;
    private Context context;
    protected Handler handler;
    private String TAG = "TRACKING";
    private List<Appointment> data;
    private ITrackingPresenter iTrackingPresenter;
    private AdapterAppointment adapterAppointment;
    private LinearLayoutManager linearLayoutManager;

    @Bind(R.id.swipeInfo)
    SwipeRefreshLayout swipeInfo;
    @Bind(R.id.rvListAppointment)
    RecyclerView rvListAppointment;
    @Bind(R.id.lblNoData)
    TextView lblNoData;
    @Bind(R.id.progressBar)
    ProgressBar progressBar;

    /* Toolbar */
    @Bind(R.id.toolBar)
    Toolbar toolBar;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.btnBack)
    Button btnBack;

    public TrackingFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);
        getListAppointment();
        SwipeRefresh();
        return v;
    }

    private void getListAppointment() {
        handler = new Handler();
        data = new ArrayList<Appointment>();
        iTrackingPresenter = new TrackingPresenter(context, this, getActivity());
        iTrackingPresenter.setProgressBarVisibility(View.VISIBLE);
        iTrackingPresenter.getListAppointment(offset);
    }

    @Override
    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.list_appt_title));
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                iTrackingPresenter.changeFragment(new HomeFragment());
            }
        });
    }

    @Override
    public void onSetProgressBarVisibility(int visibility) {
        progressBar.setVisibility(visibility);
    }

    //Refresh information patient
    private void SwipeRefresh() {
        swipeInfo.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                iTrackingPresenter.getListAppointment(offset);
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

    @Override
    public void onLoadDataTracking(final List<Appointment> data){
        lblNoData.setVisibility(View.GONE);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);

        linearLayoutManager = new LinearLayoutManager(context);

        adapterAppointment  = new AdapterAppointment(context, data, getActivity(), rvListAppointment);
        adapterAppointment.setOnLoadMoreListener(new EndlessRecyclerOnScrollListener() {
            @Override
            public void onLoadMore() {
                //add null , so the adapter will check view_type and show progress bar at bottom
                data.add(null);
                adapterAppointment.notifyItemInserted(data.size() - 1);

                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        //  remove progress item
                        data.remove(data.size() - 1);
                        adapterAppointment.notifyItemRemoved(data.size());

                        //  add items one by one
                        int start = data.size();
                        int end = start + 1;

                        Log.d(TAG, end + "");

                        adapterAppointment.notifyItemInserted(data.size());
                        adapterAppointment.setLoaded();
                    }
                }, 2000);
            }
        });

        rvListAppointment.setHasFixedSize(true);
        rvListAppointment.setLayoutManager(linearLayoutManager);
        rvListAppointment.setAdapter(adapterAppointment);
        rvListAppointment.setOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
            }

            @Override
            public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                swipeInfo.setEnabled(linearLayoutManager.findFirstCompletelyVisibleItemPosition() == 0);
            }
        });
        swipeInfo.setRefreshing(false);
    }


    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new DialogAlert(context, DialogAlert.State.Warning, getResources().getString(R.string.token_expired)).show();
        } else {
            lblNoData.setVisibility(View.VISIBLE);
            iTrackingPresenter.setProgressBarVisibility(View.GONE);
            new DialogAlert(context, DialogAlert.State.Error, msg).show();
        }
        swipeInfo.setRefreshing(false);
    }

    @Override
    public void onResume() {
        super.onResume();
        getView().setFocusableInTouchMode(true);
        getView().requestFocus();
        getView().setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_BACK) {
                    iTrackingPresenter.changeFragment(new HomeFragment());
                    return true;
                }
                return false;
            }
        });
    }
}
