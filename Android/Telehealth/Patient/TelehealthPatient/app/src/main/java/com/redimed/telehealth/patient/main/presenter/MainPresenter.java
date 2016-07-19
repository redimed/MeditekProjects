package com.redimed.telehealth.patient.main.presenter;

import android.content.Context;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;

import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.main.view.IMainView;

/**
 * Created by Fox on 1/14/2016.
 */
public class MainPresenter implements IMainPresenter {

    private Context context;
    private IMainView iMainView;
    private FragmentActivity activity;
    private static final String TAG = "=====MAIN=====";

    //Constructor
    public MainPresenter(Context context, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
    }

    @Override
    public void replaceFragment(Fragment fragment) {
        if (fragment != null){
            final FragmentManager fragmentManager = activity.getSupportFragmentManager();
            final int newBackStackLength = fragmentManager.getBackStackEntryCount() + 1;

            fragmentManager.beginTransaction()
                    .replace(R.id.frame_container, fragment)
                    .addToBackStack(null)
                    .commit();

            fragmentManager.addOnBackStackChangedListener(new FragmentManager.OnBackStackChangedListener() {
                @Override
                public void onBackStackChanged() {
                    int nowCount = fragmentManager.getBackStackEntryCount();
                    if (newBackStackLength != nowCount) {
                        fragmentManager.removeOnBackStackChangedListener(this);

                        if (newBackStackLength > nowCount) {
                            fragmentManager.popBackStackImmediate();
                        }
                    }
                }
            });
        }
    }
}
