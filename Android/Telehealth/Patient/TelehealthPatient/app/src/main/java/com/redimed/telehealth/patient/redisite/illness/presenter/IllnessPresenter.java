package com.redimed.telehealth.patient.redisite.illness.presenter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.redisite.illness.view.IIllnessView;

/**
 * Created by MeditekMini on 6/15/16.
 */
public class IllnessPresenter implements IIllnessPresenter {

    private Context context;
    private FragmentActivity activity;
    private IIllnessView iIllnessView;
    private static final String TAG = "===ILLNESS_PRESENTER===";

    protected MyApplication application;

    public IllnessPresenter(Context context, FragmentActivity activity, IIllnessView iIllnessView) {
        this.context = context;
        this.activity = activity;
        this.iIllnessView = iIllnessView;
        this.application = (MyApplication) context.getApplicationContext();

        application.setCurrentActivity(activity);
    }

    @Override
    public void changeFragment(Fragment fragment) {
        if (fragment != null)
            application.replaceFragment(fragment);
    }
}
