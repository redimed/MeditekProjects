package com.redimed.telehealth.patient.redisite.injury.presenter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.redisite.injury.view.IInjuryView;

/**
 * Created by MeditekMini on 6/13/16.
 */
public class InjuryPresenter implements IInjuryPresenter {

    private Context context;
    private IInjuryView iInjuryView;
    private FragmentActivity activity;

    private MyApplication application;

    public InjuryPresenter(Context context, IInjuryView iInjuryView, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iInjuryView = iInjuryView;
        this.application = (MyApplication) context.getApplicationContext();
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
    }


}
