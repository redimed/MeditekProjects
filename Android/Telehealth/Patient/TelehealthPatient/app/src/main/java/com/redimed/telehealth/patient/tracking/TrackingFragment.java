package com.redimed.telehealth.patient.tracking;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.tracking.presenter.ITrackingPresenter;
import com.redimed.telehealth.patient.tracking.presenter.TrackingPresenter;
import com.redimed.telehealth.patient.tracking.view.ITrackingView;
import com.redimed.telehealth.patient.widget.DialogConnection;
import com.redimed.telehealth.patient.adapter.AppointmentAdapter;
import com.redimed.telehealth.patient.utlis.EndlessRecyclerOnScrollListener;

import java.util.ArrayList;
import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements ITrackingView {

    private int offset = 0;
    private Context context;
    private Handler handler;
    private List<Appointment> listAppt;
    private AppointmentAdapter appointmentAdapter;
    private ITrackingPresenter iTrackingPresenter;
    private LinearLayoutManager linearLayoutManager;
    private static final String TAG = "=====TRACKING=====";

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

    public TrackingFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        setHasOptionsMenu(true);
        context = v.getContext();
        ButterKnife.bind(this, v);

        iTrackingPresenter = new TrackingPresenter(context, this, getActivity());
        iTrackingPresenter.initToolbar(toolBar);
        iTrackingPresenter.setProgressBarVisibility(View.VISIBLE);

        listAppt = new ArrayList<>();
        listAppt.addAll(iTrackingPresenter.getListAppointment(offset));

        loadDataAppt();
        SwipeRefresh();

        return v;
    }

    private void loadDataAppt() {
        handler = new Handler();
        linearLayoutManager = new LinearLayoutManager(context);

        rvListAppointment.setHasFixedSize(true);
        rvListAppointment.setLayoutManager(linearLayoutManager);
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

        appointmentAdapter = new AppointmentAdapter(context, listAppt, getActivity(), rvListAppointment);
        rvListAppointment.setAdapter(appointmentAdapter);
        appointmentAdapter.setOnLoadMoreListener(new EndlessRecyclerOnScrollListener() {
            @Override
            public void onLoadMore() {
                listAppt.add(null);
                appointmentAdapter.notifyItemInserted(listAppt.size() - 1);

                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        listAppt.remove(listAppt.size() - 1);
                        appointmentAdapter.notifyItemRemoved(listAppt.size());

                        int start = listAppt.size();
                        int end = start + 10;
                        Log.d(TAG, end + "");
                        for (int i = start + 1; i < end; i++) {
                            listAppt.addAll(iTrackingPresenter.getListAppointment(i));
                            appointmentAdapter.notifyItemInserted(listAppt.size());
                        }
                        appointmentAdapter.setLoaded();
                    }
                }, 2000);
            }
        });
        swipeInfo.setRefreshing(false);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        /* Handle action bar item clicks here. The action bar will automatically handle clicks on the Home/Up button,
            so long as you specify a parent activity in AndroidManifest.xml.
        */
        switch (item.getItemId()) {
            case android.R.id.home:
                iTrackingPresenter.changeFragment(new HomeFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
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
                FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.detach(TrackingFragment.this).attach(TrackingFragment.this).commit();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

    @Override
    public void onLoadError(String msg) {
        if (msg.equalsIgnoreCase("Network Error")) {
            new DialogConnection(context).show();
        } else if (msg.equalsIgnoreCase("TokenExpiredError")) {
            new SweetAlertDialog(context, SweetAlertDialog.WARNING_TYPE)
                    .setContentText(getResources().getString(R.string.token_expired))
                    .show();
        } else {
            new SweetAlertDialog(context, SweetAlertDialog.ERROR_TYPE)
                    .setContentText(msg)
                    .show();
        }
        swipeInfo.setRefreshing(false);
        lblNoData.setVisibility(View.VISIBLE);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);
    }

    @Override
    public void onResume() {
        super.onResume();
        if (getView() != null) {
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
}
