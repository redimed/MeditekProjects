package com.redimed.telehealth.patient.tracking;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
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
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.api.RegisterApi;
import com.redimed.telehealth.patient.home.HomeFragment;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.network.RESTClient;
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
import cn.pedant.SweetAlert.SweetAlertDialog;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * A simple {@link Fragment} subclass.
 */
public class TrackingFragment extends Fragment implements ITrackingView {

    private int offset = 0;
    private Context context;
    private Handler handler;
    private List<Appointment> listAppt;
    private AdapterAppointment adapterAppointment;
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
    @Bind(R.id.layoutBack)
    LinearLayout layoutBack;
    @Bind(R.id.lblTitle)
    TextView lblTitle;
    @Bind(R.id.lblSubTitle)
    TextView lblSubTitle;

    public TrackingFragment() {}

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_list_appointment, container, false);
        context = v.getContext();
        ButterKnife.bind(this, v);

        iTrackingPresenter = new TrackingPresenter(context, this, getActivity());
        iTrackingPresenter.setProgressBarVisibility(View.VISIBLE);

        listAppt = new ArrayList<Appointment>();
        listAppt.addAll(iTrackingPresenter.getListAppointment(offset));

        loadDataAppt();
        SwipeRefresh();
        onLoadToolbar();

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

        adapterAppointment = new AdapterAppointment(context, listAppt, getActivity(), rvListAppointment);
        rvListAppointment.setAdapter(adapterAppointment);
        adapterAppointment.setOnLoadMoreListener(new EndlessRecyclerOnScrollListener() {
            @Override
            public void onLoadMore() {
                listAppt.add(null);
                adapterAppointment.notifyItemInserted(listAppt.size() - 1);

                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        listAppt.remove(listAppt.size() - 1);
                        adapterAppointment.notifyItemRemoved(listAppt.size());

                        int start = listAppt.size();
                        int end = start + 10;
                        Log.d(TAG, end + "");
                        for (int i = start + 1; i < end; i++) {
                            listAppt.addAll(iTrackingPresenter.getListAppointment(i));
                            adapterAppointment.notifyItemInserted(listAppt.size());
                        }
                        adapterAppointment.setLoaded();
                    }
                }, 2000);
            }
        });
        swipeInfo.setRefreshing(false);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);
    }

    public void onLoadToolbar() {
        //init toolbar
        AppCompatActivity appCompatActivity = (AppCompatActivity) getActivity();
        appCompatActivity.setSupportActionBar(toolBar);

        //Set text  and icon title appointment details
        lblTitle.setText(getResources().getString(R.string.list_appt_title));
        layoutBack.setOnClickListener(new View.OnClickListener() {
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
                FragmentTransaction ft = getFragmentManager().beginTransaction();
                ft.detach(TrackingFragment.this).attach(TrackingFragment.this).commit();
            }
        });

        swipeInfo.setColorSchemeResources(android.R.color.holo_blue_bright,
                android.R.color.holo_green_light,
                android.R.color.holo_orange_light,
                android.R.color.holo_red_light);
    }

//    @Override
    public void onLoadDataTracking() {
        lblNoData.setVisibility(View.GONE);
        iTrackingPresenter.setProgressBarVisibility(View.GONE);

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

        adapterAppointment = new AdapterAppointment(context, listAppt, getActivity(), rvListAppointment);
        rvListAppointment.setAdapter(adapterAppointment);
        adapterAppointment.setOnLoadMoreListener(new EndlessRecyclerOnScrollListener() {
            @Override
            public void onLoadMore() {
                listAppt.add(null);
                adapterAppointment.notifyItemInserted(listAppt.size() - 1);

                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        listAppt.remove(listAppt.size() - 1);
                        adapterAppointment.notifyItemRemoved(listAppt.size());

                        int start = listAppt.size();
                        int end = start + 10;

                        for (int i = start + 1; i < end ; i++){
                            listAppt.addAll(iTrackingPresenter.getListAppointment(i));
                            adapterAppointment.notifyItemInserted(listAppt.size());
                        }
                        adapterAppointment.setLoaded();
                    }
                }, 2000);
            }
        });
        swipeInfo.setRefreshing(false);
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
