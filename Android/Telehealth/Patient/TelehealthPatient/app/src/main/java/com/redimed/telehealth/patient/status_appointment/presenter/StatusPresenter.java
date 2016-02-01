package com.redimed.telehealth.patient.status_appointment.presenter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.status_appointment.view.IStatusView;

/**
 * Created by Fox on 1/20/2016.
 */
public class StatusPresenter implements IStatusPresenter {

    private Context context;
    private IStatusView iStatusView;
    private IMainPresenter iMainPresenter;

    public StatusPresenter(Context context, IStatusView iStatusView, FragmentActivity activity) {
        this.iStatusView = iStatusView;
        this.context = context;

        iStatusView.onLoadToolbar();
        iMainPresenter = new MainPresenter(context, activity);
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null){
            iMainPresenter.replaceFragment(fragment);
        }
    }
}
