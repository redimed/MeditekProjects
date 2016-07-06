package com.redimed.telehealth.patient.appointment_tabs;


import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.ViewPager;
import android.support.v7.widget.Toolbar;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.adapter.TabsPagerAdapter;
import com.redimed.telehealth.patient.appointment_tabs.presenter.ITabsAppointmentPresenter;
import com.redimed.telehealth.patient.appointment_tabs.presenter.TabsAppointmentPresenter;
import com.redimed.telehealth.patient.appointment_tabs.view.ITabsAppointmentView;
import com.redimed.telehealth.patient.tracking.TrackingFragment;
import com.redimed.telehealth.patient.widget.DialogConnection;
import com.redimed.telehealth.patient.widget.SlidingTabLayout;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;
import cn.pedant.SweetAlert.SweetAlertDialog;

/**
 * A simple {@link Fragment} subclass.
 */
public class TabsAppointmentFragment extends Fragment implements ITabsAppointmentView, SlidingTabLayout.TabColorizer {

    private Context context;
    private ITabsAppointmentPresenter iTabsAppointmentPresenter;
    private static final String TAG = "=====TAB_APPT=====";

    @Bind(R.id.pager)
    ViewPager viewPager;
    @Bind(R.id.pagerSliding)
    SlidingTabLayout pagerTabStrip;

    @Bind(R.id.toolBar)
    Toolbar toolbar;

    public TabsAppointmentFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_tabs_appointment, container, false);
        setHasOptionsMenu(true);
        ButterKnife.bind(this, v);
        this.context = v.getContext();

        iTabsAppointmentPresenter = new TabsAppointmentPresenter(context, getActivity(), this);
        iTabsAppointmentPresenter.initToolbar(toolbar);
        iTabsAppointmentPresenter.getAppointmentDetails(getArguments().getString("apptUID", ""));

        return v;
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
                iTabsAppointmentPresenter.changeFragment(new TrackingFragment());
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public int getIndicatorColor(int position) {
        return ContextCompat.getColor(context, R.color.lightFont);
    }

    //Handler back button
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
                        iTabsAppointmentPresenter.changeFragment(new TrackingFragment());
                        return true;
                    }
                    return false;
                }
            });
        }
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
    }

    @Override
    public void onLoadSuccess(ArrayList<String> listImage) {
        // Initialization
        final TabsPagerAdapter tabsPagerAdapter = new TabsPagerAdapter(getActivity().getSupportFragmentManager(), getArguments().getString("apptUID", ""), listImage);
        viewPager.setAdapter(tabsPagerAdapter);

        // Give the SlidingTabLayout the ViewPager, this must be done AFTER the ViewPager has had it's PagerAdapter set.
        pagerTabStrip.setDistributeEvenly(true);
        pagerTabStrip.setViewPager(viewPager);
        pagerTabStrip.setCustomTabColorizer(this);
    }
}